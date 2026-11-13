const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const UI = require('../lab-games-ui.js');
const FaceTask = require('../face-judgment-task.js');
const StopTask = require('../stop-signal-task.js');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const lab = fs.readFileSync(path.join(root, 'interactive-lab.js'), 'utf8');

const CJK = /[\u3400-\u9fff]/;

function faceSummary() {
  const trials = [];
  for (const level of FaceTask.LEVELS) {
    const happy = Math.round(4 / (1 + Math.exp(-12 * (level - 0.55))));
    for (let i = 0; i < 4; i++) trials.push({ level, response: i < happy ? 'happy' : 'sad', rt: 500 });
  }
  return FaceTask.summarizeTrials(trials);
}

function stopSummary() {
  const go = [380, 400, 420, 440, 460, 480, 500, 520].flatMap(rt => ['happy', 'sad'].map(emotion => ({ type: 'go', emotion, responded: true, correct: true, rt })));
  const stop = [true, false, true, false].flatMap(responded => ['happy', 'sad'].map(emotion => ({ type: 'stop', emotion, responded, rt: responded ? 390 : null, ssd: 280 })));
  return StopTask.summarizeTrials([...go, ...stop]);
}

test('both games are routed, cleaned up on navigation, and loaded by the page', () => {
  assert.match(app, /path === '\/lab\/face-judgment'\) window\.LabGamesUI\.renderFaceJudgment\(app, lang\)/);
  assert.match(app, /path === '\/lab\/stop-signal'\) window\.LabGamesUI\.renderStopSignal\(app, lang\)/);
  assert.match(app, /window\.LabGamesUI\?\.cleanup\(\)/);
  for (const file of ['schematic-face.js', 'face-judgment-task.js', 'stop-signal-task.js', 'lab-games-ui.js']) {
    assert.match(html, new RegExp(`<script src="${file.replace('.', '\\.')}\\?v=[^"]+" defer></script>`), `${file} not loaded`);
  }
  const order = ['schematic-face.js', 'face-judgment-task.js', 'stop-signal-task.js', 'lab-games-ui.js'].map(file => html.indexOf(file));
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'dependencies load before the UI');
});

test('the lab landing page offers four experiments including both new ones', () => {
  assert.match(lab, /href=\\?"#\/lab\/face-judgment/);
  assert.match(lab, /href=\\?"#\/lab\/stop-signal/);
});

test('intro pages explain the task, state that data stay local, and disclose that faces are drawn', () => {
  for (const lang of ['zh', 'en']) {
    for (const [markup, name] of [[UI.buildFaceIntroMarkup(lang), 'face'], [UI.buildStopIntroMarkup(lang), 'stop']]) {
      assert.match(markup, new RegExp(`data-${name}-start`));
      assert.match(markup, lang === 'zh' ? /不會上傳、儲存/ : /not uploaded, stored/);
      assert.match(markup, lang === 'zh' ? /不是照片/ : /not photographs/);
      assert.match(markup, lang === 'zh' ? /不是研究作業/ : /not a research task/);
      assert.equal((markup.match(/name="[a-z]+-prediction"/g) || []).length, 3, 'three prediction choices');
    }
  }
});

test('English pages contain no Chinese characters', () => {
  const pages = [UI.buildFaceIntroMarkup('en'), UI.buildStopIntroMarkup('en'), UI.buildFaceResultsMarkup('en', faceSummary(), 'mid'), UI.buildStopResultsMarkup('en', stopSummary(), 'same')];
  for (const page of pages) assert.doesNotMatch(page, CJK);
  assert.doesNotMatch(JSON.stringify(UI.copy.en), CJK);
});

test('face results show a labelled curve with real axes, the balance point and a cautious reading', () => {
  const markup = UI.buildFaceResultsMarkup('zh', faceSummary(), 'late');
  assert.match(markup, /<svg class="curve-chart"/);
  assert.match(markup, /回答「開心」的比例/);
  assert.match(markup, /臉部表情（0% = 最難過，100% = 最開心）/);
  for (const tick of ['0%', '25%', '50%', '75%', '100%']) assert.ok(markup.includes(`>${tick}</text>`), `tick ${tick}`);
  assert.match(markup, /curve-fit/);
  assert.match(markup, /curve-pse/);
  assert.match(markup, /不是固定特質/);
  assert.match(markup, /https:\/\/doi\.org\/10\.1177\/0963721417704405/);
});

test('face results without a crossing say so instead of inventing a balance point', () => {
  const allHappy = FaceTask.summarizeTrials(FaceTask.LEVELS.flatMap(level => [1, 2, 3, 4].map(() => ({ level, response: 'happy', rt: 400 }))));
  const markup = UI.buildFaceResultsMarkup('zh', allHappy, 'unsure');
  assert.match(markup, /無法估計分界點/);
  assert.doesNotMatch(markup, /curve-pse/);
});

test('stop results explain that SSRT is an estimate, warn when its assumptions fail, and avoid per-emotion SSRT', () => {
  const summary = stopSummary();
  const markup = UI.buildStopResultsMarkup('zh', summary, 'happy');
  assert.match(markup, /模型估計值/);
  assert.match(markup, /整合法/);
  assert.match(markup, /https:\/\/doi\.org\/10\.7554\/eLife\.46323/);
  assert.match(markup, /每種表情只有 8 題停止題/);
  const rows = markup.match(/<tbody>[\s\S]*<\/tbody>/)[0];
  assert.equal((rows.match(/<tr>/g) || []).length, 2);
  assert.doesNotMatch(rows, /SSRT/);
  const bad = StopTask.summarizeTrials([
    ...[400, 420, 440, 460].map(rt => ({ type: 'go', emotion: 'happy', responded: true, correct: true, rt })),
    { type: 'stop', emotion: 'happy', responded: false, rt: null, ssd: 300 }, { type: 'stop', emotion: 'sad', responded: false, rt: null, ssd: 300 }
  ]);
  const badMarkup = UI.buildStopResultsMarkup('zh', bad, 'unsure');
  assert.match(badMarkup, /無法估計/);
  assert.match(badMarkup, /result-warning/);
});

test('trial screens expose labelled response buttons and a keyboard hint', () => {
  assert.match(lab + fs.readFileSync(path.join(root, 'lab-games-ui.js'), 'utf8'), /data-face-response="sad"/);
  const src = fs.readFileSync(path.join(root, 'lab-games-ui.js'), 'utf8');
  assert.match(src, /data-stop-response="left"/);
  assert.match(src, /event\.code === 'ArrowLeft'/);
  assert.match(src, /aria-live="polite"/);
});

test('games never send data anywhere', () => {
  const src = fs.readFileSync(path.join(root, 'lab-games-ui.js'), 'utf8') + fs.readFileSync(path.join(root, 'stop-signal-task.js'), 'utf8') + fs.readFileSync(path.join(root, 'face-judgment-task.js'), 'utf8');
  assert.doesNotMatch(src, /fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|WebSocket/);
});
