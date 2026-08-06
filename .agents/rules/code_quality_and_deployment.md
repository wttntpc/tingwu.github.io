# Code Quality & Deployment Safety Rules

To ensure website stability, prevent runtime failures, and maintain seamless GitHub Pages deployment, ALWAYS follow these strict guidelines before committing or pushing changes:

1. **Syntax Verification Before Push**:
   - ALWAYS run `node -c app.js` (or equivalent linter/syntax checker) before `git commit` or `git push` to verify there are zero syntax errors or duplicate variable declarations.

2. **Defensive Programming & Null Safety**:
   - ALWAYS check if DOM elements exist before calling methods or adding event listeners on them (e.g., `if (el) el.addEventListener(...)`).
   - Guard all third-party CDN library calls (e.g., `marked`, `hljs`, `mermaid`) with type checks (`typeof window.marked !== 'undefined'`) to prevent `ReferenceError` from stopping application execution if a CDN is blocked or slow.

3. **Relative Paths & Routing**:
   - Keep `<base href="./" />` relative so the site functions across all custom domains, subdomains, and local preview environments.
   - Maintain `404.html` fallback for single-page application (SPA) routing under static hosts like GitHub Pages.

4. **Network & Data Fallbacks**:
   - Ensure dynamic data fetching (`fetch('posts.json')`) includes timeouts or local in-memory fallbacks so the UI never gets stuck on loading indicators.

5. **Git Operations**:
   - Automatically run `git add .`, `git commit -m "..."`, and `git push` after completing feature changes or bug fixes.
