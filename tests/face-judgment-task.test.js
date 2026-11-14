const test = require('node:test');
const assert = require('node:assert/strict');
const Task = require('../face-judgment-task.js');
const Face = require('../face-images.js');
const fs = require('node:fs');
const path = require('node:path');

function seeded(seed = 7) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
}

function simulate(pse, slope, repeats = 20) {
  const trials = [];
  for (const level of Task.LEVELS) {
    const p = 1 / (1 + Math.exp(-slope * (level - pse)));
    const happy = Math.round(repeats * p);
    for (let i = 0; i < repeats; i++) trials.push({ level, response: i < happy ? 'happy' : 'sad', rt: 600 + i });
  }
  return trials;
}

test('formal trials cover every morph level equally and in random order', () => {
  const trials = Task.createTrials({ repeats: 4 }, seeded());
  assert.equal(trials.length, 36);
  for (const level of Task.LEVELS) assert.equal(trials.filter(t => t.level === level).length, 4);
  assert.notDeepEqual(trials.slice(0, 9).map(t => t.level), Task.LEVELS);
});

test('practice uses only clear faces', () => {
  const practice = Task.createPracticeTrials(seeded());
  assert.ok(practice.every(t => t.level <= 0.125 || t.level >= 0.875));
});

test('the fitted curve recovers a known balance point and a positive slope', () => {
  const summary = Task.summarizeTrials(simulate(0.6, 12));
  assert.equal(summary.method, 'logistic');
  assert.ok(Math.abs(summary.pse - 0.6) < 0.03, `pse ${summary.pse}`);
  assert.ok(summary.slope > 8);
});

test('a responder who needs more happiness than average has a higher balance point', () => {
  const low = Task.summarizeTrials(simulate(0.4, 12)).pse;
  const high = Task.summarizeTrials(simulate(0.7, 12)).pse;
  assert.ok(high > low + 0.2);
});

test('a perfect step falls back to interpolation instead of an infinite slope', () => {
  const trials = [];
  for (const level of Task.LEVELS) for (let i = 0; i < 4; i++) trials.push({ level, response: level < 0.5 ? 'sad' : 'happy', rt: 500 });
  const summary = Task.summarizeTrials(trials);
  assert.equal(summary.method, 'interpolation');
  assert.equal(summary.slope, null);
  assert.ok(summary.pse > 0.37 && summary.pse < 0.5 + 1e-9);
});

test('too little or one-sided data yields no balance point rather than a made-up one', () => {
  const allHappy = Task.LEVELS.flatMap(level => [1, 2, 3, 4].map(() => ({ level, response: 'happy', rt: 400 })));
  const summary = Task.summarizeTrials(allHappy);
  assert.equal(summary.pse, null);
  assert.equal(Task.summarizeTrials([]).pse, null);
});

test('timeouts are counted and excluded, and clear-face accuracy is reported', () => {
  const trials = simulate(0.5, 12, 4);
  trials.push({ level: 0.5, response: null, rt: null });
  const summary = Task.summarizeTrials(trials);
  assert.equal(summary.timeoutCount, 1);
  assert.equal(summary.answeredCount, 36);
  assert.ok(summary.clearAccuracy > 0.9);
});

test('every trial gets an identity and each identity is seen equally often at every level', () => {
  const trials = Task.createTrials({ repeats: 4 }, seeded(3));
  for (const level of Task.LEVELS) {
    const ids = trials.filter(t => t.level === level).map(t => t.identity).sort();
    assert.deepEqual(ids, ['a', 'b', 'c', 'd'], `level ${level}`);
  }
  assert.ok(Task.createPracticeTrials(seeded()).every(t => Face.IDENTITIES.includes(t.identity)));
});

test('face images: nine levels per identity map from sad to happy and every file exists', () => {
  assert.equal(Face.levelIndex(0), 0);
  assert.equal(Face.levelIndex(0.5), 4);
  assert.equal(Face.levelIndex(1), 8);
  assert.equal(Face.levelIndex(0.375), 3);
  assert.equal(Face.sources().length, 36);
  const root = path.resolve(__dirname, '..');
  for (const file of Face.sources()) assert.ok(fs.existsSync(path.join(root, file)), `${file} missing`);
  assert.throws(() => Face.src('z', 0.5), /unknown identity/);
});

test('face markup uses an image, keeps decorative faces out of the accessibility tree, and can draw the stop ring', () => {
  const labelled = Face.faceHtml(0.3, { identity: 'b', label: 'face' });
  assert.match(labelled, /<img src="assets\/emotion-faces\/continuum\/identity-b-level-2\.webp" alt="face"/);
  assert.match(Face.faceHtml(1, { identity: 'a' }), /alt="" aria-hidden="true"/);
  assert.match(Face.faceHtml(1, { identity: 'a', ring: true }), /face-photo has-ring/);
});
