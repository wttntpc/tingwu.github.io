const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const CJK = /[㐀-鿿]/;

function copyFor(lang) {
  const marker = lang === 'zh' ? "  zh: {\n    nav:" : "  en: {\n    nav:";
  const normalized = app.replace(/\r\n/g, '\n');
  const start = normalized.indexOf(marker);
  assert.ok(start >= 0, `${lang} copy block not found`);
  const next = lang === 'zh' ? normalized.indexOf("\n  en: {\n    nav:") : normalized.indexOf('\n};', start);
  return normalized.slice(start, next);
}

const zh = copyFor('zh');
const en = copyFor('en');

function listOf(block, key) {
  const m = block.match(new RegExp(`${key}: \\[\\n([\\s\\S]*?)\\n    \\],`));
  assert.ok(m, `${key} not found`);
  return [...m[1].matchAll(/\['([^']*)', '([^']*)'(?:, '([^']*)')?\]/g)].map(x => x.slice(1));
}

test('the 2026 Ministry of Education scholarship is listed first, in both languages, with the wording supplied', () => {
  const clean = rows => rows.map(row => row.filter(cell => cell !== undefined));
  const zhList = clean(listOf(zh, 'scholarships'));
  const enList = clean(listOf(en, 'scholarships'));
  assert.deepEqual(zhList[0], ['2026', '教育部獎學金']);
  assert.deepEqual(enList[0], ['2026', 'Ministry of Education Scholarship, Taiwan']);
  assert.equal(zhList.length, enList.length);
});

test('scholarships and honors are listed newest first and every earlier item is still there', () => {
  for (const block of [zh, en]) {
    const years = [...listOf(block, 'scholarships'), ...listOf(block, 'honorsList')].map(item => item[0]);
    const scholarshipYears = listOf(block, 'scholarships').map(item => item[0]);
    assert.deepEqual([...scholarshipYears].sort().reverse(), scholarshipYears, 'scholarships newest first');
    assert.equal(years.length, 7, 'seven entries in total (six before plus the new one)');
  }
  const names = listOf(zh, 'scholarships').concat(listOf(zh, 'honorsList')).map(item => item[1]).join('|');
  for (const expected of ['教育部博士生獎學金', '國立中央大學 博士班入學獎學金', '斐陶斐榮譽會員', '平安菁英教育基金會 113-2 菁英獎學金', '智育獎-優秀畢業生獎項', '學業績優獎']) {
    assert.ok(names.includes(expected), `missing ${expected}`);
  }
});

test('education and work experience are separate lists with matching entries in both languages', () => {
  for (const block of [zh, en]) {
    assert.equal(listOf(block, 'education').length, 3);
    assert.equal(listOf(block, 'experience').length, 2);
  }
  assert.deepEqual(listOf(zh, 'education').map(i => i[0]), listOf(en, 'education').map(i => i[0]).map(y => y.replace('present', '至今')));
  for (const [dates] of [...listOf(zh, 'education'), ...listOf(zh, 'experience')]) assert.doesNotMatch(dates, /—/, 'ranges use an en dash');
});

test('About page sections follow the new order and the old journey link still resolves', () => {
  const ids = [...app.matchAll(/<section id="about-([a-z]+)" class="about-section">/g)].map(m => m[1]);
  assert.deepEqual(ids, ['intro', 'agenda', 'education', 'experience', 'skills', 'awards', 'contact']);
  assert.match(app, /id="about-framework"/);
  assert.match(app, /section === 'journey' \? 'education'/);
  assert.match(app, /about-glance/);
  assert.match(app, /<a href="#\/research">\$\{labels\.moreResearch\}<\/a>/);
});

test('English About copy has no Chinese characters', () => {
  const labels = app.match(/: \{\n    home: 'Home', title: 'About'[\s\S]*?moreResearch:[^\n]*\n/)[0];
  // The language switch deliberately names the other language ("Language: 中文").
  assert.doesNotMatch(labels.replace(/language: '[^']*',/, ''), CJK);
  for (const key of ['education', 'experience', 'scholarships', 'honorsList']) assert.doesNotMatch(JSON.stringify(listOf(en, key)), CJK, key);
});

test('the About page no longer promises a profile photo', () => {
  assert.doesNotMatch(app, /Profile photo coming soon|個人照片待更新/);
});
