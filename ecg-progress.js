(function exposeEcgProgress(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.EcgProgress = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createEcgProgressApi() {
  // A reading-progress bar drawn as an ECG trace. The waveform is synthetic: one PQRST complex per
  // beat, with the beat-to-beat interval wobbling a little (a nod to heart-rate variability).

  const WAVES = [ // [centre in beat, amplitude (+ = up), width]
    [0.18, 0.14, 0.035],   // P
    [0.355, -0.14, 0.009], // Q
    [0.40, 1.0, 0.011],    // R
    [0.445, -0.26, 0.011], // S
    [0.68, 0.30, 0.055]    // T
  ];

  function beatValue(t) {
    let v = 0;
    for (const [c, a, w] of WAVES) v += a * Math.exp(-((t - c) * (t - c)) / (2 * w * w));
    return v;
  }

  // Beat start positions across `width` pixels. spacing wobbles by +-variability.
  function beatStarts(width, beatWidth, variability) {
    const starts = [];
    let x = -beatWidth * 0.2; // begin part-way through a beat so the line does not open flat
    let k = 0;
    while (x < width + beatWidth) {
      starts.push(x);
      x += beatWidth * (1 + (variability || 0) * Math.sin((2 * Math.PI * k) / 5.3));
      k++;
    }
    return starts;
  }

  // Points [x, y] across the width. baseline is the y of the flat line, amplitude the height of the R peak in px.
  function points(width, opts) {
    const o = Object.assign({ baseline: 13, amplitude: 11, beatWidth: Math.max(70, Math.min(110, width / 9)), variability: 0.07, step: 1.5 }, opts);
    const starts = beatStarts(width, o.beatWidth, o.variability);
    const out = [];
    for (let x = 0; x <= width + 0.0001; x += o.step) {
      // find the beat this x belongs to
      let i = 0;
      while (i + 1 < starts.length && starts[i + 1] <= x) i++;
      const len = (starts[i + 1] || starts[i] + o.beatWidth) - starts[i];
      const t = (x - starts[i]) / len;
      out.push([x, o.baseline - o.amplitude * beatValue(t)]);
    }
    return out;
  }

  function toPath(pts) {
    return pts.map(([x, y], i) => (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(2)).join('');
  }

  // 0..1 reading progress; null when the page is too short to scroll
  function progress(scrollTop, scrollHeight, clientHeight, minScrollable) {
    const scrollable = scrollHeight - clientHeight;
    if (!(scrollable > (minScrollable == null ? 80 : minScrollable))) return null;
    return Math.min(1, Math.max(0, scrollTop / scrollable));
  }

  function yAt(pts, x) {
    let best = pts[0];
    for (const p of pts) { if (p[0] <= x) best = p; else break; }
    return best[1];
  }

  // ---- DOM part ----
  const ROUTES = [/^\/post\//, /^\/about(\/|$)/, /^\/disclaimer$/];
  const NS = 'http://www.w3.org/2000/svg';
  let state = null;

  function el(name, attrs) {
    const e = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach((k) => e.setAttribute(k, attrs[k]));
    return e;
  }

  function build(host) {
    const wrap = document.createElement('div');
    wrap.className = 'ecg-progress';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.hidden = true;
    const svg = el('svg', { class: 'ecg-svg', preserveAspectRatio: 'none' });
    const clip = el('clipPath', { id: 'ecg-clip' });
    const rect = el('rect', { x: 0, y: -4, height: 30, width: 0 });
    clip.appendChild(rect);
    const defs = el('defs');
    defs.appendChild(clip);
    const track = el('path', { class: 'ecg-track', fill: 'none' });
    const line = el('path', { class: 'ecg-line', fill: 'none', 'clip-path': 'url(#ecg-clip)' });
    const dot = el('circle', { class: 'ecg-dot', r: 2.6 });
    svg.append(defs, track, line, dot);
    wrap.appendChild(svg);
    host.appendChild(wrap);
    return { wrap, svg, rect, track, line, dot, pts: [], width: 0, height: 18 };
  }

  function layout() {
    const s = state;
    const w = Math.max(200, Math.round(s.wrap.getBoundingClientRect().width || window.innerWidth));
    if (w === s.width) return;
    s.width = w;
    s.svg.setAttribute('viewBox', '0 0 ' + w + ' ' + s.height);
    s.pts = points(w);
    const d = toPath(s.pts);
    s.track.setAttribute('d', d);
    s.line.setAttribute('d', d);
  }

  function update() {
    const s = state;
    if (!s || !s.active) return;
    const de = document.documentElement;
    const p = progress(window.pageYOffset || de.scrollTop, de.scrollHeight, de.clientHeight);
    if (p == null) { s.wrap.hidden = true; return; }
    s.wrap.hidden = false;
    layout();
    const x = p * s.width;
    s.rect.setAttribute('width', x.toFixed(1));
    s.dot.setAttribute('cx', x.toFixed(1));
    s.dot.setAttribute('cy', yAt(s.pts, x).toFixed(2));
    const done = p >= 0.985;
    if (done !== s.done) {
      s.done = done;
      s.wrap.classList.toggle('is-complete', done);
    }
  }

  function schedule() {
    if (!state || state.queued) return;
    state.queued = true;
    requestAnimationFrame(() => { state.queued = false; update(); });
  }

  function init(host) {
    if (state || typeof document === 'undefined') return;
    state = build(host || document.querySelector('.site-header'));
    state.active = false; state.done = false; state.queued = false;
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    if (typeof ResizeObserver === 'function') {
      state.ro = new ResizeObserver(schedule);
      const main = document.querySelector('#app');
      if (main) state.ro.observe(main);
    }
  }

  // Called after every route change.
  function sync(path) {
    if (typeof document === 'undefined') return;
    if (!state) init();
    if (!state) return;
    state.active = ROUTES.some((r) => r.test(path || '/'));
    state.done = false;
    state.wrap.classList.remove('is-complete');
    state.wrap.hidden = true;
    if (state.active) { state.width = 0; schedule(); setTimeout(schedule, 400); }
  }

  return { points, toPath, progress, beatValue, beatStarts, yAt, sync, ROUTES };
});
