const test = require('node:test');
const assert = require('node:assert/strict');
const Ecg = require('../ecg-progress.js');

test('the waveform has an R peak much taller than the P and T waves, and a small S dip', () => {
  const r = Ecg.beatValue(0.40);
  assert.ok(r > 0.9 && r < 1.1);
  assert.ok(Ecg.beatValue(0.18) < 0.2, 'P wave is small');
  assert.ok(Ecg.beatValue(0.68) < 0.4 && Ecg.beatValue(0.68) > 0.2, 'T wave is a modest bump');
  assert.ok(Ecg.beatValue(0.445) < 0, 'S wave dips below the baseline');
  assert.ok(Math.abs(Ecg.beatValue(0.95)) < 0.01 && Math.abs(Ecg.beatValue(0.0)) < 0.01, 'flat between beats');
});

test('points span the full width, are deterministic and stay inside the strip', () => {
  const a = Ecg.points(800), b = Ecg.points(800);
  assert.deepEqual(a, b);
  assert.equal(a[0][0], 0);
  assert.ok(a[a.length - 1][0] >= 799);
  const ys = a.map((p) => p[1]);
  assert.ok(Math.min(...ys) >= 0, 'R peaks do not leave the top: ' + Math.min(...ys));
  assert.ok(Math.max(...ys) <= 18, 'S dips do not leave the bottom: ' + Math.max(...ys));
  const peaks = a.filter((p, i) => i > 0 && i < a.length - 1 && p[1] < a[i - 1][1] && p[1] <= a[i + 1][1] && p[1] < 5);
  assert.ok(peaks.length >= 6, 'several beats across 800 px: ' + peaks.length);
});

test('the beat interval varies a little from beat to beat', () => {
  const starts = Ecg.beatStarts(1000, 90, 0.07);
  const gaps = starts.slice(1).map((x, i) => x - starts[i]);
  assert.ok(Math.max(...gaps) - Math.min(...gaps) > 5, 'intervals differ');
  assert.ok(Math.max(...gaps) < 90 * 1.1 && Math.min(...gaps) > 90 * 0.9, 'but only slightly');
});

test('progress is clamped to 0..1 and null when the page does not scroll', () => {
  assert.equal(Ecg.progress(0, 3000, 800), 0);
  assert.equal(Ecg.progress(2200, 3000, 800), 1);
  assert.equal(Ecg.progress(5000, 3000, 800), 1);
  assert.equal(Ecg.progress(-50, 3000, 800), 0);
  assert.ok(Math.abs(Ecg.progress(1100, 3000, 800) - 0.5) < 1e-9);
  assert.equal(Ecg.progress(0, 850, 800), null, 'nothing to scroll');
});

test('yAt returns the trace height at a position', () => {
  const pts = Ecg.points(400);
  const y = Ecg.yAt(pts, 200);
  assert.ok(Number.isFinite(y));
  assert.equal(Ecg.yAt(pts, -5), pts[0][1]);
});

test('the bar is only shown on long-form pages', () => {
  const on = (p) => Ecg.ROUTES.some((r) => r.test(p));
  assert.ok(on('/post/some-article'));
  assert.ok(on('/about'));
  assert.ok(on('/about/profile'));
  assert.ok(!on('/'));
  assert.ok(!on('/lab/posner'));
  assert.ok(!on('/blog'));
});
