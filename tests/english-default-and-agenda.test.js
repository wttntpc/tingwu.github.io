const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const posts = JSON.parse(fs.readFileSync(path.join(root, 'posts.json'), 'utf8'));

test('site opens in English unless the visitor chose another language', () => {
  assert.match(app, /let lang = 'en';/);
  assert.match(app, /getItem\('tingting-language'\) \|\| 'en'/);
  assert.match(html, /<html lang="en">/);
});

test('every article has an English title and summary', () => {
  for (const post of posts) {
    assert.ok(post.titleEn && post.titleEn.length > 10, `titleEn missing: ${post.id}`);
    assert.ok(post.descriptionEn && post.descriptionEn.length > 20, `descriptionEn missing: ${post.id}`);
    assert.doesNotMatch(post.titleEn + post.descriptionEn, /[\u3400-\u9fff]/, `Chinese characters in English fields: ${post.id}`);
  }
});

test('embedded fallback posts carry the English fields too', () => {
  const embedded = app.match(/const POSTS_DATA = \[([\s\S]*?)\n\];/)[1];
  assert.equal((embedded.match(/"titleEn"/g) || []).length, posts.length);
});

test('English publications page exists and keeps every DOI of the Chinese page', () => {
  const zh = fs.readFileSync(path.join(root, 'posts', 'publications.md'), 'utf8');
  const en = fs.readFileSync(path.join(root, 'posts', 'publications.en.md'), 'utf8');
  const dois = zh.match(/https:\/\/doi\.org\/[^"<\s]+/g) || [];
  assert.ok(dois.length >= 8);
  for (const doi of new Set(dois)) assert.ok(en.includes(doi), `missing DOI in English page: ${doi}`);
});

test('research agenda is bilingual, flagged as planned work, and linked from the About page and home', () => {
  assert.match(app, /const researchAgenda = \{/);
  assert.match(app, /planned doctoral research/i);
  assert.match(app, /規劃中的博士論文研究/);
  assert.match(app, /id="about-agenda"/);
  assert.match(app, /\[labels\.agenda, 'agenda'\]/);
  assert.match(app, /renderHomeAgenda\(\)/);
  const block = app.match(/const researchAgenda = \{[\s\S]*?\nfunction renderResearchAgenda/)[0];
  assert.equal((block.match(/\['(Primary|Secondary|Exploratory)'/g) || []).length, 6);
  assert.equal((block.match(/\['(主要|次要|探索)'/g) || []).length, 6);
});
