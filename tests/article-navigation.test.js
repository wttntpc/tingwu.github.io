const test = require('node:test');
const assert = require('node:assert/strict');
const { parsePostPath, sectionHref } = require('../article-navigation.js');

test('article section links preserve the post route', () => {
  assert.equal(
    sectionHref('fitness-hrv-cognitive-performance', 2),
    '#/post/fitness-hrv-cognitive-performance/section/2'
  );
});

test('post routes support an optional article section', () => {
  assert.deepEqual(parsePostPath('/post/fitness-hrv-cognitive-performance'), {
    postId: 'fitness-hrv-cognitive-performance',
    sectionIndex: null
  });
  assert.deepEqual(parsePostPath('/post/fitness-hrv-cognitive-performance/section/3'), {
    postId: 'fitness-hrv-cognitive-performance',
    sectionIndex: 3
  });
});

test('malformed article section routes are rejected', () => {
  assert.equal(parsePostPath('/post/example/section/0'), null);
  assert.equal(parsePostPath('/post/example/section/not-a-number'), null);
  assert.equal(parsePostPath('/post/%2e%2e%2findex/section/1'), null);
  assert.throws(() => sectionHref('example', 0), /Invalid article section/);
  assert.throws(() => sectionHref('../index', 1), /Invalid article section/);
});
