const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');

test('home research portal gives four distinct, bilingual task-based entry points', () => {
  const home = app.slice(app.indexOf('async function renderHome()'), app.indexOf('const researchAgenda'));
  assert.match(home, /class="home-portal"/);
  for (const route of ['#\/research', '#\/learning', '#\/lab', 'https:\/\/github\.com\/wttntpc']) {
    assert.match(home, new RegExp(route));
  }
  for (const label of ['從你想做的事開始', 'Start with what you want to do', '使用公開資源', 'Use open resources']) {
    assert.ok(home.includes(label), `missing portal copy: ${label}`);
  }
});

test('home hero exposes the concise research identity line', () => {
  const home = app.slice(app.indexOf('async function renderHome()'), app.indexOf('const researchAgenda'));
  assert.match(home, /class="profile-pillars">\$\{c\.profilePillars\}/);
});

test('portal has responsive layout and visible keyboard focus', () => {
  assert.match(css, /\.home-portal\s*\{/);
  assert.match(css, /\.home-portal-list a:focus-visible/);
  assert.match(css, /@media \(max-width: 460px\)[\s\S]*\.home-portal-list \{ grid-template-columns: 1fr; \}/);
});

test('repository publishes citation metadata without claiming a blanket license', () => {
  const citation = fs.readFileSync(path.join(root, 'CITATION.cff'), 'utf8');
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  assert.match(citation, /orcid: "https:\/\/orcid\.org\/0009-0003-2432-9812"/);
  assert.match(citation, /repository-code: "https:\/\/github\.com\/wttntpc\/tingwu\.github\.io"/);
  assert.doesNotMatch(citation, /^license:/m);
  assert.match(readme, /研究架構/);
  assert.match(readme, /不要.*推定所有內容均採開放授權|請勿.*推定所有內容均採開放授權/);
});
