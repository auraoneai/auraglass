#!/usr/bin/env node
/* scripts/release/verify-compat-coverage.mjs — REQ-PLAT-30 (PLAT-197). Fails
   when (a) a deprecation entry with `compat != null` has no export named
   <symbol> in the union of etc/api/compat.<stream>.exports.json, (b) a compat
   export has no entry, or (c) its entry has `replacement: null` (removed
   components never enter compat).

     node scripts/release/verify-compat-coverage.mjs [--reports-dir etc/api] */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

export function compatExports(reportsDir) {
  const union = new Map(); // symbol -> report file
  if (!existsSync(reportsDir)) return union;
  for (const f of readdirSync(reportsDir).filter((x) => /^compat\.[a-z]+\.exports\.json$/.test(x))) {
    const j = JSON.parse(readFileSync(join(reportsDir, f), 'utf8'));
    for (const n of j.exports ?? j.names ?? []) union.set(n, f);
  }
  return union;
}

export function checkCoverage(entries, exportsUnion, { pending = [] } = {}) {
  const errors = [];
  const withCompat = entries.filter((e) => e.compat != null);
  for (const e of withCompat) {
    if (e.replacement == null) {
      errors.push(`${e.id}: compat entry must name a replacement (removed components never enter compat)`);
    }
    if (!exportsUnion.has(e.symbol)) {
      errors.push(`${e.id}: compat '${e.compat}' declared but no compat.<stream> report exports '${e.symbol}'`);
    }
  }
  for (const [sym, report] of exportsUnion) {
    const e = entries.find((x) => x.symbol === sym && x.compat != null);
    if (!e) errors.push(`${report}: compat export '${sym}' has no deprecation entry with compat != null`);
  }
  return { errors, pending };
}

async function main(argv = process.argv.slice(2)) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const reportsDir = arg('--reports-dir') ?? join(ROOT, 'etc/api');
  const { loadEntries } = await import('./gen-deprecations.mjs');
  const entries = await loadEntries(ROOT);
  const union = compatExports(reportsDir);
  const pending = union.size ? [] : ['no compat.<stream>.exports.json reports present (api-report pending)'];
  const { errors } = checkCoverage(entries, union, { pending });
  for (const p of pending) console.log(`pending: ${p}`);
  if (errors.length) { for (const e of errors) console.error(`FAIL ${e}`); return 1; }
  console.log(`verify-compat-coverage: ${entries.filter((e) => e.compat != null).length} compat entries vs ${union.size} compat exports OK`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().then((c) => process.exit(c)).catch((e) => { console.error(e); process.exit(1); });
}
