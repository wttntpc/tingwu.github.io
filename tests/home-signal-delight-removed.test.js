const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

test('the decorative EEG and HRV tug interaction is removed from the home page', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');

  assert.doesNotMatch(html, /science-delights\.js/);
  assert.doesNotMatch(app, /signal-delight|signal-tug|ScienceDelights/);
  assert.doesNotMatch(css, /\.signal-delight|\.signal-tug/);
  assert.equal(fs.existsSync(path.join(root, 'science-delights.js')), false);
});
