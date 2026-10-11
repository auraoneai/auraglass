#!/usr/bin/env node
/* scripts/removal/deprecations-coverage.mjs — PLAT-222 (REQ-PLAT-80).
   Every `removed`, `registry` or `labs` public name in
   docs/inventory/component-dispositions.md has a deprecation entry (from any
   stream's fragments/deprecations/<stream>.ts) whose `replacement` is a 5.0
   export, `registry:<item>`, `labs:<name>` or null.

   "5.0 export" = a symbol in a committed etc/api/<entry>.exports.json report
   (compat.* and cli.* excluded: a compat name is not a 5.0 target). A
   replacement such as `MediaControls.Root from aura-glass/media` is valid when
   its leading identifier is a 5.0 export.

     node scripts/removal/deprecations-coverage.mjs [--json] [--out <file>]

   Prints the missing / invalid lists (G-07 input) and writes them to
   --out (default .artifacts/plat/deprecations-coverage.json). Exit code 0;
   tests/removal/deprecations-coverage.test.ts holds the expiring baseline. */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dispositionsRows } from './consumer-grep.mjs';
import { PRD_STREAM, tokenOf } from './gen-component-dispositions.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAVING = new Set(['removed', 'registry', 'labs']);

export function exportSet(root = ROOT) {
  const dir = join(root, 'etc/api');
  const out = new Set();
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.exports.json') || f.startsWith('compat.') || f.startsWith('cli.')) continue;
    for (const s of JSON.parse(readFileSync(join(dir, f), 'utf8')).exports ?? []) out.add(s);
  }
  return out;
}

export function validReplacement(replacement, exports) {
  if (replacement === null) return true;
  if (typeof replacement !== 'string') return false;
  if (/^registry:[a-z0-9][a-z0-9-]*$/.test(replacement)) return true;
  if (/^labs:[A-Za-z][\w-]*$/.test(replacement)) return true;
  const lead = /^[A-Za-z_$][\w$]*/.exec(replacement)?.[0];
  return lead !== undefined && exports.has(lead);
}

/* The stream whose fragment must carry a row's entry: the PRD's 5.0 stream
   (PRD-16 removal / PRD-18 registry -> PLAT, PRD-21 labs -> SURF, …). */
export const entryOwner = (row) => PRD_STREAM[row.prd] ?? 'PLAT';

export function coverage(rows, entries, exports) {
  const bySymbol = new Map();
  for (const e of entries) {
    if (!e || e.kind !== 'export' || typeof e.symbol !== 'string') continue;
    if (!bySymbol.has(e.symbol)) bySymbol.set(e.symbol, []);
    bySymbol.get(e.symbol).push(e);
  }
  const need = rows.filter((r) => LEAVING.has(r.dest) && r.pub);
  const missing = [];
  const invalid = [];
  const seen = new Set();
  for (const r of need) {
    const sym = tokenOf(r.name);
    if (seen.has(sym)) continue;
    seen.add(sym);
    const es = bySymbol.get(sym);
    if (!es) { missing.push({ name: sym, dest: r.dest, owner: entryOwner(r) }); continue; }
    for (const e of es) {
      if (!validReplacement(e.replacement ?? null, exports)) {
        invalid.push({ name: sym, id: e.id, replacement: e.replacement, owner: e.__stream ?? entryOwner(r) });
      }
    }
  }
  return { need: seen.size, missing, invalid };
}

export async function loadEntries(root = ROOT) {
  const { loadFragments } = await import(pathToFileURL(join(root, 'src/contracts/load-fragments.mjs')).href);
  const out = [];
  for (const { stream, value } of await loadFragments('deprecations', root)) {
    for (const e of value ?? []) out.push({ ...e, __stream: String(stream).toUpperCase() });
  }
  return out;
}

export async function run(root = ROOT) {
  const rows = dispositionsRows(readFileSync(join(root, 'docs/inventory/component-dispositions.md'), 'utf8'));
  return coverage(rows, await loadEntries(root), exportSet(root));
}

async function main(argv = process.argv.slice(2)) {
  const res = await run(ROOT);
  const i = argv.indexOf('--out');
  const out = i >= 0 ? argv[i + 1] : join(ROOT, '.artifacts/plat/deprecations-coverage.json');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(res, null, 2) + '\n');
  if (argv.includes('--json')) console.log(JSON.stringify(res, null, 2));
  else console.log(`${res.need} removed/registry/labs public names; ${res.missing.length} without an entry; ${res.invalid.length} entries with an invalid replacement (${out})`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
