const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const posts = JSON.parse(fs.readFileSync(path.join(root, 'posts.json'), 'utf8'));
const postIds = new Set(posts.map(post => post.id));
const NEW = ['emotional-selective-stop-signal-task', 'exercise-emotion-learning-map', 'hrv-device-gold-standard-comparison'];

for (const id of NEW) {
  const body = fs.readFileSync(path.join(root, 'posts', `${id}.md`), 'utf8');

  test(`${id}: both reading levels exist and every internal post link resolves`, () => {
    assert.match(body, /<!-- SIMPLE -->/);
    assert.match(body, /<!-- PROFESSIONAL -->/);
    for (const match of body.matchAll(/\]\(#\/post\/([^)]+)\)/g)) assert.ok(postIds.has(match[1]), `missing post: ${match[1]}`);
  });

  test(`${id}: bold markers can be opened and closed by a Markdown renderer`, () => {
    for (const match of body.matchAll(/(.?)\*\*([^*\r\n]+)\*\*(.?)/g)) {
      const [, before, span, after] = match;
      const closesWithPunctuation = /[？！。」）；：，、]$/.test(span);
      const followedByLetter = /[\u3400-\u9fffA-Za-z0-9]/.test(after);
      assert.ok(!(closesWithPunctuation && followedByLetter && !/）$/.test(span)), `will not close: **${span}**${after}`);
      const opensWithPunctuation = /^[「『（(“"]/.test(span);
      const precededByLetter = /[\u3400-\u9fffA-Za-z0-9]/.test(before);
      assert.ok(!(opensWithPunctuation && precededByLetter), `will not open: ${before}**${span}`);
    }
  });
}

test('the stop-signal article is background only: it does not describe the demo task design', () => {
  const body = fs.readFileSync(path.join(root, 'posts', 'emotional-selective-stop-signal-task.md'), 'utf8');
  assert.doesNotMatch(body, /紅框|綠框|示範版|7–8 分鐘|校準區塊|練習階段/);
  for (const key of ['Lappin', 'Logan', 'Verbruggen', 'Aron', 'Nguyen']) assert.ok(body.slice(body.indexOf('## References')).includes(key), `reference missing: ${key}`);
});
