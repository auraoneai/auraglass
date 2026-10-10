#!/usr/bin/env node
/* scripts/tokens/drift.mjs — REQ-FIN-01 token-build drift gate (mat:test:drift).
 *
 * Runs the token build, then fails (exit 1) if any generated surface diverges
 * from the committed tree:
 *   git diff --exit-code -- src/tokens src/motion/tokens.generated.ts \
 *     src/material/css/generated tokens/generated
 * Plus the MAT-021 size check: dist/compat/tokens.css must stay <= 8 KB gzip.
 *
 * Usage: node scripts/tokens/drift.mjs
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
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

const compatPath = join(ROOT, 'dist/compat/tokens.css');
if (existsSync(compatPath)) {
  const gz = gzipSync(readFileSync(compatPath)).length;
  if (gz > COMPAT_CSS_GZIP_MAX) {
    console.error(`drift: dist/compat/tokens.css is ${gz} bytes gzipped — exceeds the ${COMPAT_CSS_GZIP_MAX}-byte cap (MAT-021)`);
    failed = true;
  } else {
    console.log(`drift: dist/compat/tokens.css gzip ${gz}B <= ${COMPAT_CSS_GZIP_MAX}B`);
  }
}

process.exit(failed ? 1 : 0);
