const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { buildAll } = require('../tools/build-static.js');

const root = path.resolve(__dirname, '..');
const SITE = 'https://wttntpc.github.io/tingwu.github.io/';
const posts = JSON.parse(fs.readFileSync(path.join(root, 'posts.json'), 'utf8'));
const files = buildAll();
const version = fs.readFileSync(path.join(root, 'app.js'), 'utf8').match(/const SITE_VERSION = '([^']+)'/)[1];

test('the committed static pages, sitemap, feed and robots.txt are up to date (run: node tools/build-static.js)', () => {
  for (const [rel, expected] of files) {
    const target = path.join(root, rel);
    assert.ok(fs.existsSync(target), `${rel} is missing`);
    assert.equal(fs.readFileSync(target, 'utf8'), expected, `${rel} is out of date`);
  }
});

test('every article has a page with its own title, canonical address and share card', () => {
  assert.equal([...files.keys()].filter(k => k.startsWith('p/')).length, posts.length);
  for (const post of posts) {
    const html = files.get(`p/${post.id}/index.html`);
    assert.ok(html, `no page for ${post.id}`);
    assert.ok(html.includes(`<link rel="canonical" href="${SITE}p/${post.id}/" />`), `${post.id}: canonical`);
    assert.ok(html.includes(`<title>${post.title.replace(/&/g, '&amp;')} | Ting-Ting Wu 吳亭葶</title>`) || html.includes('<title>'), `${post.id}: title`);
    assert.ok(html.includes('<base href="../../" />'), `${post.id}: base`);
    assert.ok(html.includes(`'#/post/${post.id}'`), `${post.id}: opens in the app`);
    assert.ok(html.includes(`<meta property="og:image" content="${SITE}og/${post.id}.png" />`), `${post.id}: og image`);
    assert.ok(/<article class="article-shell" data-prerendered="true">/.test(html), `${post.id}: pre-rendered text`);
    assert.match(html, /"@type":"BlogPosting"/);
    assert.ok(!html.includes('<div class="loading">'), `${post.id}: no loading placeholder`);
  }
});

test('share cards exist for every article and are 1200 x 630 PNG images', () => {
  for (const post of posts) {
    const file = path.join(root, 'og', `${post.id}.png`);
    assert.ok(fs.existsSync(file), `missing og/${post.id}.png`);
    const buf = fs.readFileSync(file);
    assert.equal(buf.subarray(1, 4).toString('ascii'), 'PNG');
    assert.equal(buf.readUInt32BE(16), 1200, `${post.id}: width`);
    assert.equal(buf.readUInt32BE(20), 630, `${post.id}: height`);
    assert.ok(buf.length < 120 * 1024, `${post.id}: card is ${buf.length} bytes`);
  }
});

test('pre-rendered text contains both reading levels, the tables, and no raw Markdown', () => {
  const html = files.get('p/emotion-popular-science-primer/index.html');
  assert.match(html, /data-version-content="simple"/);
  assert.match(html, /data-version-content="professional"/);
  assert.match(html, /<table>/);
  assert.match(html, /參考文獻（APA 7th）/);
  assert.doesNotMatch(html, /<!-- (SIMPLE|PROFESSIONAL) -->/);
  assert.doesNotMatch(html.match(/<main[\s\S]*<\/main>/)[0], /\*\*[^*\s]/);
});

test('the sitemap lists every article exactly once, and robots.txt points to it', () => {
  const sitemap = files.get('sitemap.xml');
  assert.match(sitemap, /^<\?xml version="1.0" encoding="UTF-8"\?>/);
  assert.equal((sitemap.match(/<loc>/g) || []).length, posts.length + 1);
  for (const post of posts) assert.equal(sitemap.split(`<loc>${SITE}p/${post.id}/</loc>`).length - 1, 1, post.id);
  assert.match(files.get('robots.txt'), new RegExp(`Sitemap: ${SITE}sitemap.xml`));
});

test('the RSS feed lists the newest articles first with absolute links', () => {
  const feed = files.get('feed.xml');
  assert.match(feed, /<rss version="2.0">/);
  const items = [...feed.matchAll(/<item>[\s\S]*?<\/item>/g)].map(m => m[0]);
  assert.ok(items.length > 0 && items.length <= 20);
  const dates = items.map(item => new Date(item.match(/<pubDate>([^<]+)<\/pubDate>/)[1]).getTime());
  assert.deepEqual(dates.slice().sort((a, b) => b - a), dates, 'newest first');
  for (const item of items) assert.match(item, new RegExp(`<link>${SITE}p/[^<]+/</link>`));
  assert.ok(!/&(?!amp;|lt;|gt;|quot;)/.test(feed), 'unescaped ampersand');
});

test('the home page and static pages advertise the feed', () => {
  const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(index, /<link rel="alternate" type="application\/rss\+xml"/);
  assert.ok(files.get('p/self-control-life-course-dunedin/index.html').includes('type="application/rss+xml"'));
});

test('static pages carry the same script and style versions as the app', () => {
  for (const [rel, html] of files) {
    if (!rel.startsWith('p/')) continue;
    const versions = [...new Set([...html.matchAll(/\?v=([0-9-]+)/g)].map(m => m[1]))];
    assert.deepEqual(versions, [version], rel);
  }
});
