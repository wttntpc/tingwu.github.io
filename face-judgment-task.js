(function exposeFaceJudgmentTask(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.FaceJudgmentTask = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createFaceJudgmentTaskApi() {
  // Ambiguous-face judgment: each face lies on a sad (0) to happy (1) continuum and the
  // person answers "happy" or "sad". The psychometric curve shows where answers flip.
  const LEVELS = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];

  function shuffle(items, random) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function createTrials({ repeats = 4, levels = LEVELS } = {}, random = Math.random) {
    if (!Number.isInteger(repeats) || repeats <= 0) throw new Error('repeats must be a positive integer');
    const trials = [];
    for (const level of levels) {
      for (let i = 0; i < repeats; i++) trials.push({ level, response: null, rt: null });
    }
    return shuffle(trials, random);
  }

  function createPracticeTrials(random = Math.random) {
    // Clear faces only, so people learn the controls before the ambiguous ones.
    return shuffle([0, 0, 1, 1, 0.125, 0.875].map(level => ({ level, response: null, rt: null, practice: true })), random);
  }

  function proportionsByLevel(trials) {
    return LEVELS.map(level => {
      const answered = trials.filter(trial => trial.level === level && (trial.response === 'happy' || trial.response === 'sad'));
      const happy = answered.filter(trial => trial.response === 'happy').length;
      return { level, n: answered.length, happy, proportionHappy: answered.length ? happy / answered.length : null };
    });
  }

  // Maximum-likelihood logistic fit with Newton-Raphson. A tiny ridge keeps the step finite.
  function fitLogistic(points) {
    let b0 = 0;
    let b1 = 1;
    for (let iteration = 0; iteration < 60; iteration++) {
      let g0 = 0; let g1 = 0; let h00 = 1e-6; let h01 = 0; let h11 = 1e-6;
      for (const { x, y, n } of points) {
        const p = 1 / (1 + Math.exp(-(b0 + b1 * x)));
        const w = n * p * (1 - p);
        g0 += y - n * p;
        g1 += (y - n * p) * x;
        h00 += w; h01 += w * x; h11 += w * x * x;
      }
      const det = h00 * h11 - h01 * h01;
      if (!Number.isFinite(det) || Math.abs(det) < 1e-12) return null;
      const d0 = (h11 * g0 - h01 * g1) / det;
      const d1 = (-h01 * g0 + h00 * g1) / det;
      b0 += d0; b1 += d1;
      if (!Number.isFinite(b0) || !Number.isFinite(b1) || Math.abs(b1) > 80) return null;
      if (Math.abs(d0) + Math.abs(d1) < 1e-8) break;
    }
    return { b0, b1 };
  }

  function crossingPoint(rows) {
    // Linear interpolation of the 50% crossing, used when a logistic fit is not defined.
    const known = rows.filter(row => row.proportionHappy !== null);
    for (let i = 1; i < known.length; i++) {
      const a = known[i - 1]; const b = known[i];
      if ((a.proportionHappy - 0.5) * (b.proportionHappy - 0.5) <= 0 && a.proportionHappy !== b.proportionHappy) {
        return a.level + (0.5 - a.proportionHappy) * (b.level - a.level) / (b.proportionHappy - a.proportionHappy);
      }
    }
    return null;
  }

  function median(values) {
    if (!values.length) return null;
    const ordered = values.slice().sort((a, b) => a - b);
    const middle = Math.floor(ordered.length / 2);
    return ordered.length % 2 ? ordered[middle] : (ordered[middle - 1] + ordered[middle]) / 2;
  }

  function summarizeTrials(trials) {
    const answered = trials.filter(trial => trial.response === 'happy' || trial.response === 'sad');
    const rows = proportionsByLevel(answered);
    const points = rows.filter(row => row.n > 0).map(row => ({ x: row.level, y: row.happy, n: row.n }));
    const fit = points.length >= 3 ? fitLogistic(points) : null;
    const clearSad = rows[0]; const clearHappy = rows[rows.length - 1];
    const clearAccuracy = clearSad.n + clearHappy.n
      ? ((clearSad.n - clearSad.happy) + clearHappy.happy) / (clearSad.n + clearHappy.n)
      : null;
    let pse = null; let slope = null; let method = 'none';
    if (fit && fit.b1 > 0.5) {
      pse = -fit.b0 / fit.b1;
      slope = fit.b1;
      method = 'logistic';
    } else {
      pse = crossingPoint(rows);
      method = pse === null ? 'none' : 'interpolation';
    }
    if (pse !== null && (pse < 0 || pse > 1)) {
      // The curve never reaches 50% inside the tested range, so no balance point can be stated.
      pse = null;
      slope = null;
      method = 'out-of-range';
    }
    return {
      rows,
      pse,
      slope,
      method,
      fit,
      clearAccuracy,
      medianRt: median(answered.filter(trial => Number.isFinite(trial.rt)).map(trial => trial.rt)),
      answeredCount: answered.length,
      totalCount: trials.length,
      timeoutCount: trials.length - answered.length
    };
  }

  function predictLogistic(fit, x) {
    return 1 / (1 + Math.exp(-(fit.b0 + fit.b1 * x)));
  }

  return { LEVELS: LEVELS.slice(), createTrials, createPracticeTrials, summarizeTrials, fitLogistic, predictLogistic };
});
