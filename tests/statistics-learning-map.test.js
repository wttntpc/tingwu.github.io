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

test('statistics is the seventh core learning track with Bayesian causal inference beneath it', () => {
  assert.match(app, /trackLabel: '七條核心主線'/);
  assert.match(app, /\['07', '統計分析', '貝氏統計與因果推論'/);
  assert.match(app, /\['07', 'Statistics', 'Bayesian statistics and causal inference'/);
  assert.match(app, /track\[4\]\.startsWith\('\/'\)/);
});

test('statistics map lists each source-supported weekly note in chronological order', () => {
  assert.match(app, /2026\/09\/15/);
  assert.match(app, /2026\/09\/22/);
  assert.match(app, /2026\/09\/29/);
  assert.match(app, /二元結果、潛在結果與因果圖/);
  assert.match(app, /2026\/10\/13/);
  assert.match(app, /2026\/10\/16/);
});

test('each source-supported class week has a discoverable article', () => {
  const expected = [
    'bayesian-causal-inference-week-01',
    'bayesian-causal-inference-week-02',
    'bayesian-causal-inference-week-03',
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
