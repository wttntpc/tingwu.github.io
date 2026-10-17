const test = require('node:test');
const assert = require('node:assert/strict');
const {
  buildLabMarkup,
  buildPosnerIntroMarkup,
  buildPosnerTaskShellMarkup
} = require('../interactive-lab.js');

test('lab landing page introduces the interactive learning flow in Chinese', () => {
  const markup = buildLabMarkup('zh');

  assert.match(markup, /腦與身體互動實驗室/);
  assert.match(markup, /先預測/);
  assert.match(markup, /#\/lab\/posner/);
});

test('lab landing page has an English version', () => {
  const markup = buildLabMarkup('en');

  assert.match(markup, /Brain × Body Interactive Lab/);
  assert.match(markup, /Posner spatial cueing task/);
});

test('Posner introduction explains local-only data handling and exposes a start control', () => {
  const markup = buildPosnerIntroMarkup('zh');

  assert.match(markup, /不會上傳/);
  assert.match(markup, /data-posner-start/);
  assert.match(markup, /有效提示/);
  assert.match(markup, /無效提示/);
});

test('Posner introduction teaches the task before asking for a prediction', () => {
  const markup = buildPosnerIntroMarkup('zh');
  const guideIndex = markup.indexOf('實驗怎麼進行');
  const scenariosIndex = markup.indexOf('先看三種情境');
  const predictionIndex = markup.indexOf('看完情境後，再做預測');

  assert.ok(guideIndex >= 0);
  assert.ok(scenariosIndex > guideIndex);
  assert.ok(predictionIndex > scenariosIndex);
  assert.match(markup, /眼睛盯著中央凝視點/);
  assert.match(markup, /電腦.*空白鍵/);
  assert.match(markup, /手機.*手指/);
  assert.match(markup, /箭頭向左.*圓點出現在左側/s);
  assert.match(markup, /箭頭向左.*圓點出現在右側/s);
});

test('English Posner introduction includes fixation and device-specific controls', () => {
  const markup = buildPosnerIntroMarkup('en');

  assert.match(markup, /Keep your eyes on the central fixation point/);
  assert.match(markup, /computer.*Space key/i);
  assert.match(markup, /phone.*tap/i);
});

test('Posner task uses one shared response button instead of left and right choices', () => {
  const markup = buildPosnerTaskShellMarkup('zh', 'practice', 6);
  const responseButtons = markup.match(/data-posner-response=/g) || [];

  assert.equal(responseButtons.length, 1);
  assert.match(markup, /data-posner-response="Space"/);
  assert.match(markup, /空白鍵/);
  assert.match(markup, /看到圓點/);
});
