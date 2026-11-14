const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const Core = require('../hhsa-intuition.js');
const UI = require('../hhsa-intuition-ui.js');
const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const lab = fs.readFileSync(path.join(root, 'interactive-lab.js'), 'utf8');
const CJK = /[\u3400-\u9fff]/;

const middleError = result => {
  const { n, trueEnvelope } = result.signal; const lo = Math.floor(n * 0.1); const hi = Math.floor(n * 0.9);
  let total = 0; for (let i = lo; i < hi; i++) total += Math.abs(result.envelope[i] - trueEnvelope[i]);
  return total / (hi - lo);
};

test('the FFT is exact: a round trip returns the signal and a sinusoid lands in the right bin', () => {
  const n = 256; const x = Float64Array.from({ length: n }, (_, i) => Math.sin(2 * Math.PI * 5 * i / n) + 0.3 * Math.cos(2 * Math.PI * 17 * i / n));
  const re = Float64Array.from(x); const im = new Float64Array(n);
  Core.fft(re, im);
  const magnitude = k => Math.hypot(re[k], im[k]);
  assert.ok(magnitude(5) > 100 && magnitude(17) > 30 && magnitude(40) < 1e-9);
  Core.fft(re, im, true);
  for (let i = 0; i < n; i++) assert.ok(Math.abs(re[i] - x[i]) < 1e-9);
  assert.throws(() => Core.fft(new Float64Array(100), new Float64Array(100)));
});

test('an amplitude-modulated signal shows a carrier of amplitude 1 and two sidebands of depth / 2', () => {
  const r = Core.analyze({ fc: 10, fAM: 0.5, depth: 0.7, noise: 0, T: 8 });
  assert.ok(Math.abs(r.estimates.carrierHz - 10) < 0.01);
  assert.ok(Math.abs(r.estimates.carrierAmp - 1) < 0.02);
  assert.ok(Math.abs(r.estimates.lowerSideband.amp - 0.35) < 0.02);
  assert.ok(Math.abs(r.estimates.upperSideband.amp - 0.35) < 0.02);
});

test('the Hilbert envelope follows the true envelope and the modulation frequency is recovered', () => {
  const r = Core.analyze({ fc: 10, fAM: 0.5, depth: 0.7, noise: 0, T: 8 });
  assert.ok(middleError(r) < 0.02, `envelope error ${middleError(r)}`);
  assert.ok(Math.abs(r.estimates.amError) < 0.01);
  assert.equal(r.reliable, true);
  const fast = Core.analyze({ fc: 12, fAM: 3, depth: 0.5, noise: 0, T: 8 });
  assert.ok(Math.abs(fast.estimates.amError) < 0.02);
});

test('with no modulation the demo reports none instead of inventing a rhythm', () => {
  for (const seed of [1, 2, 3, 4, 5]) {
    for (const noise of [0, 0.5, 1]) {
      const r = Core.analyze({ depth: 0, noise }, seed);
      assert.equal(r.flags.modulationDetected, false, `seed ${seed}, noise ${noise}`);
      assert.ok(Number.isNaN(r.estimates.amHz));
    }
  }
  assert.equal(Core.analyze({ depth: 0 }).flags.flat, true);
});

test('a record with fewer than three modulation cycles is flagged as not resolvable', () => {
  assert.equal(Core.floorHz(8), 3 / 8);
  const short = Core.analyze({ fAM: 0.5, T: 4 });
  assert.equal(short.cycles, 2);
  assert.equal(short.flags.resolvable, false);
  assert.equal(short.reliable, false);
  const longer = Core.analyze({ fAM: 0.5, T: 8 });
  assert.equal(longer.flags.resolvable, true);
  const tiny = Core.analyze({ fAM: 0.25, T: 4 });
  assert.ok(tiny.estimates.lowerSideband.amp < 0.25, 'a single modulation cycle badly distorts the sideband amplitude');
});

test('a modulation at least as fast as its carrier is flagged as not admissible', () => {
  const r = Core.analyze({ fc: 6, fAM: 9 });
  assert.equal(r.flags.admissible, false);
  assert.equal(r.reliable, false);
  assert.ok(middleError(r) > 0.1, 'the envelope breaks down');
  assert.equal(Core.analyze({ fc: 10, fAM: 9.75 }).flags.admissible, true);
});

test('parameters are clamped to their ranges and unknown durations fall back to the default', () => {
  const p = Core.normalizeParams({ fc: 999, fAM: -3, depth: 5, noise: -1, T: 7 });
  assert.deepEqual(p, { fc: Core.LIMITS.fc.max, fAM: Core.LIMITS.fAM.min, depth: 1, noise: 0, T: Core.DEFAULTS.T });
});

test('the page offers every control, every preset, the three charts, and the can / cannot-claim panels in both languages', () => {
  for (const lang of ['zh', 'en']) {
    const markup = UI.buildHhsaMarkup(lang);
    for (const id of ['hhsa-fc', 'hhsa-fAM', 'hhsa-depth', 'hhsa-noise', 'hhsa-T', 'hhsa-time', 'hhsa-spectrum', 'hhsa-plane', 'hhsa-readout', 'hhsa-alerts']) assert.ok(markup.includes(`id="${id}"`), `${lang}: ${id}`);
    assert.equal((markup.match(/<svg /g) || []).length, 3);
    for (const [id] of UI.copy[lang].presets) assert.ok(markup.includes(`data-hhsa-preset="${id}"`));
    assert.match(markup, /hhsa-claims/);
    assert.match(markup, /href="#\/post\/hhsa-nonlinear-eeg"/);
    assert.match(markup, /https:\/\/doi\.org\/10\.1098\/rsta\.2015\.0206/);
  }
  assert.deepEqual(UI.copy.zh.presets.map(p => p[0]), UI.copy.en.presets.map(p => p[0]));
  assert.deepEqual(Object.keys(UI.PRESETS).sort(), UI.copy.zh.presets.map(p => p[0]).sort());
});

test('the warnings follow the settings, and an unremarkable setting says only that it is a clean demonstration', () => {
  const warn = (lang, params) => UI.chartsMarkup(lang, Core.analyze(params)).alerts;
  assert.match(warn('en', { fc: 6, fAM: 9 }), /faster than its carrier/);
  assert.match(warn('en', { T: 4, fAM: 0.5 }), /fewer than 3/);
  assert.match(warn('en', { depth: 0 }), /no modulation/);
  assert.match(warn('en', {}), /clean synthetic demonstration/);
  assert.match(warn('zh', { fc: 6, fAM: 9 }), /不能比載波頻率快/);
});

test('the English page contains no Chinese text', () => {
  assert.doesNotMatch(UI.buildHhsaMarkup('en'), CJK);
  assert.doesNotMatch(JSON.stringify(UI.copy.en), CJK);
  assert.doesNotMatch(UI.chartsMarkup('en', Core.analyze({ fc: 6, fAM: 9 })).alerts, CJK);
});

test('the demo is honest about what it is: not HHSA, no human data, nothing uploaded', () => {
  for (const lang of ['zh', 'en']) {
    const markup = UI.buildHhsaMarkup(lang);
    assert.match(markup, lang === 'zh' ? /不是 HHSA 計算/ : /not an HHSA computation/);
    assert.match(markup, lang === 'zh' ? /沒有任何真人資料/ : /no human data/);
    assert.match(markup, lang === 'zh' ? /沒有上傳任何資料/ : /no data are uploaded/);
  }
  const code = fs.readFileSync(path.join(root, 'hhsa-intuition.js'), 'utf8').replace(/^\s*\/\/.*$/gm, '');
  assert.doesNotMatch(code, /fetch\(|XMLHttpRequest|localStorage/);
});

test('the demo is routed, loaded in the right order, listed on the lab hub and on the Research page', () => {
  assert.match(app, /path === '\/lab\/hhsa'\) window\.HhsaIntuitionUI\.renderHhsaIntuition\(app, lang\)/);
  assert.match(app, /window\.HhsaIntuitionUI\?\.cleanup\(\)/);
  const order = ['hhsa-intuition.js', 'hhsa-intuition-ui.js', 'interactive-lab.js', 'app.js'].map(file => html.indexOf(`src="${file}`));
  assert.ok(order.every(i => i >= 0));
  assert.deepEqual([...order].sort((a, b) => a - b), order);
  assert.match(lab, /href=\\?"#\/lab\/hhsa/);
  assert.match(app, /\['hhsa', '訊號：振幅調變與包絡'/);
});

test('the cache-busting version is the same everywhere and was bumped for this release', () => {
  const inApp = app.match(/const SITE_VERSION = '([^']+)'/)[1];
  assert.equal(inApp, '20261114-01');
  for (const file of ['index.html', '404.html']) {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    const versions = [...new Set([...text.matchAll(/\?v=([0-9-]+)/g)].map(m => m[1]))];
    assert.deepEqual(versions, [inApp], file);
  }
});
