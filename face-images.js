(function exposeFaceImages(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.FaceImages = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createFaceImagesApi() {
  // AI-generated, fictional portraits. Each of four identities has nine images that run from sad (level 0)
  // through neutral (level 4) to happy (level 8). Levels 0, 4 and 8 are generated images; the other six are
  // optical-flow blends between neighbouring generated images, so the steps are image-blend steps, not rated intensities.
  const IDENTITIES = ['a', 'b', 'c', 'd'];
  const LEVEL_COUNT = 9;
  const BASE = 'assets/emotion-faces/continuum/';
  const clamp = value => Math.min(1, Math.max(0, Number(value)));

  function levelIndex(value) {
    return Math.round(clamp(value) * (LEVEL_COUNT - 1));
  }

  function src(identity, value) {
    if (!IDENTITIES.includes(identity)) throw new Error(`unknown identity: ${identity}`);
    return `${BASE}identity-${identity}-level-${levelIndex(value)}.webp`;
  }

  function sources() {
    const list = [];
    for (const identity of IDENTITIES) for (let level = 0; level < LEVEL_COUNT; level++) list.push(src(identity, level / (LEVEL_COUNT - 1)));
    return list;
  }

  function faceHtml(value, options = {}) {
    const identity = options.identity || IDENTITIES[0];
    const label = options.label || '';
    const ring = options.ring ? ' has-ring' : '';
    const alt = label ? `alt="${label}"` : 'alt="" aria-hidden="true"';
    return `<span class="face-photo${ring}"><img src="${src(identity, value)}" ${alt} width="192" height="192" decoding="async" draggable="false"></span>`;
  }

  let held = [];
  function preload(onDone) {
    if (typeof Image === 'undefined') { if (onDone) onDone(); return; }
    let remaining = sources().length;
    const finish = () => { remaining -= 1; if (remaining === 0 && onDone) onDone(); };
    held = sources().map(url => { const image = new Image(); image.onload = finish; image.onerror = finish; image.src = url; return image; });
  }

  return { IDENTITIES: IDENTITIES.slice(), LEVEL_COUNT, levelIndex, src, sources, faceHtml, preload };
});
