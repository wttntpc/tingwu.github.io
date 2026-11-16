const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ScienceDelights = require('../science-delights.js');

const root = path.resolve(__dirname, '..');

test('the neural background is deterministic, bounded, and links only nearby nodes', () => {
  const first = ScienceDelights.createNetwork(900, 360, 24);
  const second = ScienceDelights.createNetwork(900, 360, 24);

  assert.deepEqual(first, second);
  assert.equal(first.nodes.length, 24);
  assert.ok(first.nodes.every(node => node.x >= 0 && node.x <= 900 && node.y >= 0 && node.y <= 360));
  assert.ok(first.links.length > 10);
  assert.ok(first.links.every(link => link.distance <= first.linkDistance));
});

test('dragging bends the selected signal locally and releasing returns it to baseline', () => {
  const signal = ScienceDelights.createSignalSpring('eeg', 96);
  const rest = Array.from(signal.rest);

  signal.grab(0.5);
  signal.drag(0.5, -0.5);
  for (let index = 0; index < 18; index += 1) signal.step(1 / 60);

  const center = 48;
  assert.ok(Math.abs(signal.values[center] - rest[center]) > 0.08);
  assert.ok(Math.abs(signal.values[center] - rest[center]) > Math.abs(signal.values[4] - rest[4]));

  signal.release();
  for (let index = 0; index < 360; index += 1) signal.step(1 / 60);
  assert.ok(Math.abs(signal.values[center] - rest[center]) < 0.01);
});

test('EEG and HRV traces have visibly different resting shapes', () => {
  const eeg = ScienceDelights.createSignalSpring('eeg', 96);
  const hrv = ScienceDelights.createSignalSpring('hrv', 96);
  assert.notDeepEqual(Array.from(eeg.rest), Array.from(hrv.rest));
  assert.ok(Math.max(...hrv.rest) - Math.min(...hrv.rest) > 0.7, 'HRV trace contains clear peaks');
});

test('home loads the two science details before the main application', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  const delight = fs.readFileSync(path.join(root, 'science-delights.js'), 'utf8');

  assert.ok(html.indexOf('science-delights.js') >= 0);
  assert.ok(html.indexOf('science-delights.js') < html.indexOf('app.js'));
  assert.match(app, /data-neural-network/);
  assert.match(app, /data-signal-tug="eeg"/);
  assert.match(app, /data-signal-tug="hrv"/);
  assert.match(delight, /prefers-reduced-motion/);
});
