const test = require('node:test');
const assert = require('node:assert/strict');
const {
  buildLabMarkup,
  buildPosnerIntroMarkup
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
