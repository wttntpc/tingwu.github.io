const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = (name) => fs.readFileSync(path.join(__dirname, '..', name), 'utf8').replace(/\r\n/g, '\n');

for (const page of ['index.html', '404.html']) {
  test(`${page}: the language button sits in the header bar, outside the collapsible menu`, () => {
    const html = read(page);
    const panel = html.match(/<div class="nav-panel"[\s\S]*?<\/div>/);
    assert.ok(panel, 'nav panel exists');
    assert.ok(!panel[0].includes('lang-toggle'), 'language button must not be inside the menu panel');
    assert.match(html, /<button id="lang-toggle" class="lang-toggle"[\s\S]*?<span class="lang-label">/);
  });
}

test('the language label names the other language in full and is updated through its own span', () => {
  const app = read('app.js');
  assert.match(app, /langToggle\.querySelector\('\.lang-label'\)/);
  assert.match(app, /lang === 'zh' \? 'English' : '中文'/);
});

test('the mobile menu is a vertical list rather than a horizontal scroller', () => {
  const css = read('style.css');
  const block = css.match(/@media \(max-width: 900px\) \{[\s\S]*?\n\}/)[0];
  assert.match(block, /\.nav-links \{[^}]*flex-direction: column/);
  assert.doesNotMatch(block, /\.nav-links \{[^}]*overflow-x: auto/);
});
