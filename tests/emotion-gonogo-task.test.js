const test = require('node:test');
const assert = require('node:assert/strict');
const {
  createEmotionBlocks,
  createEmotionGoNoGoTrials,
  summarizeEmotionGoNoGoTrials
} = require('../emotion-gonogo-task.js');

test('two blocks reverse which emotion requires a response', () => {
  const blocks = createEmotionBlocks(() => 0.75);

  assert.equal(blocks.length, 2);
  assert.deepEqual(new Set(blocks.map(block => block.goEmotion)), new Set(['happy', 'sad']));
  for (const block of blocks) assert.notEqual(block.goEmotion, block.noGoEmotion);
});

test('each block creates a prepotent Go response and one shared response key', () => {
  const trials = createEmotionGoNoGoTrials(
    { blockId: 'happy-go', goEmotion: 'happy', noGoEmotion: 'sad' },
    { go: 12, nogo: 4 },
    () => 0.25
  );

  assert.equal(trials.length, 16);
  assert.equal(trials.filter(trial => trial.action === 'go').length, 12);
  assert.equal(trials.filter(trial => trial.action === 'nogo').length, 4);
  assert.deepEqual([...new Set(trials.filter(trial => trial.action === 'go').map(trial => trial.correctKey))], ['Space']);
  assert.ok(trials.filter(trial => trial.action === 'nogo').every(trial => trial.correctKey === null));
});

test('summary separates Go speed from No-Go inhibitory accuracy by emotion', () => {
  const summary = summarizeEmotionGoNoGoTrials([
    { emotion: 'happy', action: 'go', responded: true, correct: true, rt: 300 },
    { emotion: 'happy', action: 'go', responded: true, correct: true, rt: 340 },
    { emotion: 'happy', action: 'go', responded: false, correct: false, rt: null },
    { emotion: 'sad', action: 'go', responded: true, correct: true, rt: 380 },
    { emotion: 'sad', action: 'go', responded: true, correct: true, rt: 420 },
    { emotion: 'happy', action: 'nogo', responded: false, correct: true, rt: null },
    { emotion: 'happy', action: 'nogo', responded: true, correct: false, rt: 260 },
    { emotion: 'sad', action: 'nogo', responded: false, correct: true, rt: null },
    { emotion: 'sad', action: 'nogo', responded: false, correct: true, rt: null }
  ]);

  assert.equal(summary.emotions.happy.goMedianRt, 320);
  assert.equal(summary.emotions.sad.goMedianRt, 400);
  assert.equal(summary.emotions.happy.goAccuracy, 2 / 3);
  assert.equal(summary.emotions.happy.noGoAccuracy, 0.5);
  assert.equal(summary.emotions.sad.noGoAccuracy, 1);
  assert.equal(summary.goRtDifference, 80);
  assert.equal(summary.noGoAccuracyDifference, 0.5);
});

test('implausible Go responses are excluded from RT but retained in accuracy', () => {
  const summary = summarizeEmotionGoNoGoTrials([
    { emotion: 'happy', action: 'go', responded: true, correct: true, rt: 90 },
    { emotion: 'happy', action: 'go', responded: true, correct: true, rt: 310 }
  ]);

  assert.equal(summary.emotions.happy.goMedianRt, 310);
  assert.equal(summary.emotions.happy.goAccuracy, 1);
  assert.equal(summary.excludedRtCount, 1);
});
