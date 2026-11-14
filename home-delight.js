(function exposeHomeDelight(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HomeDelight = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createHomeDelightApi() {
  // Small touches: numbers that count up when they scroll into view, and a heartbeat on the TW mark.

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  // value shown at time t (ms) of a count-up from 0 to `target`
  function countValue(target, t, duration) {
    if (!(duration > 0) || t >= duration) return target;
    if (t <= 0) return 0;
    return Math.round(target * easeOutCubic(t / duration));
  }

  let observer = null;

  function countUp(els, opts) {
    if (typeof document === 'undefined') return;
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = (opts && opts.duration) || 900;
    if (reduce || typeof IntersectionObserver !== 'function') return; // leave the real numbers in place
    if (observer) observer.disconnect();
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const el = entry.target, target = Number(el.dataset.target);
        const t0 = performance.now();
        const tick = (now) => {
          if (!el.isConnected) return;
          const v = countValue(target, now - t0, duration);
          el.textContent = String(v);
          if (v < target) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    els.forEach((el) => {
      const target = parseInt(el.textContent, 10);
      if (!Number.isFinite(target)) return;
      el.dataset.target = String(target);
      el.textContent = '0';
      el.setAttribute('aria-label', String(target));
      observer.observe(el);
    });
  }

  function stopCounting() {
    if (observer) { observer.disconnect(); observer = null; }
  }

  let beatBound = false;
  function bindHeartbeat() {
    if (beatBound || typeof document === 'undefined') return;
    const mark = document.querySelector('.brand-mark');
    if (!mark) return;
    beatBound = true;
    mark.addEventListener('click', () => {
      mark.classList.remove('is-beating');
      void mark.offsetWidth; // restart the animation
      mark.classList.add('is-beating');
    });
    mark.addEventListener('animationend', () => mark.classList.remove('is-beating'));
  }

  return { countValue, countUp, stopCounting, bindHeartbeat };
});
