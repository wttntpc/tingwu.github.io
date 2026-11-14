const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'style.css'), 'utf8');

test('personal homepage lists the injury and first-aid assistant in both languages', () => {
  assert.match(app, /AT × EMT 運動傷害與急救助手/);
  assert.match(app, /AT × EMT Injury & First-Aid Assistant/);
  assert.match(app, /at-emt-1-course-radar\.vercel\.app\/injury-assistant\.html/);
  assert.match(app, /injury\.sportsmedicine\.tw/);
});

test('project list supports more than one project and visually distinguishes safety tool', () => {
  assert.match(app, /class="home-project-list"/);
  assert.match(app, /home-project-row-safety/);
  assert.match(styles, /\.home-project-list/);
  assert.match(styles, /\.home-project-row-safety/);
});
