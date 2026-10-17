const test = require('node:test');
const assert = require('node:assert/strict');
const {
  createEmotionBlocks,
  createEmotionGoNoGoTrials,
  summarizeEmotionGoNoGoTrials
} = require('../emotion-gonogo-task.js');

test('blocks compare task-relevant emotion rules with task-irrelevant identity rules', () => {
  const blocks = createEmotionBlocks(() => 0.75);

  assert.equal(blocks.length, 2);
  assert.deepEqual(new Set(blocks.map(block => block.rule)), new Set(['emotion', 'identity']));
  const emotionBlock = blocks.find(block => block.rule === 'emotion');
  const identityBlock = blocks.find(block => block.rule === 'identity');
  assert.deepEqual(emotionBlock.goEmotions, ['happy', 'angry']);
  assert.deepEqual(emotionBlock.noGoEmotions, ['neutral']);
  assert.ok(['a', 'b'].includes(identityBlock.goIdentity));
  assert.notEqual(identityBlock.goIdentity, identityBlock.noGoIdentity);
});

test('each block keeps the original two-to-one Go/No-Go ratio with one response key', () => {
  const blocks = createEmotionBlocks(() => 0.75);

  for (const block of blocks) {
    const trials = createEmotionGoNoGoTrials(block, { go: 12, nogo: 6 }, () => 0.25);
    assert.equal(trials.length, 18);
    assert.equal(trials.filter(trial => trial.action === 'go').length, 12);
    assert.equal(trials.filter(trial => trial.action === 'nogo').length, 6);
    assert.deepEqual([...new Set(trials.filter(trial => trial.action === 'go').map(trial => trial.correctKey))], ['Space']);
    assert.ok(trials.filter(trial => trial.action === 'nogo').every(trial => trial.correctKey === null));
  }
});

test('emotion relevance determines the response rule, not the displayed expression alone', () => {
  const blocks = createEmotionBlocks(() => 0.75);
  const emotionTrials = createEmotionGoNoGoTrials(blocks.find(block => block.rule === 'emotion'), { go: 12, nogo: 6 }, () => 0.25);
  const identityTrials = createEmotionGoNoGoTrials(blocks.find(block => block.rule === 'identity'), { go: 12, nogo: 6 }, () => 0.25);

  assert.ok(emotionTrials.filter(trial => ['happy', 'angry'].includes(trial.emotion)).every(trial => trial.action === 'go'));
  assert.ok(emotionTrials.filter(trial => trial.emotion === 'neutral').every(trial => trial.action === 'nogo'));
  assert.ok(identityTrials.some(trial => trial.emotion === 'angry' && trial.action === 'go'));
  assert.ok(identityTrials.some(trial => trial.emotion === 'angry' && trial.action === 'nogo'));
});

test('summary compares angry and happy Go responses separately in both tasks', () => {
  const summary = summarizeEmotionGoNoGoTrials([
    { rule: 'emotion', emotion: 'happy', action: 'go', correct: true, rt: 300 },
    { rule: 'emotion', emotion: 'happy', action: 'go', correct: true, rt: 340 },
    { rule: 'emotion', emotion: 'angry', action: 'go', correct: true, rt: 410 },
    { rule: 'emotion', emotion: 'angry', action: 'go', correct: false, rt: null },
    { rule: 'identity', emotion: 'happy', action: 'go', correct: true, rt: 320 },
    { rule: 'identity', emotion: 'angry', action: 'go', correct: true, rt: 330 },
    { rule: 'identity', emotion: 'neutral', action: 'go', correct: true, rt: 325 },
    { rule: 'emotion', emotion: 'neutral', action: 'nogo', correct: true, rt: null },
    { rule: 'identity', emotion: 'happy', action: 'nogo', correct: false, rt: 250 }
  ]);

  assert.equal(summary.tasks.emotion.happy.goMedianRt, 320);
  assert.equal(summary.tasks.emotion.angry.goMedianRt, 410);
  assert.equal(summary.tasks.emotion.angry.omissionRate, 0.5);
  assert.equal(summary.tasks.identity.happy.goMedianRt, 320);
  assert.equal(summary.tasks.identity.angry.goMedianRt, 330);
  assert.equal(summary.relevantRtDifference, 90);
  assert.equal(summary.irrelevantRtDifference, 10);
  assert.equal(summary.taskRelevanceInteraction, 80);
});

test('implausible Go responses are excluded from RT but retained in omission estimates', () => {
  const summary = summarizeEmotionGoNoGoTrials([
    { rule: 'emotion', emotion: 'happy', action: 'go', correct: true, rt: 90 },
    { rule: 'emotion', emotion: 'happy', action: 'go', correct: true, rt: 310 }
  ]);

  assert.equal(summary.tasks.emotion.happy.goMedianRt, 310);
  assert.equal(summary.tasks.emotion.happy.omissionRate, 0);
  assert.equal(summary.excludedRtCount, 1);
});
