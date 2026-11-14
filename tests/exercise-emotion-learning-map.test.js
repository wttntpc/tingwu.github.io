const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const posts = JSON.parse(fs.readFileSync(path.join(root, 'posts.json'), 'utf8'));
const body = fs.readFileSync(path.join(root, 'posts', 'exercise-emotion-learning-map.md'), 'utf8');
const postIds = new Set(posts.map(post => post.id));

test('exercise-emotion learning map is registered as track 08 in both languages', () => {
  const post = posts.find(item => item.id === 'exercise-emotion-learning-map');
  assert.ok(post, 'post entry exists');
  assert.equal(post.category, 'learning-foundations');
  assert.ok(post.titleEn && post.descriptionEn);
  const matches = app.match(/\['08', '[^']+', '[^']+', '[^']+', 'exercise-emotion-learning-map'\]/g) || [];
  assert.equal(matches.length, 2, 'one zh and one en track entry');
  assert.match(app, /"id": "exercise-emotion-learning-map"/, 'embedded fallback has the post');
});

test('every internal link in the learning map points to a real post, lab page or learning page', () => {
  const links = [...body.matchAll(/\]\(#\/([^)]+)\)/g)].map(match => match[1]);
  assert.ok(links.length >= 8);
  for (const link of links) {
    if (link.startsWith('post/')) assert.ok(postIds.has(link.slice(5)), `missing post: ${link}`);
    else assert.match(link, /^(lab(\/face-judgment|\/stop-signal)?|learning(\/statistics)?)$/, `unexpected route: ${link}`);
  }
});

test('the starting-source list keeps a DOI for every English reference and avoids outcome claims', () => {
  const sources = body.slice(body.indexOf('## 起始來源'));
  const items = sources.split('\n').filter(line => line.startsWith('- '));
  assert.ok(items.length >= 9);
  for (const item of items) assert.match(item, /https:\/\/doi\.org\/10\./, `no DOI: ${item.slice(0, 40)}`);
  assert.match(sources, /不是系統性回顧/);
  assert.doesNotMatch(body, /證實|證明了運動|保證/, 'no overclaiming words');
});

test('the public learning map does not expose private study-design details', () => {
  assert.doesNotMatch(body, /RQ[0-9]|crossover|SSRT|VO₂peak|visit|受試者人數|假設一/i);
});
