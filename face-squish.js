(function exposeFaceSquish(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.FaceSquish = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createFaceSquishApi() {
  // A soft rubber sheet. Every vertex of a regular grid is pulled towards
  //   target_i = rest_i + w_i * d
  // where d is the (soft-limited) drag vector and w_i a Gaussian of the distance
  // between rest_i and the grab point. Each vertex is a damped spring, so the
  // sheet follows the pointer with a little lag and wobbles back when released.
  //
  // Because every vertex is driven by the same linear spring, the deformation is
  //   pos_i(t) = rest_i + w_i * u(t)
  // with u(t) a filtered copy of d. The map x -> x + w(x) u only folds over when
  // |u| * max|grad w| >= 1, and max|grad w| = e^(-1/2) / sigma, so limiting |u|
  // (including the spring's overshoot) keeps the picture from ever tearing.

  const DEFAULTS = { cols: 14, rows: 18, sigma: 0.2, stiffness: 230, damping: 11, maxPullInSigmas: 1.15, aspect: 0.8 };
  const GRAD_PEAK = Math.exp(-0.5); // max |dw/dx| in units of 1/sigma

  function create(options) {
    const o = Object.assign({}, DEFAULTS, options);
    const cols = o.cols, rows = o.rows;
    const n = (cols + 1) * (rows + 1);
    const rx = new Float32Array(n), ry = new Float32Array(n);
    const x = new Float32Array(n), y = new Float32Array(n);
    const vx = new Float32Array(n), vy = new Float32Array(n);
    for (let j = 0; j <= rows; j++) {
      for (let i = 0; i <= cols; i++) {
        const k = j * (cols + 1) + i;
        rx[k] = x[k] = i / cols;
        ry[k] = y[k] = j / rows;
      }
    }
    const indices = new Uint16Array(cols * rows * 6);
    let t = 0;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const a = j * (cols + 1) + i, b = a + 1, c = a + (cols + 1), d = c + 1;
        indices.set([a, b, c, b, d, c], t);
        t += 6;
      }
    }
    // distances are measured in a square (aspect-corrected) space so the bump is round
    const sx = o.aspect;
    const weights = new Float32Array(n);
    const state = { grab: null, dx: 0, dy: 0 };
    const maxPull = o.maxPullInSigmas * o.sigma;

    function softLimit(dx, dy) {
      const m = Math.hypot(dx, dy);
      if (m < 1e-9) return [0, 0];
      const s = Math.tanh(m / maxPull) * maxPull / m;
      return [dx * s, dy * s];
    }

    function grab(px, py) {
      state.grab = { x: px, y: py };
      state.dx = 0; state.dy = 0;
      const inv = 1 / (2 * o.sigma * o.sigma);
      for (let k = 0; k < n; k++) {
        const ddx = (rx[k] - px) * sx, ddy = ry[k] - py;
        weights[k] = Math.exp(-(ddx * ddx + ddy * ddy) * inv);
      }
    }
    function drag(px, py) {
      if (!state.grab) return;
      const [dx, dy] = softLimit(px - state.grab.x, py - state.grab.y);
      state.dx = dx; state.dy = dy;
    }
    function release() {
      state.grab = null; state.dx = 0; state.dy = 0;
    }

    function step(dt) {
      const h = 1 / 240;
      let left = Math.min(dt, 0.05);
      while (left > 1e-9) {
        const s = Math.min(h, left);
        left -= s;
        for (let k = 0; k < n; k++) {
          const w = state.grab ? weights[k] : 0;
          const tx = rx[k] + w * state.dx, ty = ry[k] + w * state.dy;
          vx[k] += (-o.stiffness * (x[k] - tx) - o.damping * vx[k]) * s;
          vy[k] += (-o.stiffness * (y[k] - ty) - o.damping * vy[k]) * s;
          x[k] += vx[k] * s;
          y[k] += vy[k] * s;
        }
      }
    }

    function energy() {
      let e = 0;
      for (let k = 0; k < n; k++) {
        e = Math.max(e, Math.abs(x[k] - rx[k]), Math.abs(y[k] - ry[k]), Math.abs(vx[k]) * 0.05, Math.abs(vy[k]) * 0.05);
      }
      return e;
    }
    function settle() {
      for (let k = 0; k < n; k++) { x[k] = rx[k]; y[k] = ry[k]; vx[k] = vy[k] = 0; }
    }
    // smallest signed triangle area ratio versus the rest mesh: > 0 means nothing is flipped
    function minOrientation() {
      let min = Infinity;
      for (let q = 0; q < indices.length; q += 3) {
        const a = indices[q], b = indices[q + 1], c = indices[q + 2];
        const rest = (rx[b] - rx[a]) * (ry[c] - ry[a]) - (rx[c] - rx[a]) * (ry[b] - ry[a]);
        const now = (x[b] - x[a]) * (y[c] - y[a]) - (x[c] - x[a]) * (y[b] - y[a]);
        min = Math.min(min, now / rest);
      }
      return min;
    }

    return { options: o, cols, rows, count: n, rest: { x: rx, y: ry }, pos: { x, y }, vel: { x: vx, y: vy }, indices,
      grab, drag, release, step, energy, settle, minOrientation, state, maxPull,
      isGrabbed: () => !!state.grab };
  }

  // sigma at which a pull of maxPull stays below the fold-over limit, for documentation and tests
  function foldLimit(sigma, overshoot) {
    return 1 / (GRAD_PEAK / sigma) / (1 + (overshoot || 0));
  }

  return { create, foldLimit, DEFAULTS };
});
