const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('site loads experiment logic and lab UI before the main application', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const posnerIndex = html.indexOf('posner-task.js');
  const emotionIndex = html.indexOf('emotion-gonogo-task.js');
  const uiIndex = html.indexOf('interactive-lab.js');
  const appIndex = html.indexOf('app.js');

  assert.ok(posnerIndex >= 0);
  assert.ok(emotionIndex > posnerIndex);
  assert.ok(uiIndex > emotionIndex);
  assert.ok(appIndex > uiIndex);
});

test('main router exposes the lab landing page, Posner, and emotion Go/No-Go experiments', () => {
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

  assert.match(app, /\['互動實驗', '\/lab'\]/);
  assert.match(app, /path === '\/lab'/);
  assert.match(app, /path === '\/lab\/posner'/);
  assert.match(app, /path === '\/lab\/emotion-gonogo'/);
  assert.match(app, /InteractiveLab\?\.cleanup/);
});

test('primary navigation omits the interests and projects entry', () => {
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  const chineseNav = app.match(/nav: \[\['首頁'[\s\S]*?\]\],/)?.[0] || '';
  const englishNav = app.match(/nav: \[\['Home'[\s\S]*?\]\],/)?.[0] || '';

  assert.doesNotMatch(chineseNav, /興趣與作品|\/interests/);
  assert.doesNotMatch(englishNav, /Interests & projects|\/interests/);
  assert.doesNotMatch(app, /renderHomeInterestPreview/);
});

test('interactive experiment styles include responsive and reduced-motion rules', () => {
  const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');

  assert.match(css, /\.experiment-page/);
  assert.match(css, /\.posner-stage/);
  assert.match(css, /\.emotion-stage/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*\.lab-method/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});
