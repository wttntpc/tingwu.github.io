const test = require('node:test');
const assert = require('node:assert/strict');
const Task = require('../stop-signal-task.js');

function seeded(seed = 11) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
}

test('the response is the expression judgement: each emotion has its own key and the mapping can be swapped', () => {
  assert.equal(Task.keyFor('happy', 'A'), 'left');
  assert.equal(Task.keyFor('sad', 'A'), 'right');
  assert.equal(Task.keyFor('happy', 'B'), 'right');
  assert.equal(Task.keyFor('sad', 'B'), 'left');
});

test('stage sizes follow the demonstration design and signals are split evenly into stop and continue', () => {
  const sizes = Object.fromEntries(Task.STAGE_ORDER.map(stage => [stage, Task.createBlock(stage, seeded()).length]));
  assert.deepEqual(sizes, { practice_go: 4, practice_signal: 8, baseline: 6, calib: 16, formal: 40 });
  const formal = Task.createBlock('formal', seeded(5));
  for (const emotion of Task.EMOTIONS) {
    const count = kind => formal.filter(t => t.emotion === emotion && t.kind === kind).length;
    assert.deepEqual([count('go'), count('stop'), count('cont')], [10, 5, 5]);
  }
  assert.equal(formal.filter(t => t.kind === 'go').length / formal.length, 0.5);
});

test('trial order rules hold: two go trials first, runs are limited, and expression changes stay near half', () => {
  for (let seed = 1; seed <= 25; seed++) {
    const trials = Task.createBlock('formal', seeded(seed));
    assert.equal(trials[0].kind, 'go');
    assert.equal(trials[1].kind, 'go');
    for (let i = 3; i < trials.length; i++) {
      assert.ok(!trials.slice(i - 3, i + 1).every(t => t.emotion === trials[i].emotion), `emotion run at ${i} (seed ${seed})`);
    }
    for (let i = 2; i < trials.length; i++) {
      if (trials[i].kind !== 'go') assert.ok(!(trials[i - 1].kind === trials[i].kind && trials[i - 2].kind === trials[i].kind), `signal run at ${i} (seed ${seed})`);
    }
    let switches = 0;
    for (let i = 1; i < trials.length; i++) if (trials[i].emotion !== trials[i - 1].emotion) switches++;
    assert.ok(Math.abs(switches - (trials.length - 1) / 2) <= 3);
  }
});

test('face identities are spread evenly within each emotion and trial kind', () => {
  const trials = Task.createBlock('formal', seeded(37));
  for (const emotion of Task.EMOTIONS) {
    for (const [kind, per] of [['go', 10], ['stop', 5]]) {
      const ids = trials.filter(t => t.emotion === emotion && t.kind === kind).map(t => t.identity);
      assert.equal(ids.length, per);
      const counts = Task.IDENTITIES.map(id => ids.filter(x => x === id).length);
      assert.ok(Math.max(...counts) - Math.min(...counts) <= 1, `${emotion} ${kind}: ${counts}`);
    }
  }
  assert.ok(trials.every(t => t.level === (t.emotion === 'happy' ? 1 : 0)));
});

test('the delay is tracked 40 ms up after a stop and 40 ms down after a failure, within 50 to 550 ms', () => {
  assert.equal(Task.trackSsd(300, true), 340);
  assert.equal(Task.trackSsd(300, false), 260);
  assert.equal(Task.trackSsd(540, true), 550);
  assert.equal(Task.trackSsd(60, false), 50);
});

test('the staircase starts 200 ms before the mean go RT, and the critical delay averages the last stop trials', () => {
  assert.equal(Task.startSsd([600, 640, 560]), 400);
  assert.equal(Task.startSsd([]), 170);
  assert.equal(Task.startSsd([120, 130]), 50);
  const result = Task.finalizeCalibration([100, 140, 180, 300, 320, 340, 360, 340, 320], 6);
  assert.equal(result.nUsed, 6);
  assert.equal(result.critical, Math.round((300 + 320 + 340 + 360 + 340 + 320) / 6));
  assert.equal(result.atBound, false);
  assert.equal(Task.finalizeCalibration([550, 550, 550], 6).atBound, true);
});

test('scoring: a stop trial succeeds only without a response, and go/continue trials need the key of the expression', () => {
  const stop = { kind: 'stop', emotion: 'happy' };
  assert.equal(Task.scoreTrial(stop, null, null).outcome, 'stop_success');
  assert.equal(Task.scoreTrial(stop, 'left', 420).outcome, 'stop_fail');
  assert.equal(Task.scoreTrial(stop, 'left', 1300).outcome, 'stop_success', 'a press after the window does not count');
  const go = { kind: 'go', emotion: 'sad' };
  assert.equal(Task.scoreTrial(go, 'right', 500).outcome, 'correct');
  assert.equal(Task.scoreTrial(go, 'left', 500).outcome, 'choice_error');
  assert.equal(Task.scoreTrial(go, 'left', 500, 'B').outcome, 'correct');
  assert.equal(Task.scoreTrial(go, null, null).outcome, 'omission');
  assert.equal(Task.scoreTrial({ kind: 'cont', emotion: 'happy' }, 'left', 480).correct, true);
});

test('the warning threshold is the mean plus two standard deviations of earlier go RTs', () => {
  assert.equal(Math.round(Task.warnThreshold([500, 600, 700])), 800);
  assert.equal(Task.warnThreshold([500]), null);
});

function goTrial(emotion, rt) { return { stage: 'formal', kind: 'go', emotion, responded: rt !== null, rt, correct: rt !== null }; }
function stopTrial(emotion, rt, ssd) { return { stage: 'formal', kind: 'stop', emotion, responded: rt !== null, rt, ssd, correct: rt === null }; }
function contTrial(emotion, rt) { return { stage: 'formal', kind: 'cont', emotion, responded: rt !== null, rt, correct: rt !== null }; }

test('SSRT uses the integration method: nth go RT minus the mean stop-signal delay', () => {
  const go = [400, 450, 500, 550, 600, 650, 700, 750, 800, 850].map(rt => goTrial('happy', rt));
  const stop = [stopTrial('happy', 420, 300), stopTrial('happy', null, 300), stopTrial('happy', 520, 300), stopTrial('happy', null, 300)];
  const estimate = Task.estimateSsrt(go, stop);
  assert.equal(estimate.pRespond, 0.5);
  assert.equal(estimate.nthRt, 600);
  assert.equal(estimate.ssrt, 300);
});

test('go omissions count as the slowest possible response and no estimate is returned when nobody or everybody stops', () => {
  const go = [goTrial('happy', 400), goTrial('happy', null), goTrial('happy', 500), goTrial('happy', null)];
  const stop = [stopTrial('happy', 380, 250), stopTrial('happy', null, 250), stopTrial('happy', 395, 250), stopTrial('happy', 390, 250)];
  assert.equal(Task.estimateSsrt(go, stop).nthRt, 1250, 'with 75% failed stops the third-slowest go value is an omission');
  assert.equal(Task.estimateSsrt(go, [stopTrial('happy', null, 250)]).ssrt, null);
  assert.equal(Task.estimateSsrt(go, [stopTrial('happy', 300, 250)]).ssrt, null);
});

test('the summary reports pooled SSRT, per-emotion detail and the continue-versus-go slowing', () => {
  const trials = [];
  for (const emotion of Task.EMOTIONS) {
    for (let i = 0; i < 18; i++) trials.push(goTrial(emotion, 450 + i * 10));
    for (let i = 0; i < 9; i++) trials.push(contTrial(emotion, 520 + i * 5));
    for (let i = 0; i < 9; i++) trials.push(stopTrial(emotion, i % 2 ? 420 : null, 300));
  }
  trials.push({ stage: 'calib', kind: 'stop', emotion: 'happy', responded: true, rt: 100, ssd: 100, correct: false });
  const summary = Task.summarizeTrials(trials);
  assert.equal(summary.goCount, 36);
  assert.equal(summary.stopCount, 18, 'tracking-stage trials are not counted');
  assert.ok(Math.abs(summary.pRespond - 8 / 18) < 1e-9);
  assert.ok(summary.ssrt !== null && summary.ssrt > 100 && summary.ssrt < 400);
  assert.deepEqual(summary.flags, []);
  assert.ok(summary.frameCost > 0, 'continue trials are slower than go trials');
  assert.equal(summary.byEmotion.happy.stopCount, 9);
  assert.equal(summary.byEmotion.sad.meanSsd, 300);
});

test('SSRT is withheld when the proportion of responses on stop trials is outside .25 to .75, or failed stops are not faster than go', () => {
  const lowRate = [];
  for (const emotion of Task.EMOTIONS) {
    for (let i = 0; i < 18; i++) lowRate.push(goTrial(emotion, 500 + i * 10));
    for (let i = 0; i < 9; i++) lowRate.push(stopTrial(emotion, i === 0 ? 450 : null, 300));
  }
  const a = Task.summarizeTrials(lowRate);
  assert.equal(a.ssrt, null);
  assert.ok(a.flags.includes('rate'));
  const slowFails = [];
  for (const emotion of Task.EMOTIONS) {
    for (let i = 0; i < 18; i++) slowFails.push(goTrial(emotion, 400 + i * 5));
    for (let i = 0; i < 9; i++) slowFails.push(stopTrial(emotion, i % 2 ? 700 : null, 300));
  }
  const b = Task.summarizeTrials(slowFails);
  assert.equal(b.ssrt, null);
  assert.ok(b.flags.includes('race'));
});
