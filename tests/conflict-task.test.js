const test = require('node:test');
const assert = require('node:assert/strict');
const { directions, getTargetDirection, getSwipeDirection, createTrials } = require('../conflict-task.js');

test('blue congruent trials keep the arrow direction', () => {
  for (const direction of directions) {
    assert.equal(getTargetDirection(direction, false), direction);
  }
});

test('red incongruent trials require the opposite direction', () => {
  assert.equal(getTargetDirection('up', true), 'down');
  assert.equal(getTargetDirection('right', true), 'left');
  assert.equal(getTargetDirection('down', true), 'up');
  assert.equal(getTargetDirection('left', true), 'right');
});

test('a ten-trial game contains five congruent and five incongruent trials', () => {
  const trials = createTrials(10, () => 0.25);
  assert.equal(trials.filter(trial => !trial.isReversed).length, 5);
  assert.equal(trials.filter(trial => trial.isReversed).length, 5);
  assert.equal(trials.length, 10);
});

test('trial generation rejects counts that cannot be split 50/50', () => {
  assert.throws(() => createTrials(9), /positive even integer/);
});

test('swipe vectors map to all four response directions', () => {
  assert.equal(getSwipeDirection(80, 10), 'right');
  assert.equal(getSwipeDirection(-80, 10), 'left');
  assert.equal(getSwipeDirection(10, 80), 'down');
  assert.equal(getSwipeDirection(10, -80), 'up');
});

test('short pointer movement is ignored instead of becoming a response', () => {
  assert.equal(getSwipeDirection(8, 8), null);
});
