(function exposeChipPhysics(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ChipPhysics = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createChipPhysicsApi() {
  // Rectangular "chips" that can be picked up and thrown inside a box. They bounce off the walls and
  // each other, and a weak spring slowly floats every chip back to its home position, so the layout
  // always recovers on its own.

  const DEFAULTS = { stiffness: 16, damping: 5.5, restitution: 0.55, maxSpeed: 1800, wallBounce: 0.6, freeFlight: 0.45, fadeIn: 0.9, airDamping: 0.9 };

  function create(width, height, rects, options) {
    const o = Object.assign({}, DEFAULTS, options);
    const bodies = rects.map((r, i) => ({
      id: i, x: r.x, y: r.y, w: r.w, h: r.h, hx: r.x, hy: r.y, vx: 0, vy: 0, dragging: false, age: 9
    }));
    const world = { width, height, bodies, options: o };

    function clampInside(b) {
      const maxX = Math.max(0, world.width - b.w), maxY = Math.max(0, world.height - b.h);
      let hit = false;
      if (b.x < 0) { b.x = 0; if (b.vx < 0) b.vx *= -o.wallBounce; hit = true; }
      else if (b.x > maxX) { b.x = maxX; if (b.vx > 0) b.vx *= -o.wallBounce; hit = true; }
      if (b.y < 0) { b.y = 0; if (b.vy < 0) b.vy *= -o.wallBounce; hit = true; }
      else if (b.y > maxY) { b.y = maxY; if (b.vy > 0) b.vy *= -o.wallBounce; hit = true; }
      return hit;
    }

    function fits(body, dx, dy) {
      const x = body.x + dx, y = body.y + dy;
      return x >= -0.001 && y >= -0.001 && x + body.w <= world.width + 0.001 && y + body.h <= world.height + 0.001;
    }

    function collide(a, b) {
      const dx = (a.x + a.w / 2) - (b.x + b.w / 2), dy = (a.y + a.h / 2) - (b.y + b.h / 2);
      const px = (a.w + b.w) / 2 - Math.abs(dx), py = (a.h + b.h) / 2 - Math.abs(dy);
      if (px <= 0 || py <= 0) return;
      // chips that are only drifting home pass through each other; otherwise one can get stuck behind another's home
      const flying = (c) => c.dragging || c.age < o.freeFlight + 0.5;
      if (!flying(a) && !flying(b)) return;
      // a dragged chip is immovable
      const aw = a.dragging ? 0 : 1, bw = b.dragging ? 0 : 1, total = aw + bw;
      if (total === 0) return;
      const sx = dx >= 0 ? 1 : -1, sy = dy >= 0 ? 1 : -1;
      // try the axis of least penetration first, then the other one if a wall is in the way
      const options = px < py ? [[sx, 0, px], [0, sy, py]] : [[0, sy, py], [sx, 0, px]];
      let pick = options[0];
      for (const [nx, ny, pen] of options) {
        const okA = !aw || fits(a, nx * pen * (aw / total), ny * pen * (aw / total));
        const okB = !bw || fits(b, -nx * pen * (bw / total), -ny * pen * (bw / total));
        if (okA && okB) { pick = [nx, ny, pen]; break; }
      }
      const [nx, ny, pen] = pick;
      a.x += nx * pen * (aw / total); a.y += ny * pen * (aw / total);
      b.x -= nx * pen * (bw / total); b.y -= ny * pen * (bw / total);
      const rv = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny; // relative speed along the normal
      if (rv < 0) {
        const j = -(1 + o.restitution) * rv / total;
        a.vx += j * aw * nx; a.vy += j * aw * ny;
        b.vx -= j * bw * nx; b.vy -= j * bw * ny;
      }
    }

    function step(dt) {
      const h = 1 / 120;
      let left = Math.min(dt, 0.05);
      while (left > 1e-9) {
        const s = Math.min(h, left);
        left -= s;
        for (const b of bodies) {
          if (b.dragging) continue;
          b.age += s;
          const f = Math.min(1, Math.max(0, (b.age - o.freeFlight) / o.fadeIn));
          const k = o.stiffness * f, c = o.airDamping + (o.damping - o.airDamping) * f;
          b.vx += (k * (b.hx - b.x) - c * b.vx) * s;
          b.vy += (k * (b.hy - b.y) - c * b.vy) * s;
          const sp = Math.hypot(b.vx, b.vy);
          if (sp > o.maxSpeed) { b.vx *= o.maxSpeed / sp; b.vy *= o.maxSpeed / sp; }
          b.x += b.vx * s; b.y += b.vy * s;
        }
        for (let pass = 0; pass < 2; pass++) {
          for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) collide(bodies[i], bodies[j]);
        }
        for (const b of bodies) clampInside(b);
      }
    }

    function grab(i) { const b = bodies[i]; b.dragging = true; b.vx = 0; b.vy = 0; b.age = 0; }
    function moveTo(i, x, y) { const b = bodies[i]; b.x = x; b.y = y; clampInside(b); b.vx = 0; b.vy = 0; }
    function release(i, vx, vy) {
      const b = bodies[i]; b.dragging = false; b.age = 0;
      const sp = Math.hypot(vx, vy);
      const k = sp > o.maxSpeed ? o.maxSpeed / sp : 1;
      b.vx = vx * k; b.vy = vy * k;
    }
    function energy() {
      let e = 0;
      for (const b of bodies) e = Math.max(e, Math.abs(b.x - b.hx), Math.abs(b.y - b.hy), Math.abs(b.vx) * 0.05, Math.abs(b.vy) * 0.05);
      return e;
    }
    function settle() { for (const b of bodies) { b.x = b.hx; b.y = b.hy; b.vx = b.vy = 0; b.dragging = false; } }
    function overlaps() {
      let n = 0;
      for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i], b = bodies[j];
        if (a.x < b.x + b.w - 0.5 && b.x < a.x + a.w - 0.5 && a.y < b.y + b.h - 0.5 && b.y < a.y + a.h - 0.5) n++;
      }
      return n;
    }
    return { world, bodies, step, grab, moveTo, release, energy, settle, overlaps, resize(w, h) { world.width = w; world.height = h; } };
  }

  // ---- DOM part ----
  // Turns the <li> children of `list` into draggable, throwable chips. Returns a handle with destroy().
  function mount(list, opts) {
    const items = Array.from(list.children);
    if (items.length < 2 || typeof document === 'undefined') return null;
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const extra = (opts && opts.extraHeight) == null ? 44 : opts.extraHeight;
    let sim = null, raf = 0, last = 0, destroyed = false, drag = null;

    function measure() {
      list.classList.remove('is-physics');
      list.style.height = '';
      items.forEach((li) => { li.style.transform = ''; li.style.width = ''; li.style.height = ''; });
      const box = list.getBoundingClientRect();
      const rects = items.map((li) => {
        const r = li.getBoundingClientRect();
        return { x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height };
      });
      const H = box.height + extra;
      list.style.height = H + 'px';
      list.classList.add('is-physics');
      items.forEach((li, i) => { li.style.width = rects[i].w + 'px'; li.style.height = rects[i].h + 'px'; });
      sim = create(box.width, H, rects, opts && opts.physics);
      draw();
    }
    function draw() {
      sim.bodies.forEach((b, i) => { items[i].style.transform = 'translate(' + b.x.toFixed(1) + 'px,' + b.y.toFixed(1) + 'px)'; });
    }
    function frame(now) {
      raf = 0;
      if (destroyed) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      sim.step(dt);
      draw();
      if (drag || sim.energy() > 0.3) raf = requestAnimationFrame(frame);
      else { sim.settle(); draw(); last = 0; }
    }
    function wake() { if (!raf && !destroyed) { last = 0; raf = requestAnimationFrame(frame); } }

    const down = (e) => {
      if (e.button != null && e.button > 0) return;
      const li = e.currentTarget, i = items.indexOf(li);
      const box = list.getBoundingClientRect();
      const b = sim.bodies[i];
      drag = { i, dx: e.clientX - box.left - b.x, dy: e.clientY - box.top - b.y, id: e.pointerId, samples: [] };
      sim.grab(i);
      li.classList.add('is-dragging');
      li.setPointerCapture && li.setPointerCapture(e.pointerId);
      wake();
      e.preventDefault();
    };
    const move = (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      const box = list.getBoundingClientRect();
      const x = e.clientX - box.left - drag.dx, y = e.clientY - box.top - drag.dy;
      const t = performance.now();
      drag.samples.push([t, x, y]);
      while (drag.samples.length > 2 && t - drag.samples[0][0] > 90) drag.samples.shift();
      sim.moveTo(drag.i, x, y);
      wake();
    };
    const up = (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      const s = drag.samples;
      let vx = 0, vy = 0;
      if (!reduce && s.length >= 2) {
        const a = s[0], b = s[s.length - 1], dt = (b[0] - a[0]) / 1000;
        if (dt > 0.005 && performance.now() - b[0] < 80) { vx = (b[1] - a[1]) / dt; vy = (b[2] - a[2]) / dt; }
      }
      sim.release(drag.i, vx, vy);
      items[drag.i].classList.remove('is-dragging');
      drag = null;
      wake();
    };
    items.forEach((li) => {
      li.addEventListener('pointerdown', down);
      li.addEventListener('pointermove', move);
      li.addEventListener('pointerup', up);
      li.addEventListener('pointercancel', up);
    });

    let widthSeen = list.getBoundingClientRect().width;
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => {
      const w = list.getBoundingClientRect().width;
      if (Math.abs(w - widthSeen) < 1 || drag) return;
      widthSeen = w;
      measure();
    }) : null;
    // wait for fonts so chip widths are final
    const ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    ready.then(() => { if (!destroyed) { measure(); if (ro) ro.observe(list); } });

    return {
      destroy() {
        destroyed = true;
        if (raf) cancelAnimationFrame(raf);
        if (ro) ro.disconnect();
        list.classList.remove('is-physics');
        list.style.height = '';
        items.forEach((li) => { li.style.transform = ''; li.style.width = ''; li.style.height = ''; });
      }
    };
  }

  return { create, mount, DEFAULTS };
});
