(function exposeEmotionGoNoGoTask(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.EmotionGoNoGoTask = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createEmotionGoNoGoTaskApi() {
  const EMOTIONS = ['happy', 'sad'];

  function shuffle(items, random) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function createEmotionBlocks(random = Math.random) {
    return shuffle([
      { blockId: 'happy-go', goEmotion: 'happy', noGoEmotion: 'sad' },
      { blockId: 'sad-go', goEmotion: 'sad', noGoEmotion: 'happy' }
    ], random);
  }

  function createEmotionGoNoGoTrials(block, counts = { go: 12, nogo: 4 }, random = Math.random) {
    if (!block || !EMOTIONS.includes(block.goEmotion) || !EMOTIONS.includes(block.noGoEmotion) || block.goEmotion === block.noGoEmotion) {
      throw new Error('block must define different valid go and no-go emotions');
    }
    for (const key of ['go', 'nogo']) {
      if (!Number.isInteger(counts[key]) || counts[key] <= 0) throw new Error(`${key} count must be a positive integer`);
    }

    const trials = [];
    for (let i = 0; i < counts.go; i++) {
      trials.push({
        blockId: block.blockId,
        emotion: block.goEmotion,
        action: 'go',
        correctKey: 'Space',
        responded: false,
        correct: false,
        rt: null
      });
    }
    for (let i = 0; i < counts.nogo; i++) {
      trials.push({
        blockId: block.blockId,
        emotion: block.noGoEmotion,
        action: 'nogo',
        correctKey: null,
        responded: false,
        correct: false,
        rt: null
      });
    }
    return shuffle(trials, random);
  }

  function median(values) {
    if (!values.length) return null;
    const ordered = values.slice().sort((a, b) => a - b);
    const middle = Math.floor(ordered.length / 2);
    return ordered.length % 2 ? ordered[middle] : (ordered[middle - 1] + ordered[middle]) / 2;
  }

  function summarizeEmotionGoNoGoTrials(trials, limits = { minRt: 150, maxRt: 1200 }) {
    const emotions = {};
    let excludedRtCount = 0;

    for (const emotion of EMOTIONS) {
      const goTrials = trials.filter(trial => trial.emotion === emotion && trial.action === 'go');
      const noGoTrials = trials.filter(trial => trial.emotion === emotion && trial.action === 'nogo');
      const usableGo = goTrials.filter(trial => (
        trial.correct
        && Number.isFinite(trial.rt)
        && trial.rt >= limits.minRt
        && trial.rt <= limits.maxRt
      ));
      excludedRtCount += goTrials.filter(trial => trial.correct && Number.isFinite(trial.rt)).length - usableGo.length;
      emotions[emotion] = {
        goMedianRt: median(usableGo.map(trial => trial.rt)),
        goAccuracy: goTrials.length ? goTrials.filter(trial => trial.correct).length / goTrials.length : null,
        noGoAccuracy: noGoTrials.length ? noGoTrials.filter(trial => trial.correct).length / noGoTrials.length : null,
        goCount: goTrials.length,
        noGoCount: noGoTrials.length
      };
    }

    const happyGoRt = emotions.happy.goMedianRt;
    const sadGoRt = emotions.sad.goMedianRt;
    const happyNoGo = emotions.happy.noGoAccuracy;
    const sadNoGo = emotions.sad.noGoAccuracy;
    return {
      emotions,
      goRtDifference: happyGoRt === null || sadGoRt === null ? null : sadGoRt - happyGoRt,
      noGoAccuracyDifference: happyNoGo === null || sadNoGo === null ? null : sadNoGo - happyNoGo,
      excludedRtCount,
      totalCount: trials.length
    };
  }

  return {
    EMOTIONS: EMOTIONS.slice(),
    createEmotionBlocks,
    createEmotionGoNoGoTrials,
    summarizeEmotionGoNoGoTrials
  };
});
