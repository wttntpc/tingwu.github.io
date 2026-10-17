const test = require('node:test');
const assert = require('node:assert/strict');
const {
  buildLabMarkup,
  buildPosnerIntroMarkup,
  buildPosnerTaskShellMarkup,
  buildPosnerResultsMarkup
} = require('../interactive-lab.js');
const {
  buildEmotionGoNoGoIntroMarkup,
  buildEmotionGoNoGoTaskShellMarkup
} = require('../emotion-gonogo-ui.js');

test('lab landing page introduces the interactive learning flow in Chinese', () => {
  const markup = buildLabMarkup('zh');

  assert.match(markup, /腦與身體互動實驗室/);
  assert.match(markup, /先預測/);
  assert.match(markup, /#\/lab\/posner/);
  assert.match(markup, /#\/lab\/emotion-gonogo/);
});

test('emotion Go/No-Go introduction teaches both reversed mappings before prediction', () => {
  const markup = buildEmotionGoNoGoIntroMarkup('zh');
  const guideIndex = markup.indexOf('實驗怎麼進行');
  const mappingsIndex = markup.indexOf('兩個規則區塊');
  const predictionIndex = markup.indexOf('理解規則後，再做預測');

  assert.ok(guideIndex >= 0);
  assert.ok(mappingsIndex > guideIndex);
  assert.ok(predictionIndex > mappingsIndex);
  assert.match(markup, /快樂臉.*GO.*悲傷臉.*NO-GO/s);
  assert.match(markup, /悲傷臉.*GO.*快樂臉.*NO-GO/s);
  assert.match(markup, /空白鍵/);
  assert.match(markup, /手機.*按鈕/);
  assert.match(markup, /不會上傳/);
  assert.match(markup, /data-emotion-start/);
});

test('emotion Go/No-Go task exposes one response button and explains that No-Go means no action', () => {
  const markup = buildEmotionGoNoGoTaskShellMarkup('zh', {
    phase: 'practice',
    trialCount: 6,
    goEmotion: 'happy',
    noGoEmotion: 'sad'
  });
  const responseButtons = markup.match(/data-emotion-response=/g) || [];

  assert.equal(responseButtons.length, 1);
  assert.match(markup, /data-emotion-response="Space"/);
  assert.match(markup, /悲傷臉.*不要按/);
  assert.doesNotMatch(markup, /臉臉/);
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

test('Posner results focus on reaction time and explain covert versus overt attention', () => {
  const markup = buildPosnerResultsMarkup('zh', {
    conditions: {
      valid: { medianRt: 280, accuracy: 1 },
      neutral: { medianRt: 300, accuracy: 1 },
      invalid: { medianRt: 340, accuracy: 1 }
    },
    cueingCost: 60,
    excludedCount: 1,
    totalCount: 32
  }, 'valid');

  assert.doesNotMatch(markup, /正確率/);
  assert.match(markup, /小小科普/);
  assert.match(markup, /隱性注意力/);
  assert.match(markup, /外顯注意力/);
  assert.match(markup, /眼睛.*不等於.*注意力/s);
  assert.match(markup, /有效提示 RT.*中性提示 RT.*無效提示 RT/s);
  assert.match(markup, /pubmed\.ncbi\.nlm\.nih\.gov\/21549742/);
});
