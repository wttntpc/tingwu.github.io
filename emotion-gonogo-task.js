(function exposeEmotionGoNoGoTask(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.EmotionGoNoGoTask = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createEmotionGoNoGoTaskApi() {
  const EMOTIONS = ['happy', 'angry', 'neutral'];
  const IDENTITIES = ['a', 'b'];

  function shuffle(items, random) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function createEmotionBlocks(random = Math.random) {
    const goIdentity = random() < 0.5 ? 'a' : 'b';
    const noGoIdentity = goIdentity === 'a' ? 'b' : 'a';
    return shuffle([
      {
        blockId: 'emotion-relevant',
        rule: 'emotion',
        goEmotions: ['happy', 'angry'],
        noGoEmotions: ['neutral']
      },
      {
        blockId: 'identity-relevant',
        rule: 'identity',
        goIdentity,
        noGoIdentity
      }
    ], random);
  }

  function distributeCount(total, categories, label) {
    if (total % categories.length !== 0) {
      throw new Error(`${label} count must divide evenly across its stimulus categories`);
    }
    return total / categories.length;
  }

  function createTrial(block, emotion, identity, action) {
    return {
      blockId: block.blockId,
      rule: block.rule,
      emotion,
      identity,
      action,
      correctKey: action === 'go' ? 'Space' : null,
      responded: false,
      correct: false,
      rt: null
    };
  }

  function createEmotionGoNoGoTrials(block, counts = { go: 12, nogo: 6 }, random = Math.random) {
    if (!block || !['emotion', 'identity'].includes(block.rule)) throw new Error('block must define an emotion or identity rule');
    for (const key of ['go', 'nogo']) {
      if (!Number.isInteger(counts[key]) || counts[key] <= 0) throw new Error(`${key} count must be a positive integer`);
    }

    const trials = [];
    if (block.rule === 'emotion') {
      const goEach = distributeCount(counts.go, block.goEmotions, 'go');
      const noGoEach = distributeCount(counts.nogo, block.noGoEmotions, 'nogo');
      block.goEmotions.forEach(emotion => {
        for (let i = 0; i < goEach; i++) trials.push(createTrial(block, emotion, IDENTITIES[i % IDENTITIES.length], 'go'));
      });
      block.noGoEmotions.forEach(emotion => {
        for (let i = 0; i < noGoEach; i++) trials.push(createTrial(block, emotion, IDENTITIES[i % IDENTITIES.length], 'nogo'));
      });
    } else {
      if (!IDENTITIES.includes(block.goIdentity) || !IDENTITIES.includes(block.noGoIdentity) || block.goIdentity === block.noGoIdentity) {
        throw new Error('identity block must define different valid go and no-go identities');
      }
      const goEach = distributeCount(counts.go, EMOTIONS, 'go');
      const noGoEach = distributeCount(counts.nogo, EMOTIONS, 'nogo');
      EMOTIONS.forEach(emotion => {
        for (let i = 0; i < goEach; i++) trials.push(createTrial(block, emotion, block.goIdentity, 'go'));
        for (let i = 0; i < noGoEach; i++) trials.push(createTrial(block, emotion, block.noGoIdentity, 'nogo'));
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

  function subtract(left, right) {
    return left === null || right === null ? null : left - right;
  }

  function summarizeEmotionGoNoGoTrials(trials, limits = { minRt: 150, maxRt: 1200 }) {
    const tasks = {};
    let excludedRtCount = 0;

    for (const rule of ['emotion', 'identity']) {
      tasks[rule] = {};
      for (const emotion of EMOTIONS) {
        const goTrials = trials.filter(trial => trial.rule === rule && trial.emotion === emotion && trial.action === 'go');
        const noGoTrials = trials.filter(trial => trial.rule === rule && trial.emotion === emotion && trial.action === 'nogo');
        const usableGo = goTrials.filter(trial => trial.correct && Number.isFinite(trial.rt) && trial.rt >= limits.minRt && trial.rt <= limits.maxRt);
        excludedRtCount += goTrials.filter(trial => trial.correct && Number.isFinite(trial.rt)).length - usableGo.length;
        tasks[rule][emotion] = {
          goMedianRt: median(usableGo.map(trial => trial.rt)),
          omissionRate: goTrials.length ? goTrials.filter(trial => !trial.correct).length / goTrials.length : null,
          commissionRate: noGoTrials.length ? noGoTrials.filter(trial => !trial.correct).length / noGoTrials.length : null,
          goCount: goTrials.length,
          noGoCount: noGoTrials.length
        };
      }
    }

    const relevantRtDifference = subtract(tasks.emotion.angry.goMedianRt, tasks.emotion.happy.goMedianRt);
    const irrelevantRtDifference = subtract(tasks.identity.angry.goMedianRt, tasks.identity.happy.goMedianRt);
    return {
      tasks,
      relevantRtDifference,
      irrelevantRtDifference,
      taskRelevanceInteraction: subtract(relevantRtDifference, irrelevantRtDifference),
      relevantOmissionDifference: subtract(tasks.emotion.angry.omissionRate, tasks.emotion.happy.omissionRate),
      irrelevantOmissionDifference: subtract(tasks.identity.angry.omissionRate, tasks.identity.happy.omissionRate),
      excludedRtCount,
      totalCount: trials.length
    };
  }

  return {
    EMOTIONS: EMOTIONS.slice(),
    IDENTITIES: IDENTITIES.slice(),
    createEmotionBlocks,
    createEmotionGoNoGoTrials,
    summarizeEmotionGoNoGoTrials
  };
});
