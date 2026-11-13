(function exposeSchematicFace(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SchematicFace = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createSchematicFaceApi() {
  // A drawn (not photographed) face whose mouth and brows move smoothly from sad (0) to happy (1).
  // It carries no personal likeness and needs no image licence, so it is safe for a public demo.
  const clamp = value => Math.min(1, Math.max(0, Number(value)));

  function faceGeometry(value) {
    const v = clamp(value);
    const c = (v - 0.5) * 2; // -1 sad ... +1 happy
    const round = n => Math.round(n * 10) / 10;
    // Sad: inner brow ends rise. Happy: both brows lift slightly but stay level (a tilted-down brow would read as anger).
    const sadTilt = Math.max(0, -c) * 5;
    const lift = Math.max(0, c) * 2;
    return {
      value: v,
      mouth: `M 31 69 Q 50 ${round(69 + 17 * c)} 69 69`,
      leftBrow: { x1: 24, y1: round(34 + sadTilt - lift), x2: 41, y2: round(34 - sadTilt - lift) },
      rightBrow: { x1: 59, y1: round(34 - sadTilt - lift), x2: 76, y2: round(34 + sadTilt - lift) }
    };
  }

  function faceSvg(value, options = {}) {
    const g = faceGeometry(value);
    const label = options.label || '';
    const ring = options.ring ? `<circle cx="50" cy="50" r="47" class="schematic-face-ring"/>` : '';
    const aria = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
    return `<svg class="schematic-face" viewBox="0 0 100 100" width="160" height="160" ${aria} focusable="false">`
      + `<circle cx="50" cy="50" r="42" class="schematic-face-skin"/>${ring}`
      + `<line x1="${g.leftBrow.x1}" y1="${g.leftBrow.y1}" x2="${g.leftBrow.x2}" y2="${g.leftBrow.y2}" class="schematic-face-line"/>`
      + `<line x1="${g.rightBrow.x1}" y1="${g.rightBrow.y1}" x2="${g.rightBrow.x2}" y2="${g.rightBrow.y2}" class="schematic-face-line"/>`
      + `<circle cx="36" cy="46" r="3.4" class="schematic-face-eye"/><circle cx="64" cy="46" r="3.4" class="schematic-face-eye"/>`
      + `<path d="${g.mouth}" class="schematic-face-line schematic-face-mouth" fill="none"/></svg>`;
  }

  return { faceGeometry, faceSvg };
});
