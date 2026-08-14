(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ArticleNavigation = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const POST_ID_PATTERN = /^[a-z0-9-]+$/;

  function sectionHref(postId, sectionIndex) {
    const index = Number(sectionIndex);
    if (!POST_ID_PATTERN.test(postId) || !Number.isInteger(index) || index < 1) throw new TypeError('Invalid article section');
    return `#/post/${postId}/section/${index}`;
  }

  function parsePostPath(path) {
    const match = /^\/post\/([a-z0-9-]+)(?:\/section\/(\d+))?$/.exec(path);
    if (!match) return null;
    const sectionIndex = match[2] ? Number(match[2]) : null;
    if (sectionIndex !== null && (!Number.isInteger(sectionIndex) || sectionIndex < 1)) return null;
    return { postId: match[1], sectionIndex };
  }

  return { sectionHref, parsePostPath };
});
