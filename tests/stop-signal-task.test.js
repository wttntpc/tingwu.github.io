const test = require('node:test');
const assert = require('node:assert/strict');
const Task = require('../stop-signal-task.js');

function seeded(seed = 11) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
}

test('formal block has a quarter stop trials, balanced by emotion, and never opens with a stop', () => {
  for (let seed = 1; seed <= 25; seed++) {
    const trials = Task.createTrials({ goPerEmotion: 24, stopPerEmotion: 8 }, seeded(seed));
    assert.equal(trials.length, 64);
    assert.equal(trials.filter(t => t.type === 'stop').length, 16);
    for (const emotion of Task.EMOTIONS) {
      assert.equal(trials.filter(t => t.emotion === emotion && t.type === 'stop').length, 8);
      assert.equal(trials.filter(t => t.emotion === emotion && t.type === 'go').length, 24);
    }
    assert.ok(trials.slice(0, 2).every(t => t.type === 'go'), `seed ${seed}`);
    assert.ok(trials.every(t => t.arrow === 'left' || t.arrow === 'right'));
  }
});

test('staircase raises the delay after a successful stop and lowers it after a failure, within bounds', () => {
  const stair = Task.createStaircase({ startSsd: 250, step: 50, minSsd: 50, maxSsd: 350 });
  assert.equal(stair.ssd, 250);
  assert.equal(stair.update(true), 300);
  assert.equal(stair.update(true), 350);
  assert.equal(stair.update(true), 350);
  assert.equal(stair.update(false), 300);
  for (let i = 0; i < 10; i++) stair.update(false);
  assert.equal(stair.ssd, 50);
});

function goTrials(rts, omissions = 0) {
  const trials = rts.map(rt => ({ type: 'go', emotion: 'happy', responded: true, correct: true, rt }));
  for (let i = 0; i < omissions; i++) trials.push({ type: 'go', emotion: 'happy', responded: false, correct: false, rt: null });
  return trials;
}
const stopTrial = (responded, ssd, rt = null, emotion = 'happy') => ({ type: 'stop', emotion, responded, rt, ssd });

test('SSRT uses the integration method: nth go RT minus mean stop-signal delay', () => {
  const go = goTrials([300, 310, 320, 330, 340, 350, 360, 370, 380, 390]);
  const stop = [stopTrial(true, 200, 320), stopTrial(true, 200, 310), stopTrial(false, 200), stopTrial(false, 200)];
  const result = Task.estimateSsrt(go, stop);
  assert.equal(result.pRespond, 0.5);
  assert.equal(result.meanSsd, 200);
  assert.equal(result.nthRt, 340);
  assert.equal(result.ssrt, 140);
});

test('go omissions are replaced by the slowest possible response before taking the nth RT', () => {
  const go = goTrials([300, 310, 320, 330], 4);
  const stop = [stopTrial(true, 200, 300), stopTrial(true, 200, 300), stopTrial(true, 200, 300), stopTrial(false, 200)];
  const result = Task.estimateSsrt(go, stop, 1000);
  assert.equal(result.pRespond, 0.75);
  assert.equal(result.nthRt, 1000);
  assert.equal(result.ssrt, 800);
});

test('no estimate is returned when nobody failed or everybody failed to stop', () => {
  const go = goTrials([300, 320, 340, 360]);
  assert.equal(Task.estimateSsrt(go, [stopTrial(false, 200), stopTrial(false, 220)]).ssrt, null);
  assert.equal(Task.estimateSsrt(go, [stopTrial(true, 200, 300), stopTrial(true, 220, 310)]).ssrt, null);
  assert.equal(Task.estimateSsrt([], [stopTrial(true, 200, 300)]).ssrt, null);
});

test('summary flags an invalid stop rate and checks the race-model assumption', () => {
  const go = goTrials([400, 420, 440, 460, 480, 500, 520, 540]);
  const lowStop = [stopTrial(true, 300, 380), ...Array.from({ length: 7 }, () => stopTrial(false, 300))];
  const summary = Task.summarizeTrials([...go, ...lowStop]);
  assert.equal(summary.pRespondValid, false);
  assert.equal(summary.raceModelHolds, true, 'failed stops (380) are faster than go RTs (mean 470)');
  const fine = Task.summarizeTrials([...go, stopTrial(true, 250, 400), stopTrial(false, 250), stopTrial(true, 250, 420), stopTrial(false, 250)]);
  assert.equal(fine.pRespondValid, true);
});

test('summary reports per-emotion go speed, omissions and stop rate without a per-emotion SSRT', () => {
  const trials = [
    ...goTrials([400, 420, 440]).map(t => ({ ...t, emotion: 'happy' })),
    ...goTrials([500, 520, 540]).map(t => ({ ...t, emotion: 'sad' })),
    stopTrial(false, 250, null, 'happy'), stopTrial(true, 250, 380, 'sad')
  ];
  const summary = Task.summarizeTrials(trials);
  assert.equal(summary.byEmotion.happy.goMedianRt, 420);
  assert.equal(summary.byEmotion.sad.goMedianRt, 520);
  assert.equal(summary.byEmotion.happy.pRespondGivenSignal, 0);
  assert.equal(summary.byEmotion.sad.pRespondGivenSignal, 1);
  assert.equal('ssrt' in summary.byEmotion.happy, false);
});
