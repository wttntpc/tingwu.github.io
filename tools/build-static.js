#!/usr/bin/env node
// Builds the files that let each article be shared and found as an ordinary web address:
//
//   p/<id>/index.html   one pre-rendered page per article (title, description, share-card tags and the article
//                       text for crawlers and link previews; the single-page app then takes over)
//   sitemap.xml         every article page
//   feed.xml            RSS 2.0 feed of the latest articles
//   robots.txt          points crawlers at the sitemap
//
// Run from the repository root after adding or editing an article:
//     python tools/make-share-cards.py     (only when titles changed; writes og/<id>.png)
//     node tools/build-static.js
//
// The article text is rendered with the vendored copy of marked (tools/vendor/marked.min.js, MIT licence,
// https://github.com/markedjs/marked). Everything is generated from posts.json and posts/*.md; nothing in the
// output is edited by hand. tests/static-pages.test.js fails when the committed output is out of date.
const fs = require('node:fs');
const path = require('node:path');
const { marked } = require('./vendor/marked.min.js');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://wttntpc.github.io/tingwu.github.io/';
const AUTHOR = 'Ting-Ting Wu 吳亭葶';
const FEED_LIMIT = 20;

const read = (...parts) => fs.readFileSync(path.join(ROOT, ...parts), 'utf8');
const exists = (...parts) => fs.existsSync(path.join(ROOT, ...parts));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nl = s => s.replace(/\r\n/g, '\n');

function categoryLabels() {
  const app = nl(read('app.js'));
  const block = app.match(/categories: \[([\s\S]*?)\n    \]/);
  const map = {};
  if (block) for (const m of block[1].matchAll(/\['([^']+)', '([^']+)'\]/g)) map[m[1]] = m[2];
  if (!map['learning-foundations']) map['learning-foundations'] = '學習地圖';
  return map;
}

function splitLevels(md) {
  const text = nl(md);
  const simple = text.match(/<!-- SIMPLE -->([\s\S]*?)(?=<!-- PROFESSIONAL -->|$)/);
  const pro = text.match(/<!-- PROFESSIONAL -->([\s\S]*)$/);
  return { simple: simple ? simple[1].trim() : text.trim(), professional: pro ? pro[1].trim() : '' };
}

// the article body minus its own top-level heading (the page header shows the title)
const dropTitle = md => md.replace(/^\s*# .*\n/, '').trim();

function plainSummary(post) {
  return post.description || '';
}

function replaceTag(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`template is missing ${pattern}`);
  return html.replace(pattern, typeof replacement === 'function' ? replacement : () => replacement);
}

function pageFor(template, post, md, labels, version) {
  const id = post.id;
  const url = `${SITE}p/${id}/`;
  const image = exists('og', `${id}.png`) ? `${SITE}og/${id}.png` : `${SITE}og-image.png`;
  const title = post.title;
  const description = plainSummary(post);
  const category = labels[post.category] || post.category;
  const levels = splitLevels(md);
  const simpleHtml = marked.parse(dropTitle(levels.simple));
  const proHtml = levels.professional ? marked.parse(dropTitle(levels.professional)) : '';
  const tags = (post.tags || []).map(t => `<span>${esc(t)}</span>`).join('');

  let html = nl(template);
  html = replaceTag(html, /<html lang="en">/, '<html lang="zh-Hant">');
  html = replaceTag(html, /<base href=".\/" \/>/, '<base href="../../" />');
  html = replaceTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(description)}" />`);
  html = replaceTag(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`);
  html = replaceTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title)}" />`);
  html = replaceTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(description)}" />`);
  html = replaceTag(html, /<meta property="og:type" content="website" \/>/, '<meta property="og:type" content="article" />');
  html = replaceTag(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`);
  html = replaceTag(html, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${image}" />`);
  html = replaceTag(html, /<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${esc(title)}" />`);
  html = replaceTag(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(title)}" />`);
  html = replaceTag(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(description)}" />`);
  html = replaceTag(html, /<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${image}" />`);
  html = replaceTag(html, /<title>[^<]*<\/title>/, `<title>${esc(title)} | Ting-Ting Wu 吳亭葶</title>`);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished: post.date,
    inLanguage: 'zh-Hant',
    url,
    mainEntityOfPage: url,
    image,
    author: { '@type': 'Person', name: AUTHOR, url: SITE },
    publisher: { '@type': 'Person', name: AUTHOR },
    keywords: (post.tags || []).join(', ')
  };
  const headExtra = [
    `<meta property="og:locale" content="zh_TW" />`,
    `<meta property="og:locale:alternate" content="en" />`,
    `<meta property="article:published_time" content="${post.date}" />`,
    `<meta property="article:author" content="${esc(AUTHOR)}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
    // the app reads the route from the hash; open this article in the app unless the visitor already chose a route
    `<script>if(!location.hash){history.replaceState(null,'',location.pathname+location.search+'#/post/${id}');}</script>`
  ].join('\n    ');
  html = html.replace('</head>', `    ${headExtra}\n  </head>`);

  const body = `<main id="app" tabindex="-1">
      <article class="article-shell" data-prerendered="true"><a class="back-link" href="#/blog">← 返回文章列表</a><header class="article-header"><div class="post-meta">${esc(category)} · ${post.date}</div><h1>${esc(title)}</h1><p>${esc(description)}</p><div class="tag-list">${tags}</div></header>
    <div class="article-version markdown-body" data-version-content="simple">${simpleHtml}</div>${proHtml ? `\n    <div class="article-version markdown-body" data-version-content="professional">${proHtml}</div>` : ''}</article>
    </main>`;
  html = replaceTag(html, /<main id="app" tabindex="-1">[\s\S]*?<\/main>/, () => body);
  return html;
}

function rfc822(date) {
  return new Date(`${date}T00:00:00+08:00`).toUTCString();
}

function sitemap(posts) {
  const urls = [`  <url><loc>${SITE}</loc><changefreq>weekly</changefreq></url>`]
    .concat(posts.map(p => `  <url><loc>${SITE}p/${p.id}/</loc><lastmod>${p.date}</lastmod></url>`));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

function feed(posts) {
  const items = posts.slice(0, FEED_LIMIT).map(p => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE}p/${p.id}/</link>
      <guid isPermaLink="true">${SITE}p/${p.id}/</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <description>${esc(plainSummary(p))}</description>
    </item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(AUTHOR)}</title>
    <link>${SITE}</link>
    <description>運動、情緒與認知的研究筆記與科普文章 / Research notes and popular-science articles on exercise, emotion, and cognition.</description>
    <language>zh-Hant</language>
    <lastBuildDate>${rfc822(posts[0].date)}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

function buildAll() {
  const posts = JSON.parse(read('posts.json'));
  const template = read('index.html');
  const labels = categoryLabels();
  const version = (nl(read('app.js')).match(/const SITE_VERSION = '([^']+)'/) || [])[1];
  const files = new Map();
  for (const post of posts) {
    const mdPath = path.join('posts', `${post.id}.md`);
    if (!exists(mdPath)) continue;
    files.set(`p/${post.id}/index.html`, pageFor(template, post, read(mdPath), labels, version));
  }
  const built = posts.filter(p => files.has(`p/${p.id}/index.html`));
  const sorted = built.slice().sort((a, b) => b.date.localeCompare(a.date));
  files.set('sitemap.xml', sitemap(sorted));
  files.set('feed.xml', feed(sorted));
  files.set('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);
  return files;
}

function main() {
  const files = buildAll();
  let n = 0;
  for (const [rel, content] of files) {
    const target = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== content) { fs.writeFileSync(target, content); n++; }
  }
  console.log(`static pages: ${[...files.keys()].filter(k => k.startsWith('p/')).length} articles, ${n} files written`);
}

if (require.main === module) main();
module.exports = { buildAll, splitLevels };
