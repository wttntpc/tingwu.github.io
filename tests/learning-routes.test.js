const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const posts = JSON.parse(fs.readFileSync(path.join(root, 'posts.json'), 'utf8'));
const CJK = /[㐀-鿿]/;

function extractObject(name) {
  const start = app.indexOf(`const ${name} = {`);
  assert.ok(start >= 0, `${name} not found`);
  let depth = 0; let end = start + app.slice(start).indexOf('{');
  for (let i = end; i < app.length; i++) {
    if (app[i] === '{') depth++;
    if (app[i] === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
  }
  return new Function(`return (${app.slice(start + `const ${name} = `.length, end)});`)();
}

const routes = extractObject('learningRoutes');
const content = extractObject('learningMapContent');

test('reading routes exist in both languages with identical structure', () => {
  assert.deepEqual(routes.zh.items.map(i => i.id), routes.en.items.map(i => i.id));
  for (const id of routes.zh.items.map(i => i.id)) {
    const zh = routes.zh.items.find(i => i.id === id); const en = routes.en.items.find(i => i.id === id);
    assert.equal(zh.steps.length, en.steps.length, id);
    assert.deepEqual(zh.steps.map(s => [s[0], s[1]]), en.steps.map(s => [s[0], s[1]]), `${id}: same tracks and levels`);
  }
  assert.ok(routes.zh.items.length >= 3);
});

test('every route step points to a real learning track, and every track resolves to a published page', () => {
  const codes = new Set(content.zh.tracks.map(t => t[0]));
  const postIds = new Set(posts.map(p => p.id));
  for (const lang of ['zh', 'en']) {
    for (const item of routes[lang].items) {
      for (const step of item.steps) {
        if (step[0] !== null) assert.ok(codes.has(step[0]), `${item.id}: unknown track ${step[0]}`);
        assert.match(step[1], /^[1-5]00(–[1-5]00)?$/, `${item.id}: level range ${step[1]}`);
        assert.ok(step[2].length >= 8, `${item.id}: step reason too short`);
      }
    }
  }
  for (const track of content.zh.tracks) assert.ok(track[4].startsWith('/') || postIds.has(track[4]), `track ${track[0]} target missing`);
});

test('each route climbs the levels in a sensible order and ends with integration', () => {
  for (const item of routes.zh.items.filter(i => i.id !== 'foundation')) {
    assert.equal(item.steps[item.steps.length - 1][0], null, `${item.id} should end with an integration step`);
    assert.equal(item.steps[item.steps.length - 1][1], '500');
  }
  const first = routes.zh.items.find(i => i.id === 'emotion-exercise').steps.map(s => s[0]);
  assert.deepEqual(first.slice(0, 2), ['01', '02']);
});

test('English route copy contains no Chinese characters', () => {
  assert.doesNotMatch(JSON.stringify(routes.en), CJK);
});

test('progress is a per-device convenience that never breaks the page when storage is blocked', () => {
  const load = app.match(/function loadRouteProgress\(\) \{[\s\S]*?\n\}/)[0];
  const save = app.match(/function saveRouteProgress\(progress\) \{[\s\S]*?\n\}/)[0];
  assert.match(load, /try \{[\s\S]*catch/);
  assert.match(save, /try \{[\s\S]*catch/);
  assert.match(app, /renderLearningRoutes\(content\)/);
  assert.match(app, /bindLearningRoutes\(\);\r?\n\}/);
  assert.doesNotMatch(routes.zh.pace + routes.zh.lead, /上傳|伺服器/);
});

test('the suggested pace is labelled as a suggestion and not a standard curriculum', () => {
  assert.match(routes.zh.pace, /建議/);
  assert.match(routes.zh.pace, /不是標準課程/);
  assert.match(routes.en.pace, /not a standard curriculum/);
});
