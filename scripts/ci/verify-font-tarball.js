#!/usr/bin/env node
/* PLAT-130/131 — font tarball assertion via parsePackJson.
   Default outcome (Aeonik removed): 0 packed paths matching /Aeonik/i,
   tarball <= 9.25 MB. Alternative (licensed): dist/styles/fonts/LICENSE
   packed and tarball <= 9.70 MB. */
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { parsePackJson } = require('./lib/npm-pack');

const ROOT = path.resolve(__dirname, '..', '..');
const licensed = fs.existsSync(
  path.join(ROOT, 'src', 'styles', 'fonts', 'Aeonik-Regular.woff2'),
);

let raw;
try {
  raw = execFileSync('npm', ['pack', '--dry-run', '--json'], {
    cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  });
} catch (e) {
  raw = e.stdout || '';
}
let entries;
try {
  entries = parsePackJson(raw);
} catch (e) {
  console.error(`verify-font-tarball: cannot parse npm pack output: ${e.message}`);
  process.exit(1);
}

const files = entries.files.map((f) => f.path);
const bytes = entries.size || 0;
const aeonik = files.filter((p) => /Aeonik/i.test(p));

if (licensed) {
  const hasLicense = files.some((p) => /dist\/styles\/fonts\/LICENSE$/i.test(p));
  if (!hasLicense) {
    console.error('verify-font-tarball: licensed path requires dist/styles/fonts/LICENSE in the tarball');
    process.exit(1);
  }
  if (bytes > 9.7 * 1024 * 1024) {
    console.error(`verify-font-tarball: tarball ${bytes} bytes > 9.70 MB`);
    process.exit(1);
  }
  console.log(`verify-font-tarball: licensed outcome ok — ${files.length} files, ${bytes} bytes`);
} else {
  if (aeonik.length) {
    console.error(`verify-font-tarball: ${aeonik.length} Aeonik paths still packed: ${aeonik.slice(0, 5).join(', ')}`);
    process.exit(1);
  }
  if (bytes > 9.25 * 1024 * 1024) {
    console.error(`verify-font-tarball: tarball ${bytes} bytes > 9.25 MB`);
    process.exit(1);
  }
  console.log(`verify-font-tarball: default outcome ok — 0 Aeonik paths, ${bytes} bytes <= 9.25 MB`);
}
