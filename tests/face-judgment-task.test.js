const test = require('node:test');
const assert = require('node:assert/strict');
const Task = require('../face-judgment-task.js');
const Face = require('../schematic-face.js');

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

test('schematic faces move smoothly from a frown to a smile without any image file', () => {
  const sad = Face.faceGeometry(0); const happy = Face.faceGeometry(1); const mid = Face.faceGeometry(0.5);
  const controlY = g => Number(g.mouth.match(/Q 50 ([\d.-]+)/)[1]);
  assert.ok(controlY(sad) < controlY(mid) && controlY(mid) < controlY(happy));
  assert.equal(controlY(mid), 69);
  assert.ok(sad.leftBrow.y1 > sad.leftBrow.y2, 'sad brows slope up toward the middle');
  assert.equal(happy.leftBrow.y1, happy.leftBrow.y2, 'happy brows stay level, not angry-slanted');
  assert.ok(happy.leftBrow.y1 < mid.leftBrow.y1, 'happy brows sit slightly higher');
  assert.ok(sad.rightBrow.y1 < sad.rightBrow.y2, 'right brow mirrors the left');
  const svg = Face.faceSvg(0.3, { label: 'face' });
  assert.match(svg, /<svg[^>]+role="img" aria-label="face"/);
  assert.doesNotMatch(svg, /<img|href=|http/);
});
