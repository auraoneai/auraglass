#!/usr/bin/env node
/* scripts/compat/gen-fixtures-map.mjs — CMP-054 (PRD-18 compat-fixtures map).
   Generates tests/compat/fixtures-map.json from the generated appendix
   docs/inventory/component-dispositions.md: every public 4.x name whose
   destination is compat / removed / registry / labs, keyed by its public
   token, with the appendix target. tests/foundation/exports/
   compat-map.test.ts asserts dest=compat names resolve from the built
   aura-glass/compat entry and no other dest leaks into it.

     node scripts/compat/gen-fixtures-map.mjs          # write the map
     node scripts/compat/gen-fixtures-map.mjs --check  # fail on drift
*/
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dispositionsRows } from '../removal/consumer-grep.mjs';
import { loadFragments } from '../../src/contracts/load-fragments.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const APPENDIX = join(ROOT, 'docs/inventory/component-dispositions.md');
const OUT = join(ROOT, 'tests/compat/fixtures-map.json');
const DESTS = new Set(['compat', 'removed', 'registry', 'labs']);

const tokenOf = (name) => name.split(/[\s(/]/)[0];

/** Pure: appendix rows + deprecation entries -> the fixtures map.
    The stream-owned deprecation fragments are the operative compat
    contract (they drive the codemods, the runtime warnings and the
    REQ-PLAT-30 coverage bijection): an entry carrying `compat` promises
    the aura-glass/compat export; an entry without it removes the name in
    5.0 (or routes it to registry:/labs: per its replacement). The
    appendix is generated from coarser inventory dispositions
    (CONSOLIDATE maps to compat mechanically), so an appendix-compat name
    with no fragment promise was consolidated into its 5.0 target, not
    adapted — dest removed. Appendix dest applies only where no fragment
    entry speaks (removed/registry/labs rows). */
export function buildFixturesMap(rows, entries = []) {
  const map = {};
  const bySymbol = new Map();
  for (const e of entries) {
    if (typeof e.symbol !== 'string') continue;
    /* A symbol can carry several entries across streams (e.g. a MAT prop
       entry and the CMP export entry); the compat promise on any of them
       is the operative one for the export. */
    if (!bySymbol.has(e.symbol) || (e.compat && !bySymbol.get(e.symbol).compat)) bySymbol.set(e.symbol, e);
  }
  const destOf = (entry, appendixDest) => {
    if (entry?.compat) return 'compat';
    if (entry) {
      if (typeof entry.replacement === 'string' && entry.replacement.startsWith('registry:')) return 'registry';
      if (typeof entry.replacement === 'string' && entry.replacement.startsWith('labs:')) return 'labs';
      return 'removed';
    }
    return appendixDest === 'compat' ? 'removed' : appendixDest;
  };
  for (const row of rows) {
    if (!row.pub || !DESTS.has(row.dest)) continue;
    const name = tokenOf(row.name);
    if (!name || name in map) continue;
    const entry = bySymbol.get(name);
    map[name] = { target: entry?.replacement ?? row.target, dest: destOf(entry, row.dest) };
  }
  for (const e of entries) {
    if (!e.compat || typeof e.symbol !== 'string' || e.symbol in map) continue;
    map[e.symbol] = { target: e.replacement ?? e.compat, dest: 'compat' };
  }
  return Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
}

export async function renderFixturesMap(root = ROOT) {
  const rows = dispositionsRows(readFileSync(join(root, 'docs/inventory/component-dispositions.md'), 'utf8'));
  const fragments = await loadFragments('deprecations', root);
  const entries = fragments.flatMap(({ value }) => value ?? []);
  return `${JSON.stringify(buildFixturesMap(rows, entries), null, 1)}\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rendered = await renderFixturesMap();
  if (process.argv.includes('--check')) {
    const current = readFileSync(OUT, 'utf8');
    if (current !== rendered) {
      console.error('tests/compat/fixtures-map.json is stale — run node scripts/compat/gen-fixtures-map.mjs');
      process.exit(1);
    }
    console.log('fixtures-map: up to date');
  } else {
    writeFileSync(OUT, rendered);
    console.log(`wrote tests/compat/fixtures-map.json (${Object.keys(JSON.parse(rendered)).length} names)`);
  }
}
