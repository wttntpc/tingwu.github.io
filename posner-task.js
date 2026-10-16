(function exposePosnerTask(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PosnerTask = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createPosnerTaskApi() {
  const CONDITIONS = ['valid', 'invalid', 'neutral'];
  const SIDES = ['left', 'right'];

  function shuffle(items, random) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function createPosnerTrials(counts = { valid: 24, invalid: 12, neutral: 12 }, random = Math.random) {
    const trials = [];

    for (const condition of CONDITIONS) {
      const count = counts[condition];
      if (!Number.isInteger(count) || count <= 0 || count % 2 !== 0) {
        throw new Error(`${condition} count must be a positive even integer`);
      }

      for (let i = 0; i < count; i++) {
        const targetSide = SIDES[i % 2];
        const cueSide = condition === 'neutral'
          ? 'neutral'
          : condition === 'valid'
            ? targetSide
            : SIDES.find(side => side !== targetSide);
        trials.push({
          condition,
          cueSide,
          targetSide,
          correctKey: targetSide === 'left' ? 'ArrowLeft' : 'ArrowRight',
          correct: false,
          rt: null
        });
      }
    }

    return shuffle(trials, random);
  }

  function median(values) {
    if (!values.length) return null;
    const ordered = values.slice().sort((a, b) => a - b);
    const middle = Math.floor(ordered.length / 2);
    return ordered.length % 2
      ? ordered[middle]
      : (ordered[middle - 1] + ordered[middle]) / 2;
  }

  function summarizePosnerTrials(trials, limits = { minRt: 150, maxRt: 1500 }) {
    const conditions = {};
    let excludedCount = 0;

    for (const condition of CONDITIONS) {
      const conditionTrials = trials.filter(trial => trial.condition === condition);
      const usable = conditionTrials.filter(trial => (
        trial.correct
        && Number.isFinite(trial.rt)
        && trial.rt >= limits.minRt
        && trial.rt <= limits.maxRt
      ));
      excludedCount += conditionTrials.length - usable.length;
      conditions[condition] = {
        medianRt: median(usable.map(trial => trial.rt)),
        accuracy: conditionTrials.length
          ? conditionTrials.filter(trial => trial.correct).length / conditionTrials.length
          : null,
        usableCount: usable.length,
        totalCount: conditionTrials.length
      };
    }

    const validRt = conditions.valid.medianRt;
    const invalidRt = conditions.invalid.medianRt;
    return {
      conditions,
      cueingCost: validRt === null || invalidRt === null ? null : invalidRt - validRt,
      excludedCount,
      totalCount: trials.length
    };
  }

  return {
    CONDITIONS: CONDITIONS.slice(),
    SIDES: SIDES.slice(),
    createPosnerTrials,
    summarizePosnerTrials
  };
});
