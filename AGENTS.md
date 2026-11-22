# Website editorial rules

## Source attribution

- When a paragraph, table, figure, or chart reports a specific numerical result, cite the primary study at the first occurrence whenever that source can be identified.
- Make the author-year citation clickable using the DOI, PMID, official journal page, or another stable scholarly record. Do not make readers search through a secondary review to find the underlying number.
- Include the complete APA 7th reference in each article version's reference list.
- A review may still be cited for synthesis, but do not attribute an original study's numerical result only to the review. State the evidence type and any limits on applying it to the article's topic.
- Verify that the quoted estimate, unit, confidence interval, sample, and study design match the cited source before publication.

## Publishing checklist (static pages and cache version)

- After adding or editing an article (`posts.json`, `posts/*.md`, `POSTS_DATA` in `app.js`), run `python tools/make-share-cards.py` when a title changed, then `node tools/build-static.js`. This regenerates `p/<id>/index.html`, `og/<id>.png`, `sitemap.xml`, `feed.xml` and `robots.txt`. `tests/static-pages.test.js` fails if they are stale.
- Change the cache-busting version only with `node tools/bump-version.js` (it updates `app.js`, `index.html`, `404.html` and rebuilds the static pages). Do not edit `?v=` strings by hand; `tests/version-consistency.test.js` checks them.
- Share article links as `https://wttntpc.github.io/tingwu.github.io/p/<id>/`; the `#/post/<id>` route has no title or preview card of its own.
- `tools/vendor/marked.min.js` is marked v18.2.1 (MIT, https://github.com/markedjs/marked), used only to pre-render article text at build time.
