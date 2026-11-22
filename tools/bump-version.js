#!/usr/bin/env node
// Single place to change the cache-busting version.
//
//   node tools/bump-version.js            -> next version for today (YYYYMMDD-NN)
//   node tools/bump-version.js 20261122-03 -> set an explicit version
//
// The version lives in app.js as SITE_VERSION and is repeated in the ?v= query strings of index.html and
// 404.html. This script rewrites all of them, then rebuilds the static article pages (tools/build-static.js),
// whose copies of the script tags carry the same version. tests/version-consistency.test.js fails if any
// place is out of step.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const appPath = path.join(root, 'app.js');
const app = fs.readFileSync(appPath, 'utf8');
const current = app.match(/const SITE_VERSION = '([^']+)'/)[1];

function nextVersion() {
  const d = new Date();
  const day = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const [curDay, curNo] = current.split('-');
  return curDay === day ? `${day}-${String(Number(curNo) + 1).padStart(2, '0')}` : `${day}-01`;
}

const next = process.argv[2] || nextVersion();
if (!/^\d{8}-\d{2}$/.test(next)) throw new Error(`version must look like 20261122-01, got ${next}`);

for (const file of ['app.js', 'index.html', '404.html']) {
  const p = path.join(root, file);
  const text = fs.readFileSync(p, 'utf8');
  const out = text.split(current).join(next);
  if (out !== text) fs.writeFileSync(p, out);
}
console.log(`version ${current} -> ${next}`);

const build = spawnSync(process.execPath, [path.join(__dirname, 'build-static.js')], { stdio: 'inherit' });
process.exit(build.status || 0);
