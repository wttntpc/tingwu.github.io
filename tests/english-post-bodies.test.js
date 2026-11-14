const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const posts = JSON.parse(fs.readFileSync(path.join(root, 'posts.json'), 'utf8'));
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const withEnglish = posts.filter(post => post.bodyEn);
const read = file => fs.readFileSync(path.join(root, 'posts', file), 'utf8');
const links = text => [...new Set([...text.matchAll(/\]\((#\/[^)\s]+)\)/g)].map(match => match[1]))].sort();
const dois = text => [...new Set(text.match(/https:\/\/doi\.org\/[^\s)<]+/g) || [])].sort();

// Proper names that are allowed to stay in Chinese inside an English article (authors, titles, publishers).
const ALLOWED_CJK = new Set(['林兩傳', '吳易澄', '運動傷害影片圖鑑', '身體的立體結構網絡', '一個結構治療科醫師的筆記', '陳毓君', '吳亭葶', '董思妤', '姚韋如', '陳豐慈', '急性有氧健身運動對情緒之影響', '神經科學觀點之文獻回顧', '體育學報', '晨星', '看懂受傷', '了解回場']);

test('every article flagged bodyEn has an English file, and no English file is left unflagged', () => {
  assert.ok(withEnglish.length >= 9);
  for (const post of withEnglish) assert.ok(fs.existsSync(path.join(root, 'posts', `${post.id}.en.md`)), `missing ${post.id}.en.md`);
  const flagged = new Set(withEnglish.map(post => post.id));
  for (const file of fs.readdirSync(path.join(root, 'posts')).filter(name => name.endsWith('.en.md') && name !== 'publications.en.md')) {
    assert.ok(flagged.has(file.replace(/\.en\.md$/, '')), `${file} exists but its post is not flagged bodyEn`);
  }
  assert.equal((app.match(/"bodyEn": true/g) || []).length, withEnglish.length, 'embedded fallback list carries the same flags');
});

test('the post loader reads the English body only for flagged posts and drops the Chinese-only notice for them', () => {
  assert.match(app, /const hasEnglishBody = lang === 'en' && Boolean\(meta && meta\.bodyEn\);/);
  assert.match(app, /posts\/\$\{id\}\$\{hasEnglishBody \? '\.en' : ''\}\.md/);
  assert.match(app, /lang === 'en' && !hasEnglishBody \? '<p class="article-language-note">/);
});

for (const post of withEnglish) {
  test(`${post.id}: the English text mirrors the Chinese one (levels, links, DOIs) and is written in English`, () => {
    const zh = read(`${post.id}.md`);
    const en = read(`${post.id}.en.md`);
    assert.match(en, /<!-- SIMPLE -->/);
    assert.match(en, /<!-- PROFESSIONAL -->/);
    assert.deepEqual(links(en), links(zh), 'same internal and external links');
    assert.deepEqual(dois(en), dois(zh), 'same DOIs');
    const leftover = [...en.matchAll(/[㐀-鿿]+/g)].map(match => match[0]).filter(run => !ALLOWED_CJK.has(run));
    assert.deepEqual(leftover, [], 'Chinese text left in the English article');
    assert.ok(en.length > zh.length * 0.8, 'English text is not a stub');
  });
}
