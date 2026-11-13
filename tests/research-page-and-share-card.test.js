const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const CJK = /[㐀-鿿]/;

function extractObject(name) {
  const start = app.indexOf(`const ${name} = {`);
  assert.ok(start >= 0, `${name} not found`);
  let depth = 0; let end = start;
  for (let i = start + app.slice(start).indexOf('{'); i < app.length; i++) {
    if (app[i] === '{') depth++;
    if (app[i] === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
  }
  return new Function(`return (${app.slice(start + `const ${name} = `.length, end)});`)();
}

const page = extractObject('researchPageContent');

test('Research page is routed, listed in the navigation in both languages, and linked from the home research block', () => {
  assert.match(app, /path === '\/research'\) renderResearch\(\)/);
  assert.equal((app.match(/\['研究', '\/research'\]/g) || []).length, 1);
  assert.equal((app.match(/\['Research', '\/research'\]/g) || []).length, 1);
  assert.match(app, /<a href="#\/research">\$\{a\.homeLink\}<\/a>/);
});

test('Research page reuses the broad research-interest block and adds no study-design details', () => {
  const start = app.indexOf('function renderResearch()');
  const end = app.indexOf('function renderResearchAgenda');
  const body = app.slice(start, end);
  assert.match(body, /renderResearchAgenda\(\)/);
  assert.doesNotMatch(JSON.stringify(page), /RQ[0-9]|crossover|SSRT|VO₂peak|visit|protocol|IRB/i);
});

test('every demo on the Research page points to a routed experiment', () => {
  for (const lang of ['zh', 'en']) {
    assert.equal(page[lang].demos.length, 4);
    for (const demo of page[lang].demos) assert.match(app, new RegExp(`path === '/lab/${demo[0]}'`), `${demo[0]} is not routed`);
  }
  assert.deepEqual(page.zh.demos.map(d => d[0]), page.en.demos.map(d => d[0]));
});

test('the publication counts shown on the Research page match the publications page', () => {
  for (const [lang, file] of [['zh', 'publications.md'], ['en', 'publications.en.md']]) {
    const text = fs.readFileSync(path.join(root, 'posts', file), 'utf8');
    const numbers = text.match(/<p class="publication-summary">([^<]+)<\/p>/)[1].match(/\d+/g);
    const shown = page[lang].pubSummary.match(/\d+/g);
    assert.deepEqual(shown, numbers, `${lang}: Research page counts differ from ${file}`);
  }
});

test('English Research page copy has no Chinese characters', () => {
  assert.doesNotMatch(JSON.stringify(page.en), CJK);
});

test('the share card exists at the declared size and the page declares large-card metadata', () => {
  const png = fs.readFileSync(path.join(root, 'og-image.png'));
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  assert.ok(png.length > 5000 && png.length < 400000, `unexpected size ${png.length}`);
  for (const tag of ['og:image"', 'og:image:width"', 'og:image:height"', 'og:image:alt"', 'twitter:card" content="summary_large_image"', 'twitter:image"']) {
    assert.ok(html.includes(tag), `missing ${tag}`);
  }
  assert.match(html, /og:image" content="https:\/\/wttntpc\.github\.io\/tingwu\.github\.io\/og-image\.png"/);
});
