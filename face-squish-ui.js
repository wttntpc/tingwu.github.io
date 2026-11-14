(function exposeFaceSquishUI(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.FaceSquishUI = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createFaceSquishUIApi() {
  const VERT = 'attribute vec2 aRest; attribute vec2 aPos; varying vec2 vUv;' +
    'void main(){ vUv = aRest; gl_Position = vec4(aPos.x * 2.0 - 1.0, 1.0 - aPos.y * 2.0, 0.0, 1.0); }';
  const FRAG = 'precision mediump float; uniform sampler2D uTex; varying vec2 vUv;' +
    'void main(){ gl_FragColor = texture2D(uTex, vUv); }';

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('image failed: ' + src));
      img.src = src;
    });
  }

  function compile(gl, type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  // Replaces the contents of `container` with a canvas that shows `src` as a rubber sheet.
  // Resolves to a handle with destroy(); rejects (leaving the container untouched) when the
  // image or WebGL is unavailable, so the caller keeps its static fallback.
  async function mount(container, opts) {
    const Core = (typeof require === 'function' && typeof module === 'object') ? require('./face-squish.js') : globalThis.FaceSquish;
    const img = await loadImage(opts.src);
    const canvas = document.createElement('canvas');
    canvas.className = 'face-squish-canvas';
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', opts.alt || '');
    const gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: true, alpha: true });
    if (!gl) throw new Error('webgl unavailable');

    const sim = Core.create({ aspect: (opts.aspect || 0.8) });
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);

    const restBuf = gl.createBuffer();
    const rest = new Float32Array(sim.count * 2);
    for (let k = 0; k < sim.count; k++) { rest[2 * k] = sim.rest.x[k]; rest[2 * k + 1] = sim.rest.y[k]; }
    gl.bindBuffer(gl.ARRAY_BUFFER, restBuf);
    gl.bufferData(gl.ARRAY_BUFFER, rest, gl.STATIC_DRAW);
    const aRest = gl.getAttribLocation(prog, 'aRest');
    gl.enableVertexAttribArray(aRest);
    gl.vertexAttribPointer(aRest, 2, gl.FLOAT, false, 0, 0);

    const posBuf = gl.createBuffer();
    const pos = new Float32Array(sim.count * 2);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, pos, gl.DYNAMIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const idxBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sim.indices, gl.STATIC_DRAW);

    // cover-fit the photo into the box so it is not distorted before the user touches it
    const box = document.createElement('canvas');
    const fit = (w, h) => {
      box.width = w; box.height = h;
      const c = box.getContext('2d');
      const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
      const fy = opts.focusY == null ? 0.35 : opts.focusY; // keep faces, not chests
      c.drawImage(img, (w - dw) / 2, (h - dh) * fy, dw, dh);
    };
    const tex = gl.createTexture();
    const upload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, box);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, last = 0, destroyed = false;
    const size = { w: 0, h: 0 };

    function draw() {
      for (let k = 0; k < sim.count; k++) { pos[2 * k] = sim.pos.x[k]; pos[2 * k + 1] = sim.pos.y[k]; }
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, pos);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, sim.indices.length, gl.UNSIGNED_SHORT, 0);
    }
    function resize() {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(2, Math.round(r.width * dpr)), h = Math.max(2, Math.round(r.height * dpr));
      if (w === size.w && h === size.h) return;
      size.w = w; size.h = h;
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
      fit(w, h);
      upload();
      draw();
    }
    function frame(now) {
      raf = 0;
      if (destroyed) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      sim.step(dt);
      draw();
      if (sim.isGrabbed() || sim.energy() > 2e-4) raf = requestAnimationFrame(frame);
      else { sim.settle(); draw(); last = 0; }
    }
    function wake() { if (!raf && !destroyed) { last = 0; raf = requestAnimationFrame(frame); } }

    const toLocal = (e) => {
      const r = canvas.getBoundingClientRect();
      return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
    };
    let active = null;
    canvas.addEventListener('pointerdown', (e) => {
      if (e.button != null && e.button > 0) return;
      active = e.pointerId;
      canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
      const [x, y] = toLocal(e);
      sim.grab(x, y);
      canvas.classList.add('is-grabbing');
      container.classList.add('is-touched');
      wake();
      e.preventDefault();
    });
    canvas.addEventListener('pointermove', (e) => {
      if (active !== e.pointerId) return;
      const [x, y] = toLocal(e);
      sim.drag(x, y);
      wake();
    });
    const end = (e) => {
      if (active !== e.pointerId) return;
      active = null;
      sim.release();
      canvas.classList.remove('is-grabbing');
      wake();
    };
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
    canvas.addEventListener('lostpointercapture', end);

    // keyboard: arrow keys give the face a gentle shove so it is not mouse-only
    canvas.tabIndex = 0;
    canvas.addEventListener('keydown', (e) => {
      const dir = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
      if (!dir) return;
      e.preventDefault();
      sim.grab(0.5, 0.5);
      sim.drag(0.5 + dir[0] * 0.18, 0.5 + dir[1] * 0.18);
      wake();
      setTimeout(() => { sim.release(); wake(); }, 220);
    });

    if (reduce) { sim.options.damping = 26; }

    container.textContent = '';
    container.classList.add('has-face-squish');
    container.removeAttribute('role');
    container.removeAttribute('aria-label');
    container.appendChild(canvas);
    if (opts.hint) {
      const hint = document.createElement('span');
      hint.className = 'face-hint';
      hint.setAttribute('aria-hidden', 'true');
      hint.textContent = opts.hint;
      container.appendChild(hint);
    }
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(canvas);
    resize();

    return {
      canvas, sim,
      destroy() {
        destroyed = true;
        if (raf) cancelAnimationFrame(raf);
        if (ro) ro.disconnect();
        const lose = gl.getExtension('WEBGL_lose_context');
        if (lose) lose.loseContext();
      }
    };
  }

  return { mount };
});
