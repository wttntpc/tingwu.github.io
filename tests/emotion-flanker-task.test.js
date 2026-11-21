const test = require('node:test');
const assert = require('node:assert/strict');
const Flanker = require('../emotion-flanker-task.js');

function seeded(seed = 7) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

test('every target x flanker cell gets the same number of trials, balanced over identities', () => {
  const trials = Flanker.createTrials(8, 'A', seeded());
  assert.equal(trials.length, 48);
  for (const target of Flanker.TARGETS) {
    for (const flanker of Flanker.FLANKERS) {
      const cell = trials.filter(t => t.target === target && t.flanker === flanker);
      assert.equal(cell.length, 8);
      for (const id of Flanker.IDENTITIES) assert.equal(cell.filter(t => t.identity === id).length, 2, `${target}/${flanker}/${id}`);
    }
  }
});

test('flanker expressions follow the condition: same, opposite, or neutral', () => {
  const trials = Flanker.createTrials(2, 'A', seeded());
  for (const t of trials) {
    if (t.flanker === 'congruent') assert.equal(t.flankerExpression, t.target);
    if (t.flanker === 'incongruent') assert.notEqual(t.flankerExpression, t.target);
    if (t.flanker === 'incongruent') assert.ok(['angry', 'happy'].includes(t.flankerExpression));
    if (t.flanker === 'neutral') assert.equal(t.flankerExpression, 'neutral');
  }
});

test('the key mapping is counterbalanced and each target has exactly one correct key', () => {
  assert.equal(Flanker.keyFor('angry', 'A'), 'left');
  assert.equal(Flanker.keyFor('happy', 'A'), 'right');
  assert.equal(Flanker.keyFor('angry', 'B'), 'right');
  assert.equal(Flanker.keyFor('happy', 'B'), 'left');
  const b = Flanker.createTrials(2, 'B', seeded());
  b.forEach(t => assert.equal(t.correctKey, Flanker.keyFor(t.target, 'B')));
  assert.throws(() => Flanker.keyFor('sad', 'A'));
});

test('no condition repeats more than twice in a row', () => {
  for (let seed = 1; seed <= 20; seed++) {
    const trials = Flanker.createTrials(8, 'A', seeded(seed));
    assert.ok(Flanker.longestRun(trials) <= 2, `seed ${seed}: run ${Flanker.longestRun(trials)}`);
  }
});

test('createTrials rejects a bad trial count', () => {
  assert.throws(() => Flanker.createTrials(0));
  assert.throws(() => Flanker.createTrials(1.5));
});

function fake(flanker, target, rt, correct = true, extra = {}) {
  return { target, flanker, rt, correct, timedOut: rt === null, ...extra };
}

test('summary computes interference, facilitation and conflict cost from correct, in-range RTs only', () => {
  const trials = [
    fake('congruent', 'angry', 500), fake('congruent', 'angry', 520), fake('congruent', 'happy', 480),
    fake('neutral', 'angry', 540), fake('neutral', 'happy', 500), fake('neutral', 'happy', 520),
    fake('incongruent', 'angry', 620), fake('incongruent', 'angry', 640), fake('incongruent', 'happy', 560),
    fake('incongruent', 'happy', 400, false), // error: not in the RT medians
    fake('congruent', 'happy', 90),          // anticipation: excluded
    fake('neutral', 'angry', null)           // timeout
  ];
  const s = Flanker.summarizeTrials(trials);
  assert.equal(s.byFlanker.congruent.medianRt, 500);     // 500, 520, 480 -> 500
  assert.equal(s.byFlanker.neutral.medianRt, 520);       // 540, 500, 520 -> 520
  assert.equal(s.byFlanker.incongruent.medianRt, 620);   // 620, 640, 560 -> 620
  assert.equal(s.interference, 120);
  assert.equal(s.facilitation, 20);
  assert.equal(s.conflictCost, 100);
  assert.equal(s.byFlanker.incongruent.accuracy, 3 / 4);
  assert.equal(s.byFlanker.congruent.accuracy, 1);
  assert.equal(s.accuracyDrop, 0.25);
  assert.equal(s.excludedRtCount, 1);
  assert.equal(s.timeouts, 1);
  assert.equal(s.totalCount, trials.length);
});

test('target-specific interference and their difference are computed separately', () => {
  const trials = [
    fake('congruent', 'angry', 500), fake('incongruent', 'angry', 580),
    fake('congruent', 'happy', 500), fake('incongruent', 'happy', 640)
  ];
  const s = Flanker.summarizeTrials(trials);
  assert.equal(s.interferenceAngry, 80);
  assert.equal(s.interferenceHappy, 140);
  assert.equal(s.targetDifference, -60);
});

test('empty cells give null rather than NaN', () => {
  const s = Flanker.summarizeTrials([fake('congruent', 'angry', 500)]);
  assert.equal(s.interference, null);
  assert.equal(s.byFlanker.incongruent.medianRt, null);
  assert.equal(s.byFlanker.incongruent.accuracy, null);
  assert.equal(s.targetDifference, null);
});

test('the flanker experiment is wired into the site: scripts, route, hub card and research-page entry', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const root = path.resolve(__dirname, '..');
  const read = f => fs.readFileSync(path.join(root, f), 'utf8');
  const html = read('index.html'), app = read('app.js'), hub = read('interactive-lab.js'), css = read('style.css');
  assert.ok(html.indexOf('emotion-flanker-task.js') > 0 && html.indexOf('emotion-flanker-ui.js') > html.indexOf('emotion-flanker-task.js'));
  assert.ok(html.indexOf('emotion-flanker-ui.js') < html.indexOf('app.js'));
  assert.match(app, /path === '\/lab\/emotion-flanker'/);
  assert.match(app, /EmotionFlankerUI\?\.cleanup\(\)/);
  assert.match(hub, /href="#\/lab\/emotion-flanker"/);
  assert.ok((app.match(/\['emotion-flanker'/g) || []).length === 2, 'listed on the Research page in both languages');
  assert.match(css, /\.flanker-array/);
});

test('flanker UI: both languages exist, the paper summary matches the abstract-level claims, and DOIs are well formed', () => {
  const UI = require('../emotion-flanker-ui.js');
  assert.deepEqual(Object.keys(UI.copy.zh).sort(), Object.keys(UI.copy.en).sort(), 'same copy keys in zh and en');
  const results = UI.buildResultsMarkup('en', Flanker.summarizeTrials([]), 'unsure');
  assert.match(results, /10\.1037\/1528-3542\.3\.4\.327/);
  assert.match(results, /10\.3758\/BF03203267/);
  assert.match(results, /pubmed\.ncbi\.nlm\.nih\.gov\/14674827/);
  assert.doesNotMatch(results, /NaN|undefined/);
  const zhNoCjkInEn = UI.copy.en.title + UI.copy.en.lead + UI.copy.en.limits.join(' ');
  assert.doesNotMatch(zhNoCjkInEn, /[㐀-鿿]/);
});

test('flanker UI: the trial array has five faces, one marked target in the middle', () => {
  const UI = require('../emotion-flanker-ui.js');
  const trial = Flanker.createTrials(1, 'A', seeded())[0];
  const markup = UI.arrayMarkup(trial);
  assert.equal((markup.match(/<img /g) || []).length, 5);
  assert.equal((markup.match(/is-target/g) || []).length, 1);
  const order = [...markup.matchAll(/flanker-face( is-target)?"/g)].map(m => Boolean(m[1]));
  assert.deepEqual(order, [false, false, true, false, false]);
});
