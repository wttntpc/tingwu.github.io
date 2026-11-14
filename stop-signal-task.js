(function exposeStopSignalTask(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StopSignalTask = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createStopSignalTaskApi() {
  // Stop-signal task: respond to the arrow (go) unless a stop signal appears shortly after it.
  // Stop-signal delay (SSD) is adapted per emotion with a 1-up/1-down staircase so that about
  // half of the stop trials succeed; SSRT is then estimated with the integration method
  // recommended by Verbruggen et al. (2019, eLife, https://doi.org/10.7554/eLife.46323).
  const EMOTIONS = ['happy', 'sad'];
  const IDENTITIES = ['a', 'b', 'c', 'd'];
  const DEFAULT_LIMITS = { startSsd: 250, step: 50, minSsd: 50, maxSsd: 800, maxRt: 1000 };

  function shuffle(items, random) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function createTrials({ goPerEmotion = 24, stopPerEmotion = 8 } = {}, random = Math.random) {
    for (const [name, value] of [['goPerEmotion', goPerEmotion], ['stopPerEmotion', stopPerEmotion]]) {
      if (!Number.isInteger(value) || value < 0 || (name === 'goPerEmotion' && value === 0)) throw new Error(`${name} must be a whole number (go must be positive)`);
    }
    const trials = [];
    for (const emotion of EMOTIONS) {
      // Identities are cycled in a random order within each emotion and trial type, so they stay balanced.
      const goOrder = shuffle(IDENTITIES, random);
      const stopOrder = shuffle(IDENTITIES, random);
      for (let i = 0; i < goPerEmotion; i++) trials.push({ emotion, type: 'go', arrow: i % 2 ? 'left' : 'right', identity: goOrder[i % goOrder.length] });
      for (let i = 0; i < stopPerEmotion; i++) trials.push({ emotion, type: 'stop', arrow: i % 2 ? 'left' : 'right', identity: stopOrder[i % stopOrder.length] });
    }
    const mixed = shuffle(trials, random);
    // Never start with a stop trial: people need two go trials to settle into a response rhythm.
    for (let i = 0; i < 2 && i < mixed.length; i++) {
      if (mixed[i].type === 'stop') {
        const swapWith = mixed.findIndex((trial, index) => index >= 2 && trial.type === 'go');
        if (swapWith >= 0) [mixed[i], mixed[swapWith]] = [mixed[swapWith], mixed[i]];
      }
    }
    return mixed;
  }

  function createStaircase(limits = {}) {
    const config = { ...DEFAULT_LIMITS, ...limits };
    let ssd = config.startSsd;
    return {
      get ssd() { return ssd; },
      update(inhibited) {
        ssd = inhibited ? Math.min(config.maxSsd, ssd + config.step) : Math.max(config.minSsd, ssd - config.step);
        return ssd;
      }
    };
  }

  const mean = values => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null);

  function median(values) {
    if (!values.length) return null;
    const ordered = values.slice().sort((a, b) => a - b);
    const middle = Math.floor(ordered.length / 2);
    return ordered.length % 2 ? ordered[middle] : (ordered[middle - 1] + ordered[middle]) / 2;
  }

  function estimateSsrt(goTrials, stopTrials, maxRt = DEFAULT_LIMITS.maxRt) {
    if (!goTrials.length || !stopTrials.length) return { ssrt: null, nthRt: null, pRespond: null, meanSsd: null };
    const pRespond = stopTrials.filter(trial => trial.responded).length / stopTrials.length;
    const meanSsd = mean(stopTrials.map(trial => trial.ssd));
    // Go omissions count as the slowest possible response; choice errors stay in the distribution.
    const goRts = goTrials.map(trial => (trial.responded && Number.isFinite(trial.rt) ? trial.rt : maxRt)).sort((a, b) => a - b);
    if (pRespond === 0 || pRespond === 1) return { ssrt: null, nthRt: null, pRespond, meanSsd };
    const index = Math.min(goRts.length - 1, Math.max(0, Math.ceil(goRts.length * pRespond) - 1));
    const nthRt = goRts[index];
    return { ssrt: Math.round(nthRt - meanSsd), nthRt, pRespond, meanSsd };
  }

  function summarizeTrials(trials, limits = {}) {
    const { maxRt } = { ...DEFAULT_LIMITS, ...limits };
    const go = trials.filter(trial => trial.type === 'go');
    const stop = trials.filter(trial => trial.type === 'stop');
    const overall = estimateSsrt(go, stop, maxRt);
    const correctGoRts = emotion => go.filter(trial => (!emotion || trial.emotion === emotion) && trial.responded && trial.correct && Number.isFinite(trial.rt)).map(trial => trial.rt);
    const failedStopRts = stop.filter(trial => trial.responded && Number.isFinite(trial.rt)).map(trial => trial.rt);
    const byEmotion = {};
    for (const emotion of EMOTIONS) {
      const emotionGo = go.filter(trial => trial.emotion === emotion);
      const emotionStop = stop.filter(trial => trial.emotion === emotion);
      byEmotion[emotion] = {
        goCount: emotionGo.length,
        stopCount: emotionStop.length,
        goMedianRt: median(correctGoRts(emotion)),
        omissionRate: emotionGo.length ? emotionGo.filter(trial => !trial.responded).length / emotionGo.length : null,
        pRespondGivenSignal: emotionStop.length ? emotionStop.filter(trial => trial.responded).length / emotionStop.length : null,
        meanSsd: mean(emotionStop.map(trial => trial.ssd))
      };
    }
    const meanGoRt = mean(correctGoRts());
    const meanFailedStopRt = mean(failedStopRts);
    return {
      ...overall,
      goMedianRt: median(correctGoRts()),
      meanGoRt,
      meanFailedStopRt,
      raceModelHolds: meanGoRt !== null && meanFailedStopRt !== null ? meanFailedStopRt < meanGoRt : null,
      pRespondValid: overall.pRespond !== null && overall.pRespond >= 0.25 && overall.pRespond <= 0.75,
      goAccuracy: go.length ? go.filter(trial => trial.responded && trial.correct).length / go.length : null,
      byEmotion,
      goCount: go.length,
      stopCount: stop.length
    };
  }

  return { EMOTIONS: EMOTIONS.slice(), DEFAULT_LIMITS: { ...DEFAULT_LIMITS }, createTrials, createStaircase, estimateSsrt, summarizeTrials };
});
