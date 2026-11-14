(function exposeStopSignalTask(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StopSignalTask = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createStopSignalTaskApi() {
  // Emotional selective stop-signal task (web demonstration).
  // Every trial shows a happy or sad face and the response IS the expression judgement: one hand for "happy", the
  // other for "sad". On some trials a coloured frame appears around the face after a stop-signal delay (SSD):
  // red = withhold the response (stop), green = respond as usual (continue). Go trials never show a frame.
  // The selective logic follows Nguyen et al. (2021, https://doi.org/10.3390/brainsci11040478); SSRT uses the integration
  // method recommended by Verbruggen et al. (2019, https://doi.org/10.7554/eLife.46323).
  const EMOTIONS = ['happy', 'sad'];
  const IDENTITIES = ['a', 'b', 'c', 'd'];
  const KINDS = ['go', 'stop', 'cont'];
  const CONFIG = {
    fixation: 500, blank: 200, window: 1250, iti: 1000, feedbackMs: 800,
    ssdStep: 40, ssdMin: 50, ssdMax: 550, ssdStartOffset: 200, ssdFallback: 170, warnSD: 2,
    firstGo: 2, maxRunEmotion: 3, maxRunSignal: 2, switchTol: 3
  };
  // Trials per emotion. Signal trials are split evenly into stop and continue.
  const STAGES = {
    practice_go: { go: 4, signal: 0 },
    practice_signal: { go: 3, signal: 2 },
    baseline: { go: 4, signal: 0 },
    calib: { go: 8, signal: 4, useLast: 6 },
    formal: { go: 18, signal: 9 }
  };
  const STAGE_ORDER = ['practice_go', 'practice_signal', 'baseline', 'calib', 'formal'];

  const clampSsd = value => Math.round(Math.min(CONFIG.ssdMax, Math.max(CONFIG.ssdMin, value)));
  const mean = values => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null);
  const finite = values => values.filter(value => Number.isFinite(value));

  function sd(values) {
    if (values.length < 2) return null;
    const m = mean(values);
    return Math.sqrt(values.reduce((sum, value) => sum + (value - m) ** 2, 0) / (values.length - 1));
  }

  function median(values) {
    if (!values.length) return null;
    const ordered = values.slice().sort((a, b) => a - b);
    const middle = Math.floor(ordered.length / 2);
    return ordered.length % 2 ? ordered[middle] : (ordered[middle - 1] + ordered[middle]) / 2;
  }

  function shuffle(items, random) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  // Mapping "A": happy on the left key, sad on the right. Mapping "B" swaps them (counterbalanced across sessions).
  function keyFor(emotion, mapping = 'A') {
    return (emotion === 'happy') === (mapping === 'A') ? 'left' : 'right';
  }

  function buildList(stage) {
    const spec = STAGES[stage];
    if (!spec) throw new Error(`unknown stage: ${stage}`);
    const list = [];
    for (const emotion of EMOTIONS) {
      for (let i = 0; i < spec.go; i++) list.push({ emotion, kind: 'go' });
      for (let i = 0; i < spec.signal; i++) { list.push({ emotion, kind: 'stop' }); list.push({ emotion, kind: 'cont' }); }
    }
    return list;
  }

  // Trial order rules (same as the full task): the first two trials are go; the same expression repeats at most three times;
  // stop and continue trials each repeat at most twice; expression changes number (n - 1) / 2 plus or minus three.
  function orderTrials(list, random) {
    const n = list.length;
    const e = list.map(trial => (trial.emotion === 'happy' ? 1 : 0));
    const k = list.map(trial => KINDS.indexOf(trial.kind));
    const target = (n - 1) / 2;
    for (let attempt = 0; attempt < 20000; attempt++) {
      let remaining = [...Array(n).keys()];
      const seq = [];
      let ok = true;
      for (let pos = 0; pos < n; pos++) {
        const goLeft = remaining.some(i => k[i] === 0);
        let pick = -1;
        for (const c of shuffle(remaining, random)) {
          if (pos < CONFIG.firstGo && k[c] !== 0 && goLeft) continue;
          if (pos >= CONFIG.maxRunEmotion && seq.slice(-CONFIG.maxRunEmotion).every(i => e[i] === e[c])) continue;
          if (k[c] > 0 && pos >= CONFIG.maxRunSignal && seq.slice(-CONFIG.maxRunSignal).every(i => k[i] === k[c])) continue;
          pick = c; break;
        }
        if (pick < 0) { ok = false; break; }
        seq.push(pick);
        remaining = remaining.filter(i => i !== pick);
      }
      if (!ok) continue;
      let switches = 0;
      for (let i = 1; i < n; i++) if (e[seq[i]] !== e[seq[i - 1]]) switches++;
      if (new Set(e).size < 2 || Math.abs(switches - target) <= CONFIG.switchTol) return seq.map(i => list[i]);
    }
    throw new Error('could not build a trial order that satisfies the rules');
  }

  function createBlock(stage, random = Math.random) {
    const list = buildList(stage);
    // Identities are spread evenly within each emotion and trial kind, in a random order.
    const pools = {};
    for (const trial of list) {
      const key = `${trial.emotion}-${trial.kind}`;
      if (!pools[key]) pools[key] = { order: shuffle(IDENTITIES, random), next: 0 };
      const pool = pools[key];
      trial.identity = pool.order[pool.next % pool.order.length];
      pool.next += 1;
      trial.stage = stage;
      trial.level = trial.emotion === 'happy' ? 1 : 0;
    }
    return orderTrials(list, random).map((trial, index) => ({ ...trial, index }));
  }

  // 1-up/1-down tracking of the stop-signal delay: a successful stop makes the next one later (harder), a failed stop earlier.
  function trackSsd(ssd, stopped) {
    return clampSsd(ssd + (stopped ? CONFIG.ssdStep : -CONFIG.ssdStep));
  }

  function startSsd(goRts) {
    const rts = finite(goRts);
    return rts.length ? clampSsd(mean(rts) - CONFIG.ssdStartOffset) : CONFIG.ssdFallback;
  }

  // The critical SSD is the mean delay of the last stop trials of the tracking stage (the earlier ones let the staircase settle).
  function finalizeCalibration(stopSsds, useLast = STAGES.calib.useLast) {
    if (!stopSsds.length) return { critical: CONFIG.ssdFallback, nUsed: 0, atBound: false };
    const used = stopSsds.slice(-Math.min(useLast, stopSsds.length));
    return { critical: Math.round(mean(used)), nUsed: used.length, atBound: used.some(value => value === CONFIG.ssdMax || value === CONFIG.ssdMin) };
  }

  // The "please respond faster" prompt appears when a go response is missing or slower than mean + 2 SD of earlier go responses.
  function warnThreshold(goRts) {
    const rts = finite(goRts);
    if (rts.length < 2) return null;
    return mean(rts) + CONFIG.warnSD * sd(rts);
  }

  // Score the first key press inside the response window.
  function scoreTrial(trial, key, rt, mapping = 'A', window = CONFIG.window) {
    const inWindow = key && Number.isFinite(rt) && rt <= window;
    const pressed = inWindow ? key : null;
    const time = inWindow ? rt : null;
    if (trial.kind === 'stop') return { outcome: pressed ? 'stop_fail' : 'stop_success', responded: !!pressed, rt: time, correct: !pressed };
    const correctKey = keyFor(trial.emotion, mapping);
    if (!pressed) return { outcome: 'omission', responded: false, rt: null, correct: false };
    return { outcome: pressed === correctKey ? 'correct' : 'choice_error', responded: true, rt: time, correct: pressed === correctKey };
  }

  // Integration method: all go trials (omissions count as the slowest possible response) and the mean SSD of the stop trials.
  function estimateSsrt(goTrials, stopTrials, window = CONFIG.window) {
    if (!goTrials.length || !stopTrials.length) return { ssrt: null, nthRt: null, pRespond: null, meanSsd: null };
    const pRespond = stopTrials.filter(trial => trial.responded).length / stopTrials.length;
    const meanSsd = mean(stopTrials.map(trial => trial.ssd));
    const goRts = goTrials.map(trial => (trial.responded && Number.isFinite(trial.rt) ? trial.rt : window)).sort((a, b) => a - b);
    if (pRespond === 0 || pRespond === 1) return { ssrt: null, nthRt: null, pRespond, meanSsd };
    const nth = Math.min(goRts.length, Math.max(1, Math.ceil(pRespond * goRts.length)));
    return { ssrt: Math.round(goRts[nth - 1] - meanSsd), nthRt: goRts[nth - 1], pRespond, meanSsd };
  }

  function checks(estimate, goTrials, stopTrials) {
    const flags = [];
    if (estimate.pRespond === null || estimate.pRespond === 0 || estimate.pRespond === 1) flags.push('extreme');
    else if (estimate.pRespond < 0.25 || estimate.pRespond > 0.75) flags.push('rate');
    const goMean = mean(finite(goTrials.filter(trial => trial.responded).map(trial => trial.rt)));
    const failedMean = mean(finite(stopTrials.filter(trial => trial.responded).map(trial => trial.rt)));
    if (goMean !== null && failedMean !== null && failedMean >= goMean) flags.push('race');
    return flags;
  }

  function summarizeTrials(trials) {
    const formal = trials.filter(trial => !trial.stage || trial.stage === 'formal');
    const kindOf = (kind, emotion) => formal.filter(trial => trial.kind === kind && (!emotion || trial.emotion === emotion));
    const go = kindOf('go'); const stop = kindOf('stop'); const cont = kindOf('cont');
    const correctRts = list => finite(list.filter(trial => trial.correct && trial.responded).map(trial => trial.rt));
    const pooledEstimate = estimateSsrt(go, stop);
    const pooledFlags = checks(pooledEstimate, go, stop);
    const byEmotion = {};
    for (const emotion of EMOTIONS) {
      const g = kindOf('go', emotion); const s = kindOf('stop', emotion); const c = kindOf('cont', emotion);
      const estimate = estimateSsrt(g, s);
      const flags = checks(estimate, g, s);
      byEmotion[emotion] = {
        goCount: g.length, stopCount: s.length, contCount: c.length,
        goMedianRt: median(correctRts(g)),
        goAccuracy: g.length ? g.filter(trial => trial.correct && trial.responded).length / g.length : null,
        omissionRate: g.length ? g.filter(trial => !trial.responded).length / g.length : null,
        contMeanRt: mean(correctRts(c)),
        contAccuracy: c.length ? c.filter(trial => trial.correct && trial.responded).length / c.length : null,
        pRespondGivenStop: estimate.pRespond, meanSsd: estimate.meanSsd,
        ssrt: flags.length ? null : estimate.ssrt, ssrtFlags: flags
      };
    }
    const goMeanRt = mean(correctRts(go)); const contMeanRt = mean(correctRts(cont));
    return {
      ...pooledEstimate,
      ssrt: pooledFlags.length ? null : pooledEstimate.ssrt,
      rawSsrt: pooledEstimate.ssrt,
      flags: pooledFlags,
      goCount: go.length, stopCount: stop.length, contCount: cont.length,
      goMeanRt, goMedianRt: median(correctRts(go)),
      goAccuracy: go.length ? go.filter(trial => trial.correct && trial.responded).length / go.length : null,
      contMeanRt, contAccuracy: cont.length ? cont.filter(trial => trial.correct && trial.responded).length / cont.length : null,
      frameCost: goMeanRt !== null && contMeanRt !== null ? contMeanRt - goMeanRt : null,
      failedStopMeanRt: mean(finite(stop.filter(trial => trial.responded).map(trial => trial.rt))),
      byEmotion
    };
  }

  return {
    EMOTIONS: EMOTIONS.slice(), IDENTITIES: IDENTITIES.slice(), CONFIG: { ...CONFIG }, STAGES: JSON.parse(JSON.stringify(STAGES)), STAGE_ORDER: STAGE_ORDER.slice(),
    keyFor, createBlock, trackSsd, startSsd, finalizeCalibration, warnThreshold, scoreTrial, estimateSsrt, summarizeTrials, mean, sd, median
  };
});
