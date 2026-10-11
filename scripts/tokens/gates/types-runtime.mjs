#!/usr/bin/env node
/* MAT-054 gate types-runtime (REQ-MAT-22).
   Compares the runtime value exports of every MAT-owned ENTRIES row
   (./material, ./theme, ./tokens, ./motion — source barrels taken from
   src/contracts/entries.ts, bundled with esbuild) against
   etc/api/<entry>.exports.json (written by `npm run api:update -- --entry <e>`,
   scripts/build/api-report.mjs). Exit 1 on any mismatch in either direction;
   exit 2 ('blocked') when a report is missing — there is no silent fallback.

   usage: node scripts/tokens/gates/types-runtime.mjs [--check <material|theme|tokens|motion|all>] */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './_util.mjs';

const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : null; };
const check = arg('check') ?? 'all';

/** Peer and runtime dependencies stay external: only the barrel's own export
 *  list matters, and `motion` is an optional peer (§4.10). */
const EXTERNAL = ['react', 'react-dom', 'react-dom/*', 'react/*', 'react/jsx-runtime', 'clsx', 'motion', 'motion/*',
  'framer-motion', '@base-ui/react', '@base-ui/react/*'];

async function bundle(src) {
  const { build } = await import('esbuild');
  const res = await build({
    entryPoints: [join(ROOT, src)], bundle: true, write: false, format: 'esm',
    platform: 'node', logLevel: 'silent', external: EXTERNAL,
  });
  return res.outputFiles[0].text;
}

/** MAT rows of the ENTRIES contract: entry name -> source barrel. */
async function matEntries() {
  const text = await bundle('src/contracts/entries.ts');
  const mod = await import(`data:text/javascript;base64,${Buffer.from(text).toString('base64')}`);
  const out = {};
  for (const e of mod.ENTRIES) {
    if (e.owner !== 'MAT' || !e.source.startsWith('src/')) continue;
    out[e.subpath.replace(/^\.\//, '')] = e.source;
  }
  return out;
}

/** Runtime exports of a src barrel, via esbuild bundling (same trick as api-report). */
async function runtimeExports(srcEntry) {
  const text = await bundle(srcEntry);
  const m = [...text.matchAll(/export\s*\{([^}]*)\}\s*;?/g)].pop();
  return (m?.[1] ?? '')
    .split(',')
    .map((s) => s.trim())
    // esbuild renames collided bindings to `x2 as x` — the export name is the
    // ALIAS (what consumers import), so prefer it when present.
    .map((s) => (s.match(/\sas\s(\w+)$/)?.[1] ?? s))
    .filter((s) => s && !s.startsWith('type '))
    .sort();
}

const SRC = await matEntries();
const ENTRIES = check === 'all' ? Object.keys(SRC).sort() : [check];
const unknown = ENTRIES.filter((e) => !SRC[e]);
if (unknown.length) {
  console.error(`types-runtime: unknown entry '${unknown.join(', ')}' — MAT ENTRIES are ${Object.keys(SRC).sort().join(', ')}`);
  process.exit(2);
}

let failed = false;
let blocked = false;
for (const entry of ENTRIES) {
  const snapPath = join(ROOT, `etc/api/${entry}.exports.json`);
  if (!existsSync(snapPath)) {
    console.error(`types-runtime: blocked — etc/api/${entry}.exports.json missing; run npm run api:update -- --entry ${entry}`);
    blocked = true;
    continue;
  }
  const expected = JSON.parse(readFileSync(snapPath, 'utf8')).exports ?? [];
  const actual = await runtimeExports(SRC[entry]);
  const missing = expected.filter((n) => !actual.includes(n));
  const extra = actual.filter((n) => !expected.includes(n));
  if (missing.length || extra.length) {
    console.error(`types-runtime: ${entry} mismatch (${SRC[entry]}) — missing: [${missing.join(', ')}] extra: [${extra.join(', ')}]`);
    failed = true;
  } else {
    console.log(`types-runtime: ${entry} parity (${actual.length} exports)`);
  }
}
process.exit(failed ? 1 : blocked ? 2 : 0);
