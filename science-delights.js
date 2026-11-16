(function exposeScienceDelights(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ScienceDelights = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createScienceDelightsApi() {
  function gaussian(value, center, width) {
    const z = (value - center) / width;
    return Math.exp(-0.5 * z * z);
  }

  function eegValue(t) {
    return 0.2 * Math.sin(t * Math.PI * 8)
      + 0.12 * Math.sin(t * Math.PI * 19 + 0.8)
      + 0.07 * Math.sin(t * Math.PI * 37 + 1.7);
  }

  function hrvValue(t) {
    const beats = 3.45;
    const phase = (t * beats) % 1;
    return 0.08 * gaussian(phase, 0.16, 0.035)
      - 0.1 * gaussian(phase, 0.31, 0.018)
      + 0.88 * gaussian(phase, 0.35, 0.012)
      - 0.2 * gaussian(phase, 0.39, 0.02)
      + 0.19 * gaussian(phase, 0.64, 0.07);
  }

  function createSignalSpring(kind = 'eeg', count = 96) {
    const points = Math.max(16, count);
    const rest = new Float32Array(points);
    const values = new Float32Array(points);
    const velocities = new Float32Array(points);
    const weights = new Float32Array(points);
    for (let index = 0; index < points; index += 1) {
      const t = index / (points - 1);
      rest[index] = values[index] = kind === 'hrv' ? hrvValue(t) : eegValue(t);
    }
    let grabbed = false;
    let target = 0;

    function setWeights(center) {
      const safeCenter = Math.max(0, Math.min(1, center));
      for (let index = 0; index < points; index += 1) {
        const t = index / (points - 1);
        weights[index] = gaussian(t, safeCenter, 0.105);
      }
    }

    function grab(position) {
      grabbed = true;
      target = 0;
      setWeights(position);
    }

    function drag(position, displacement) {
      if (!grabbed) return;
      setWeights(position);
      target = Math.max(-0.55, Math.min(0.55, displacement));
    }

    function release() {
      grabbed = false;
      target = 0;
    }

    function pulse(position = 0.52) {
      setWeights(position);
      for (let index = 0; index < points; index += 1) velocities[index] -= weights[index] * 2.7;
    }

    function step(dt) {
      const elapsed = Math.max(0, Math.min(0.05, dt));
      const stiffness = 150;
      const damping = 14;
      for (let index = 0; index < points; index += 1) {
        const desired = rest[index] + weights[index] * target;
        const acceleration = (desired - values[index]) * stiffness - velocities[index] * damping;
        velocities[index] += acceleration * elapsed;
        values[index] += velocities[index] * elapsed;
      }
    }

    function energy() {
      let total = 0;
      for (let index = 0; index < points; index += 1) {
        total += Math.abs(values[index] - rest[index]) + Math.abs(velocities[index]) * 0.02;
      }
      return total / points;
    }

    return { kind, rest, values, velocities, grab, drag, release, pulse, step, energy, isGrabbed: () => grabbed };
  }

  function canvasSize(canvas) {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(2, typeof devicePixelRatio === 'number' ? devicePixelRatio : 1);
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    const pixelWidth = Math.round(width * ratio);
    const pixelHeight = Math.round(height * ratio);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    return { width, height, ratio };
  }

  function themeColors(element) {
    if (typeof getComputedStyle !== 'function') return { accent: '#1e3a5f', muted: '#cbc8bd' };
    const rootStyle = getComputedStyle(document.documentElement);
    return {
      accent: rootStyle.getPropertyValue('--accent').trim() || getComputedStyle(element).color,
      muted: rootStyle.getPropertyValue('--tertiary').trim() || '#cbc8bd'
    };
  }

  function mountSignal(button) {
    const canvas = button.querySelector('canvas');
    if (!canvas || button.dataset.scienceMounted) return null;
    button.dataset.scienceMounted = 'true';
    const kind = button.dataset.signalTug || 'eeg';
    const signal = createSignalSpring(kind, 120);
    const reduceMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let lastTime = 0;
    let startY = 0;

    function draw() {
      const { width, height, ratio } = canvasSize(canvas);
      const context = canvas.getContext('2d');
      if (!context) return;
      const colors = themeColors(button);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      const padding = 8;
      const usableHeight = Math.max(1, height - padding * 2);
      const baseline = kind === 'hrv' ? height * 0.68 : height * 0.5;
      const amplitude = kind === 'hrv' ? usableHeight * 0.62 : usableHeight * 0.76;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = colors.muted;
      context.lineWidth = 1;
      context.globalAlpha = 0.55;
      context.beginPath();
      signal.rest.forEach((value, index) => {
        const x = padding + index / (signal.rest.length - 1) * Math.max(1, width - padding * 2);
        const y = baseline - value * amplitude;
        if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
      });
      context.stroke();
      context.strokeStyle = colors.accent;
      context.lineWidth = 1.8;
      context.globalAlpha = 1;
      context.beginPath();
      signal.values.forEach((value, index) => {
        const x = padding + index / (signal.values.length - 1) * Math.max(1, width - padding * 2);
        const y = baseline - value * amplitude;
        if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
      });
      context.stroke();
    }

    function tick(now) {
      const dt = lastTime ? (now - lastTime) / 1000 : 1 / 60;
      lastTime = now;
      signal.step(dt);
      draw();
      if (signal.isGrabbed() || signal.energy() > 0.0015) frame = requestAnimationFrame(tick);
      else { frame = 0; lastTime = 0; }
    }

    function animate() {
      if (!frame && !reduceMotion) frame = requestAnimationFrame(tick);
      else draw();
    }

    function pointerPosition(event) {
      const rect = button.getBoundingClientRect();
      return Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(1, rect.width)));
    }

    function onPointerDown(event) {
      if (reduceMotion) return;
      startY = event.clientY;
      signal.grab(pointerPosition(event));
      button.setPointerCapture?.(event.pointerId);
      button.classList.add('is-tugging');
      animate();
    }

    function onPointerMove(event) {
      if (!signal.isGrabbed()) return;
      const rect = button.getBoundingClientRect();
      signal.drag(pointerPosition(event), (startY - event.clientY) / Math.max(42, rect.height) * 0.95);
    }

    function onPointerUp(event) {
      if (!signal.isGrabbed()) return;
      signal.release();
      button.releasePointerCapture?.(event.pointerId);
      button.classList.remove('is-tugging');
      animate();
    }

    function onClick(event) {
      if (event.detail !== 0 || reduceMotion) return;
      signal.pulse();
      animate();
    }

    button.addEventListener('pointerdown', onPointerDown);
    button.addEventListener('pointermove', onPointerMove);
    button.addEventListener('pointerup', onPointerUp);
    button.addEventListener('pointercancel', onPointerUp);
    button.addEventListener('click', onClick);
    const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(draw) : null;
    resize?.observe(button);
    draw();

    return {
      destroy() {
        if (frame) cancelAnimationFrame(frame);
        resize?.disconnect();
        button.removeEventListener('pointerdown', onPointerDown);
        button.removeEventListener('pointermove', onPointerMove);
        button.removeEventListener('pointerup', onPointerUp);
        button.removeEventListener('pointercancel', onPointerUp);
        button.removeEventListener('click', onClick);
        delete button.dataset.scienceMounted;
      }
    };
  }

  function mount(root) {
    if (!root || typeof root.querySelector !== 'function') return null;
    const handles = [];
    root.querySelectorAll('[data-signal-tug]').forEach(button => {
      const handle = mountSignal(button);
      if (handle) handles.push(handle);
    });
    return { destroy() { handles.forEach(handle => handle.destroy()); } };
  }

  return { createSignalSpring, mount };
});
