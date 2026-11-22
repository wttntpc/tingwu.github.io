const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const version = read('app.js').match(/const SITE_VERSION = '([^']+)'/)[1];

test('SITE_VERSION has the YYYYMMDD-NN shape (change it with: node tools/bump-version.js)', () => {
  assert.match(version, /^\d{8}-\d{2}$/);
});

test('every ?v= query string in index.html and 404.html equals SITE_VERSION', () => {
  for (const file of ['index.html', '404.html']) {
    const found = [...new Set([...read(file).matchAll(/\?v=([0-9-]+)/g)].map(m => m[1]))];
    assert.deepEqual(found, [version], `${file} carries ${found.join(', ')}`);
  }
});

test('every local script and stylesheet in index.html is versioned', () => {
  const tags = [...read('index.html').matchAll(/<(?:script src|link rel="stylesheet" href)="([^"]+)"/g)].map(m => m[1]).filter(u => !/^https?:/.test(u));
  assert.ok(tags.length > 10);
  for (const url of tags) assert.match(url, /\?v=/, `${url} has no version`);
});
