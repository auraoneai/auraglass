#!/usr/bin/env node
// scripts/surf/literals-baseline.mjs — REQ-SURF-194 / REQ-FIN-90 (AC-FIN-90):
// the SURF literals-baseline fragment is the tool's measurement, never a
// hand-written number.
//
// Measures raw design literals with MAT's matcher (scripts/tokens/gates/
// literals.mjs `measure()`, the same auraglass/no-raw-design-values scan the
// MAT ratchet uses) over every src/ path contracts/ownership.json assigns to
// SURF, and compares it to fragments/literals-baseline/surf.json
// (LiteralsBaseline, contract S-45).
//
//   node scripts/surf/literals-baseline.mjs           check: exit 1 on any
//                                                      difference (increase or stale row)
//   node scripts/surf/literals-baseline.mjs --write   rewrite the fragment from the
//                                                      measurement; refuses any increase
//                                                      over a valid existing fragment
//
// The target is 0 rows by beta.1 (REQ-SURF-194); rows only ever go down.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// No trailing slash: measure() strips `${root}/` to get repo-relative paths.
const ROOT = fileURLToPath(new URL('../../', import.meta.url)).replace(/[\\/]+$/, '');
const FRAGMENT = 'fragments/literals-baseline/surf.json';

/** SURF-owned src/ globs from contracts/ownership.json → path predicates. */
export function surfSrcMatchers(root = ROOT) {
  const { rows } = JSON.parse(readFileSync(join(root, 'contracts/ownership.json'), 'utf8'));
  return rows
    .filter((r) => r.owner === 'SURF' && r.glob.startsWith('src/'))
    .map((r) => (r.glob.endsWith('/**') ? ((p) => p.startsWith(r.glob.slice(0, -2))) : ((p) => p === r.glob)));
}

export async function measureSurf(root = ROOT) {
  const { measure } = await import(join(root, 'scripts/tokens/gates/literals.mjs'));
  const owned = surfSrcMatchers(root);
  const files = Object.entries(measure(root))
    .filter(([f]) => owned.some((m) => m(f)))
    .sort(([a], [b]) => a.localeCompare(b));
  return { version: 1, files: Object.fromEntries(files) };
}

function isBaseline(v) {
  return v && v.version === 1 && v.files && typeof v.files === 'object' && !Array.isArray(v.files);
}

export function diff(measured, recorded) {
  const increases = [];
  const stale = [];
  for (const [file, cats] of Object.entries(measured.files)) {
    for (const [cat, n] of Object.entries(cats)) {
      const base = recorded.files[file]?.[cat] ?? 0;
      if (n > base) increases.push(`${file}: ${cat} ${base} -> ${n}`);
      else if (n < base) stale.push(`${file}: ${cat} ${base} -> ${n}`);
    }
  }
  for (const [file, cats] of Object.entries(recorded.files)) {
    for (const [cat, base] of Object.entries(cats)) {
      if (!(measured.files[file]?.[cat])) stale.push(`${file}: ${cat} ${base} -> 0`);
    }
  }
  return { increases, stale };
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const write = process.argv.includes('--write');
  const measured = await measureSurf(ROOT);
  const abs = join(ROOT, FRAGMENT);
  const current = existsSync(abs) ? JSON.parse(readFileSync(abs, 'utf8')) : null;
  const total = Object.values(measured.files).reduce((s, c) => s + Object.values(c).reduce((a, b) => a + b, 0), 0);
  if (write) {
    if (isBaseline(current)) {
      const { increases } = diff(measured, current);
      if (increases.length) {
        for (const i of increases) console.error(`literals-baseline: increase refused: ${i}`);
        process.exit(1);
      }
    }
    writeFileSync(abs, JSON.stringify(measured, null, 2) + '\n');
    console.log(`literals-baseline: wrote ${FRAGMENT} (${total} hits across ${Object.keys(measured.files).length} SURF files)`);
    process.exit(0);
  }
  if (!isBaseline(current)) {
    console.error(`literals-baseline: ${FRAGMENT} is not a LiteralsBaseline { version: 1, files }`);
    process.exit(1);
  }
  const { increases, stale } = diff(measured, current);
  for (const i of increases) console.error(`literals-baseline: increase: ${i}`);
  for (const s of stale) console.error(`literals-baseline: stale (run --write to ratchet down): ${s}`);
  console.log(`literals-baseline: ${total} hits across ${Object.keys(measured.files).length} SURF files; ${increases.length} increases, ${stale.length} stale`);
  process.exit(increases.length || stale.length ? 1 : 0);
}
