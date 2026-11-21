(function exposeEmotionFlankerTask(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.EmotionFlankerTask = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createEmotionFlankerTaskApi() {
  // Emotional-face flanker task. A central target face is flanked by two faces on each side.
  // The participant judges the target's expression (angry or happy) and ignores the flankers.
  // Flanker conditions: congruent (same expression), incongruent (the other expression), neutral.
  const TARGETS = ['angry', 'happy'];
  const FLANKERS = ['congruent', 'incongruent', 'neutral'];
  const IDENTITIES = ['a', 'b', 'c', 'd'];
  const LIMITS = { minRt: 150, maxRt: 1500 };

  function shuffle(items, random) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  // Which key answers which expression. Mapping A: left = angry, right = happy; mapping B is the reverse.
  function keyFor(target, mapping) {
    if (!TARGETS.includes(target)) throw new Error(`Unknown target expression: ${target}`);
    const angryLeft = mapping !== 'B';
    if (target === 'angry') return angryLeft ? 'left' : 'right';
    return angryLeft ? 'right' : 'left';
  }

  function flankerExpression(target, flanker) {
    if (flanker === 'congruent') return target;
    if (flanker === 'incongruent') return target === 'angry' ? 'happy' : 'angry';
    if (flanker === 'neutral') return 'neutral';
    throw new Error(`Unknown flanker condition: ${flanker}`);
  }

  function longestRun(trials) {
    let best = 0, run = 0, last = null;
    for (const trial of trials) {
      const key = `${trial.target}|${trial.flanker}`;
      run = key === last ? run + 1 : 1;
      last = key;
      best = Math.max(best, run);
    }
    return best;
  }

  // perCell trials for each target x flanker cell (6 cells), identities rotated evenly inside a cell.
  function createTrials(perCell = 8, mapping = 'A', random = Math.random, maxRun = 2) {
    if (!Number.isInteger(perCell) || perCell <= 0) throw new Error('perCell must be a positive integer');
    const trials = [];
    for (const target of TARGETS) {
      for (const flanker of FLANKERS) {
        const order = shuffle(IDENTITIES, random);
        for (let i = 0; i < perCell; i++) {
          trials.push({
            target, flanker,
            identity: order[i % order.length],
            flankerExpression: flankerExpression(target, flanker),
            correctKey: keyFor(target, mapping),
            response: null, rt: null, correct: false, timedOut: false
          });
        }
      }
    }
    let best = shuffle(trials, random);
    for (let attempt = 0; attempt < 300 && longestRun(best) > maxRun; attempt++) best = shuffle(trials, random);
    return best;
  }

  function median(values) {
    if (!values.length) return null;
    const ordered = values.slice().sort((a, b) => a - b);
    const middle = Math.floor(ordered.length / 2);
    return ordered.length % 2 ? ordered[middle] : (ordered[middle - 1] + ordered[middle]) / 2;
  }

  function subtract(a, b) { return a === null || b === null ? null : a - b; }

  function cell(trials, filter, limits) {
    const subset = trials.filter(filter);
    const answered = subset.filter(t => Number.isFinite(t.rt));
    const correct = answered.filter(t => t.correct);
    const usable = correct.filter(t => t.rt >= limits.minRt && t.rt <= limits.maxRt);
    return {
      count: subset.length,
      accuracy: subset.length ? correct.length / subset.length : null,
      medianRt: median(usable.map(t => t.rt)),
      usableCount: usable.length,
      timeouts: subset.filter(t => t.timedOut).length,
      excluded: correct.length - usable.length
    };
  }

  function summarizeTrials(trials, limits = LIMITS) {
    const byFlanker = {};
    for (const flanker of FLANKERS) byFlanker[flanker] = cell(trials, t => t.flanker === flanker, limits);
    const byTarget = {};
    for (const target of TARGETS) {
      byTarget[target] = {};
      for (const flanker of FLANKERS) byTarget[target][flanker] = cell(trials, t => t.target === target && t.flanker === flanker, limits);
    }
    const effect = (a, b, group) => subtract(group[a].medianRt, group[b].medianRt);
    const accDrop = (group) => (group.congruent.accuracy === null || group.incongruent.accuracy === null) ? null : group.congruent.accuracy - group.incongruent.accuracy;
    const interferenceAngry = effect('incongruent', 'congruent', byTarget.angry);
    const interferenceHappy = effect('incongruent', 'congruent', byTarget.happy);
    return {
      byFlanker, byTarget,
      interference: effect('incongruent', 'congruent', byFlanker),     // incongruent - congruent
      facilitation: effect('neutral', 'congruent', byFlanker),         // neutral - congruent
      conflictCost: effect('incongruent', 'neutral', byFlanker),       // incongruent - neutral
      accuracyDrop: accDrop(byFlanker),
      interferenceAngry, interferenceHappy,
      targetDifference: subtract(interferenceAngry, interferenceHappy), // angry-target minus happy-target interference
      excludedRtCount: Object.values(byFlanker).reduce((n, c) => n + c.excluded, 0),
      timeouts: Object.values(byFlanker).reduce((n, c) => n + c.timeouts, 0),
      totalCount: trials.length
    };
  }

  return { TARGETS: TARGETS.slice(), FLANKERS: FLANKERS.slice(), IDENTITIES: IDENTITIES.slice(), LIMITS: { ...LIMITS },
    keyFor, flankerExpression, createTrials, summarizeTrials, longestRun };
});
