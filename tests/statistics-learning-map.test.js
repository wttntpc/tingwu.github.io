const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const posts = JSON.parse(fs.readFileSync(path.join(root, 'posts.json'), 'utf8'));

test('professional learning map links to a dedicated statistics learning map', () => {
  assert.match(app, /#\/learning\/statistics/);
  assert.match(app, /path === '\/learning\/statistics'/);
  assert.match(app, /function renderStatisticsLearningMap\(\)/);
});

test('statistics map separates published weekly notes from missing source material', () => {
  assert.match(app, /2026\/09\/15/);
  assert.match(app, /2026\/09\/22/);
  assert.match(app, /2026\/09\/29/);
  assert.match(app, /來源待補/);
  assert.match(app, /2026\/10\/13/);
  assert.match(app, /2026\/10\/16/);
});

test('each source-supported class week has a discoverable article', () => {
  const expected = [
    'bayesian-causal-inference-week-01',
    'bayesian-causal-inference-week-02',
    'bayesian-causal-inference-week-04',
    'bayesian-causal-inference-week-05'
  ];

  for (const id of expected) {
    assert.ok(posts.some(post => post.id === id), `missing metadata for ${id}`);
    const source = fs.readFileSync(path.join(root, 'posts', `${id}.md`), 'utf8');
    assert.match(source, /<!-- SIMPLE -->/);
    assert.match(source, /<!-- PROFESSIONAL -->/);
    assert.match(source, /課程來源|Sources/);
  }
});
