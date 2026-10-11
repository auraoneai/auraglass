#!/usr/bin/env node
/* scripts/tokens/drift.mjs — REQ-FIN-01 token-build drift gate (mat:test:drift).
 *
 * Runs the token build, then fails (exit 1) if any generated surface diverges
 * from the committed tree:
 *   git diff --exit-code -- src/tokens src/motion/tokens.generated.ts \
 *     src/material/css/generated tokens/generated
 * and if the build left any untracked file under those paths (AC-FIN-01:
 * `git status --porcelain` empty). Plus the dist/compat/tokens.css checks of
 * AC-FIN-01 / MAT-013 / MAT-021: the file exists, postcss parses it, it carries no
 * `[object Object]` / `$schema` garbage, it has exactly one `@layer ag.compat { }`
 * block, and it stays <= 8 KB gzip.
 *
 * Usage: node scripts/tokens/drift.mjs
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import { runBuild } from './build.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const GENERATED_PATHS = [
  'src/tokens',
  'src/motion/tokens.generated.ts',
  'src/material/css/generated',
  'tokens/generated',
];
const COMPAT_CSS_GZIP_MAX = 8 * 1024; // MAT-021: dist/compat/tokens.css <= 8KB gz

await runBuild({ quiet: true });

let failed = false;
try {
  execSync(`git diff --exit-code -- ${GENERATED_PATHS.join(' ')}`, { cwd: ROOT, stdio: 'pipe' });
  console.log(`drift: generated surface matches committed tree (${GENERATED_PATHS.join(', ')})`);
} catch {
  console.error('drift: generated files diverge from committed tree — run `npm run tokens:build` and commit the result:');
  const out = execSync(`git diff --name-only -- ${GENERATED_PATHS.join(' ')}`, { cwd: ROOT, encoding: 'utf8' }).trim();
  console.error(out.split('\n').map((f) => `  ${f}`).join('\n'));
  failed = true;
}

const untracked = execSync(`git status --porcelain --untracked-files=all -- ${GENERATED_PATHS.join(' ')}`, { cwd: ROOT, encoding: 'utf8' })
  .split('\n').filter((l) => l.startsWith('??'));
if (untracked.length) {
  console.error('drift: the token build created files that are not committed:');
  console.error(untracked.map((l) => `  ${l.slice(3)}`).join('\n'));
  failed = true;
}

const compatPath = join(ROOT, 'dist/compat/tokens.css');
if (!existsSync(compatPath)) {
  console.error('drift: dist/compat/tokens.css was not written by the token build (MAT-021)');
  failed = true;
} else {
  const css = readFileSync(compatPath, 'utf8');
  for (const bad of ['[object Object]', '$schema']) {
    if (css.includes(bad)) {
      console.error(`drift: dist/compat/tokens.css contains "${bad}" (MAT-013: one writer, no raw alias-map keys)`);
      failed = true;
    }
  }
  try {
    const root = postcss.parse(css, { from: compatPath });
    let blocks = 0;
    root.walkAtRules('layer', (r) => { if (r.nodes && r.params.trim() === 'ag.compat') blocks += 1; });
    if (blocks !== 1) {
      console.error(`drift: dist/compat/tokens.css has ${blocks} @layer ag.compat blocks; expected exactly 1`);
      failed = true;
    }
  } catch (err) {
    console.error(`drift: dist/compat/tokens.css does not parse: ${err.message}`);
    failed = true;
  }
  const gz = gzipSync(readFileSync(compatPath)).length;
  if (gz > COMPAT_CSS_GZIP_MAX) {
    console.error(`drift: dist/compat/tokens.css is ${gz} bytes gzipped — exceeds the ${COMPAT_CSS_GZIP_MAX}-byte cap (MAT-021)`);
    failed = true;
  } else {
    console.log(`drift: dist/compat/tokens.css gzip ${gz}B <= ${COMPAT_CSS_GZIP_MAX}B`);
  }
}

process.exit(failed ? 1 : 0);
