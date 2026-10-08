#!/usr/bin/env node
/* MAT-054 gate types-runtime.
   Compares Object.keys(await import(<entry>)) for aura-glass/tokens and aura-glass/theme
   (via the built dist barrels / src barrels) against etc/api/<entry>.exports.json
   (SC-04; produced by TRUST-072's export-snapshot.mjs or scripts/build/api-report.mjs).
   Exit 1 on any mismatch in either direction; --check <tokens|theme|all>. */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './_util.mjs';

const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : null; };
const check = arg('check') ?? 'all';
const ENTRIES = check === 'all' ? ['tokens', 'theme'] : [check];

/** Runtime exports of a src barrel, via esbuild bundling (same trick as api-report). */
async function runtimeExports(srcEntry) {
  const { build } = await import('esbuild');
  const res = await build({
    entryPoints: [join(ROOT, srcEntry)], bundle: true, write: false, format: 'esm',
    platform: 'node', logLevel: 'silent',
  });
  const text = res.outputFiles[0].text;
  const m = /export\s*\{([^}]*)\}\s*;?\s*$/m.exec(text);
  const names = (m?.[1] ?? '')
    .split(',')
    .map((s) => s.trim().replace(/\s+as\s+\w+$/, ''))
    .filter((s) => s && !s.startsWith('type '))
    .sort();
  return names;
}

const SRC = { tokens: 'src/tokens/index.ts', theme: 'src/theme/index.ts' };

let failed = false;
for (const entry of ENTRIES) {
  const snapPath = join(ROOT, `etc/api/${entry}.exports.json`);
  if (!existsSync(snapPath)) {
    console.error(`types-runtime: ${snapPath.replace(`${ROOT}/`, '')} missing — run node scripts/build/api-report.mjs --entry ${entry} (TRUST-072/REL-003)`);
    failed = true;
    continue;
  }
  const expected = JSON.parse(readFileSync(snapPath, 'utf8')).exports ?? [];
  const actual = await runtimeExports(SRC[entry]);
  const missing = expected.filter((n) => !actual.includes(n));
  const extra = actual.filter((n) => !expected.includes(n));
  if (missing.length || extra.length) {
    console.error(`types-runtime: ${entry} mismatch — missing: [${missing.join(', ')}] extra: [${extra.join(', ')}]`);
    failed = true;
  } else {
    console.log(`types-runtime: ${entry} parity (${actual.length} exports)`);
  }
}
process.exit(failed ? 1 : 0);
