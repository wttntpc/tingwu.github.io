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
  const trials = [];
  for (const emotion of ['happy', 'sad']) {
    for (let i = 0; i < 18; i++) trials.push({ stage: 'formal', kind: 'go', emotion, responded: true, correct: true, rt: 420 + i * 12 });
    for (let i = 0; i < 9; i++) trials.push({ stage: 'formal', kind: 'cont', emotion, responded: true, correct: true, rt: 470 + i * 8 });
    for (let i = 0; i < 9; i++) trials.push({ stage: 'formal', kind: 'stop', emotion, responded: i % 2 === 1, correct: i % 2 === 0, rt: i % 2 === 1 ? 400 : null, ssd: 280 });
  }
  return StopTask.summarizeTrials(trials);
}

test('both games are routed, cleaned up on navigation, and loaded by the page', () => {
  assert.match(app, /path === '\/lab\/face-judgment'\) window\.LabGamesUI\.renderFaceJudgment\(app, lang\)/);
  assert.match(app, /path === '\/lab\/stop-signal'\) window\.LabGamesUI\.renderStopSignal\(app, lang\)/);
  assert.match(app, /window\.LabGamesUI\?\.cleanup\(\)/);
  for (const file of ['face-images.js', 'face-judgment-task.js', 'stop-signal-task.js', 'lab-games-ui.js']) {
    assert.match(html, new RegExp(`<script src="${file.replace('.', '\\.')}\\?v=[^"]+" defer></script>`), `${file} not loaded`);
  }
  const order = ['face-images.js', 'face-judgment-task.js', 'stop-signal-task.js', 'lab-games-ui.js'].map(file => html.indexOf(file));
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'dependencies load before the UI');
});

test('the lab landing page offers four experiments including both new ones', () => {
  assert.match(lab, /href=\\?"#\/lab\/face-judgment/);
  assert.match(lab, /href=\\?"#\/lab\/stop-signal/);
});

test('intro pages explain the task, state that data stay local, and disclose that faces are AI-generated', () => {
  for (const lang of ['zh', 'en']) {
    for (const [markup, name] of [[UI.buildFaceIntroMarkup(lang), 'face'], [UI.buildStopIntroMarkup(lang), 'stop']]) {
      assert.match(markup, new RegExp(`data-${name}-start`));
      assert.match(markup, lang === 'zh' ? /不會上傳、儲存/ : /not uploaded, stored/);
      assert.match(markup, lang === 'zh' ? /AI 生成的虛構人物/ : /AI-generated images of fictional people/);
      assert.match(markup, lang === 'zh' ? /未經驗證/ : /not been validated/);
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

test('stop results explain that SSRT is an estimate, report the frame cost, and keep per-emotion SSRT exploratory', () => {
  const summary = stopSummary();
  const markup = UI.buildStopResultsMarkup('zh', summary, 'happy');
  assert.match(markup, /模型估計值/);
  assert.match(markup, /整合法/);
  assert.match(markup, /https:\/\/doi\.org\/10\.7554\/eLife\.46323/);
  assert.match(markup, /https:\/\/doi\.org\/10\.3390\/brainsci11040478/);
  assert.match(markup, /每種表情只有 9 題停止題/);
  assert.match(markup, /綠框題比一般題慢/);
  assert.match(markup, /判斷表情本身就是你的反應/);
  assert.match(markup, /顏色的效果無法和停止指令分開/);
  assert.match(markup, /探索性 SSRT/);
  const rows = markup.match(/<tbody>[\s\S]*<\/tbody>/)[0];
  assert.equal((rows.match(/<tr>/g) || []).length, 2);
  const bad = StopTask.summarizeTrials([
    ...[400, 420, 440, 460].map(rt => ({ stage: 'formal', kind: 'go', emotion: 'happy', responded: true, correct: true, rt })),
    { stage: 'formal', kind: 'stop', emotion: 'happy', responded: false, rt: null, ssd: 300 }, { stage: 'formal', kind: 'stop', emotion: 'sad', responded: false, rt: null, ssd: 300 }
  ]);
  const badMarkup = UI.buildStopResultsMarkup('zh', bad, 'unsure');
  assert.match(badMarkup, /無法可靠估計/);
  assert.match(badMarkup, /result-warning/);
});

test('the stop-signal task is the emotional selective version: expression keys, red and green frames, no arrows', () => {
  for (const lang of ['zh', 'en']) {
    for (const mapping of ['A', 'B']) {
      const markup = UI.buildStopIntroMarkup(lang, mapping);
      assert.match(markup, /class="key-map"/);
      assert.match(markup, /has-ring/, 'a red frame is demonstrated');
      assert.match(markup, /has-frame-cont/, 'a green frame is demonstrated');
      assert.doesNotMatch(markup, /stop-arrow/);
    }
  }
  const a = UI.buildStopIntroMarkup('en', 'A').match(/<kbd>←<\/kbd> (\w+)/)[1];
  const b = UI.buildStopIntroMarkup('en', 'B').match(/<kbd>←<\/kbd> (\w+)/)[1];
  assert.deepEqual([a, b], ['Happy', 'Sad']);
  const src = fs.readFileSync(path.join(root, 'lab-games-ui.js'), 'utf8');
  assert.doesNotMatch(src, /stop-arrow|ArrowPointing|箭頭/);
  for (const stage of StopTask.STAGE_ORDER) {
    for (const lang of ['zh', 'en']) assert.match(UI.copy[lang].stop.stages[stage].title, /\S/, `${lang} ${stage}`);
  }
});

test('stage panels show the key assignment and, after a timed part, the previous part summary', () => {
  const previous = [
    { kind: 'go', emotion: 'happy', outcome: 'correct', responded: true, correct: true, rt: 500 },
    { kind: 'go', emotion: 'sad', outcome: 'correct', responded: true, correct: true, rt: 600 },
    { kind: 'go', emotion: 'sad', outcome: 'omission', responded: false, correct: false, rt: null },
    { kind: 'go', emotion: 'happy', outcome: 'choice_error', responded: true, correct: false, rt: 450 }
  ];
  const panel = UI.stagePanelMarkup('en', 'calib', 'B', previous);
  assert.match(panel, /Part 2/);
  assert.match(panel, /<kbd>←<\/kbd> Sad/);
  assert.match(panel, /Mean reaction time 550 ms/);
  assert.match(panel, /Missed 1/);
  assert.match(panel, /Wrong key 1/);
  assert.match(panel, /data-stop-next/);
  assert.doesNotMatch(UI.stagePanelMarkup('en', 'practice_go', 'A', []), /Previous part/);
  assert.match(UI.stagePanelMarkup('zh', 'formal', 'A', []), /共 72 題，其中 18 題出現紅框/);
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
