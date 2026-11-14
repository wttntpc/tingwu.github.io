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

test('home puts research and publications before the project tool and latest posts, and the hero offers a contact action', () => {
  const home = app.slice(app.indexOf('async function renderHome()'), app.indexOf('const researchAgenda'));
  const order = ['renderHomeAgenda', 'home-editorial-grid', 'home-projects', 'latest-section', 'home-lab-preview'].map(key => home.indexOf(key));
  assert.ok(order.every(i => i >= 0), 'all home blocks present');
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'blocks appear in research-first order');
  assert.match(home, /profile-contact/);
  assert.match(app, /heroTagline/);
});

test('publications are grouped by theme with first-author and language badges, no unpublished work added', () => {
  for (const file of ['publications.md', 'publications.en.md']) {
    const text = fs.readFileSync(path.join(root, 'posts', file), 'utf8');
    assert.equal((text.match(/<li>/g) || []).length - (text.match(/<li><strong>20/g) || []).length >= 0, true);
    assert.equal((text.match(/class="pub-badge pub-badge-first"/g) || []).length, 2);
    assert.equal((text.match(/<ol class="publication-list">/g) || []).length, 4);
    assert.doesNotMatch(text, /under review|in preparation|審查中|準備中/i);
  }
});

test('Go/No-Go copy has no duplicated keys that overwrite feedback text', () => {
  const ui = fs.readFileSync(path.join(root, 'emotion-gonogo-ui.js'), 'utf8');
  assert.equal((ui.match(/\bomission:/g) || []).length, 2, 'one omission feedback string per language');
  assert.equal((ui.match(/\bomissionRate:/g) || []).length, 2, 'one omission-rate label per language');
});

test('English copy avoids British spellings and gendered pronouns for the author', () => {
  const files = ['app.js', 'interactive-lab.js', 'emotion-gonogo-ui.js'].map(f => fs.readFileSync(path.join(root, f), 'utf8'));
  files.push(fs.readFileSync(path.join(root, 'pages', 'disclaimer.en.md'), 'utf8'));
  for (const text of files) {
    assert.doesNotMatch(text, /\bpractis(e|ed|ing)\b/);
    assert.doesNotMatch(text, /\bwithin her ability\b/);
  }
});

test('site icons exist as PNG/ICO for iOS, search engines and link cards, not only SVG', () => {
  for (const file of ['apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'favicon.ico', 'favicon.svg']) {
    assert.ok(fs.statSync(path.join(root, file)).size > 200, `${file} missing or empty`);
  }
  for (const page of ['index.html', '404.html']) {
    const text = fs.readFileSync(path.join(root, page), 'utf8');
    assert.match(text, /rel="apple-touch-icon" href="apple-touch-icon\.png"/);
    assert.match(text, /href="favicon\.ico"/);
  }
});
