const test = require('node:test');
const assert = require('node:assert/strict');
const {
  createPosnerTrials,
  summarizePosnerTrials
} = require('../posner-task.js');

test('trial generation balances target sides within each cue condition', () => {
  const trials = createPosnerTrials({ valid: 4, invalid: 2, neutral: 2 }, () => 0.25);

  assert.equal(trials.length, 8);
  for (const condition of ['valid', 'invalid', 'neutral']) {
    const conditionTrials = trials.filter(trial => trial.condition === condition);
    assert.equal(
      conditionTrials.filter(trial => trial.targetSide === 'left').length,
      conditionTrials.filter(trial => trial.targetSide === 'right').length
    );
  }
});

test('valid and invalid cues point to the expected locations', () => {
  const trials = createPosnerTrials({ valid: 2, invalid: 2, neutral: 2 }, () => 0.25);

  for (const trial of trials) {
    if (trial.condition === 'valid') assert.equal(trial.cueSide, trial.targetSide);
    if (trial.condition === 'invalid') assert.notEqual(trial.cueSide, trial.targetSide);
    if (trial.condition === 'neutral') assert.equal(trial.cueSide, 'neutral');
  }
});

test('trial generation rejects odd condition counts that cannot balance sides', () => {
  assert.throws(
    () => createPosnerTrials({ valid: 3, invalid: 2, neutral: 2 }),
    /positive even integer/
  );
});

test('summary uses correct plausible trials and reports the cueing cost', () => {
  const trials = [
    { condition: 'valid', correct: true, rt: 310 },
    { condition: 'valid', correct: true, rt: 330 },
    { condition: 'valid', correct: false, rt: 280 },
    { condition: 'invalid', correct: true, rt: 390 },
    { condition: 'invalid', correct: true, rt: 410 },
    { condition: 'invalid', correct: true, rt: 90 },
    { condition: 'neutral', correct: true, rt: 350 },
    { condition: 'neutral', correct: true, rt: 370 }
  ];

  const summary = summarizePosnerTrials(trials);

  assert.equal(summary.conditions.valid.medianRt, 320);
  assert.equal(summary.conditions.invalid.medianRt, 400);
  assert.equal(summary.conditions.neutral.medianRt, 360);
  assert.equal(summary.cueingCost, 80);
  assert.equal(summary.excludedCount, 2);
  assert.equal(summary.conditions.valid.accuracy, 2 / 3);
});

test('summary returns null comparisons when a condition has no usable response', () => {
  const summary = summarizePosnerTrials([
    { condition: 'valid', correct: false, rt: null },
    { condition: 'invalid', correct: true, rt: 420 }
  ]);

  assert.equal(summary.conditions.valid.medianRt, null);
  assert.equal(summary.cueingCost, null);
});
