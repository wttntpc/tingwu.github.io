const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const posts = JSON.parse(fs.readFileSync(path.join(root, 'posts.json'), 'utf8'));
const body = fs.readFileSync(path.join(root, 'posts', 'hrv-device-gold-standard-comparison.md'), 'utf8');
const map = fs.readFileSync(path.join(root, 'posts', 'hrv-learning-map.md'), 'utf8');
const postIds = new Set(posts.map(post => post.id));

test('the device-comparison article is registered and linked from the HRV learning map in both versions', () => {
  const post = posts.find(item => item.id === 'hrv-device-gold-standard-comparison');
  assert.ok(post && post.titleEn && post.descriptionEn);
  assert.match(app, /"id": "hrv-device-gold-standard-comparison"/);
  assert.equal((map.match(/#\/post\/hrv-device-gold-standard-comparison/g) || []).length, 2);
});

test('every internal post link resolves and both reading levels are present', () => {
  assert.match(body, /<!-- SIMPLE -->/);
  assert.match(body, /<!-- PROFESSIONAL -->/);
  for (const match of body.matchAll(/\]\(#\/post\/([^)]+)\)/g)) assert.ok(postIds.has(match[1]), `missing post: ${match[1]}`);
});

test('references: every in-text author-year citation has an entry, and DOIs are present', () => {
  const refs = body.slice(body.indexOf('## 參考文獻'));
  for (const key of ['Bent', 'Bland', 'Carter', 'Giles', 'Kligfield', 'Koo', 'Lin', 'Quigley', 'Schäfer', 'Task Force']) {
    assert.ok(refs.includes(key), `reference missing: ${key}`);
  }
  const items = refs.split('\n').filter(line => line.startsWith('- '));
  const withoutDoi = items.filter(item => !/https:\/\/doi\.org\/10\./.test(item));
  assert.equal(withoutDoi.length, 1, 'only the 1996 Task Force report lacks a DOI');
  assert.match(withoutDoi[0], /Task Force/);
});

test('bold markers can be opened and closed by a Markdown renderer', () => {
  for (const match of body.matchAll(/(.?)\*\*([^*\r\n]+)\*\*(.?)/g)) {
    const [, before, span, after] = match;
    const closesWithPunctuation = /[？！。」）；：，、]$/.test(span);
    const followedByCjk = /[㐀-鿿]/.test(after);
    assert.ok(!(closesWithPunctuation && followedByCjk), `bold span will not close: **${span}**${after}`);
    const opensWithPunctuation = /^[「『（(“"]/.test(span);
    const precededByLetter = /[㐀-鿿A-Za-z0-9]/.test(before);
    assert.ok(!(opensWithPunctuation && precededByLetter), `bold span will not open: ${before}**${span}`);
  }
});

test('the article states its limits and avoids product-level claims', () => {
  assert.match(body, /不是特定設備的驗證結論/);
  assert.doesNotMatch(body, /證明了|已經驗證|保證準確/);
});
