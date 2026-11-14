const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const files = ['posts', 'pages'].flatMap(dir => fs.readdirSync(path.join(root, dir)).filter(name => name.endsWith('.md')).map(name => path.join(dir, name)));
const PUNCT_END = /[？！。」』）；：，、”)]$/;
const PUNCT_START = /^[「『（(“"]/;
const WORDLIKE = /[\u3400-\u9fffA-Za-z0-9]/;

// A Markdown renderer only closes **bold** when the closing marker is not preceded by punctuation while followed by a letter or
// CJK character, and only opens it when the opening marker is not followed by punctuation while preceded by one. Such spans show up
// on the page as literal asterisks; write them as <strong>…</strong> instead.
test('no post or page contains **bold** that a Markdown renderer will leave as literal asterisks', () => {
  const problems = [];
  for (const file of files) {
    let fenced = false;
    fs.readFileSync(path.join(root, file), 'utf8').split(/\r?\n/).forEach((line, index) => {
      if (/^\s*(```|~~~)/.test(line)) { fenced = !fenced; return; }
      if (fenced) return;
      for (const match of line.matchAll(/(.?)\*\*([^*\r\n]+?)\*\*(.?)/g)) {
        const [, before, span, after] = match;
        const closeFails = PUNCT_END.test(span) && WORDLIKE.test(after) && !/）$/.test(span.trim()) === true;
        const closeFailsParen = /）$/.test(span) && WORDLIKE.test(after);
        const openFails = PUNCT_START.test(span) && WORDLIKE.test(before);
        if (closeFails || closeFailsParen || openFails) problems.push(`${file}:${index + 1}  ${before}**${span}**${after}`);
      }
    });
  }
  assert.deepEqual(problems, []);
});

test('no post or page leaves literal ** inside an HTML block, where Markdown is not parsed', () => {
  const problems = [];
  for (const file of files) {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    for (const block of text.matchAll(/<div[^>]*>([\s\S]*?)<\/div>/g)) {
      if (block[1].includes('**')) problems.push(`${file}: ${block[1].trim().slice(0, 50)}`);
    }
  }
  assert.deepEqual(problems, []);
});
