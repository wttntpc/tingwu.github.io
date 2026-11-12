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

test('research interests are bilingual, broad, and linked from the About page and home', () => {
  assert.match(app, /const researchAgenda = {/);
  assert.match(app, /id="about-agenda"/);
  assert.match(app, /renderHomeAgenda()/);
  const start = app.indexOf('const researchAgenda = {');
  const end = app.indexOf('function renderResearchAgenda');
  assert.ok(start >= 0 && end > start);
  const block = app.slice(start, end);
  assert.doesNotMatch(block, /RQ[0-9]|crossover|SSRT|VO₂peak|visit/i, 'public page must not expose study-specific design details');
});
