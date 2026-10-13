#!/usr/bin/env node
/* scripts/plat/gen-compat-size-rows.mjs — REQ-PLAT-30 compat size rows.
   fragments/size-budgets/plat.ts must stay a static array literal (the
   QUAL deliverables checker reads rows without executing the fragment),
   so the derived compat rows — each `aura-glass/compat` export budgeted
   at its 5.0 target's row + 2 KB gz — are computed here and written into
   the marked block of plat.ts. Re-run whenever stream size rows,
   deprecation entries or compat exports change.

     node scripts/plat/gen-compat-size-rows.mjs          # rewrite block
     node scripts/plat/gen-compat-size-rows.mjs --check  # fail on drift
*/
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PLAT = join(ROOT, 'fragments/size-budgets/plat.ts');
export const BEGIN = '/* GENERATED-COMPAT-ROWS:BEGIN — node scripts/plat/gen-compat-size-rows.mjs */';
export const END = '/* GENERATED-COMPAT-ROWS:END */';
const COMPAT_HEADROOM_BYTES = 2048;

const targetsOf = (replacement) => {
  const head = (replacement ?? '').split(/\s+from\s+/)[0] ?? '';
  return head.split('+').map((part) => /^[A-Z]\w*/.exec(part.trim())?.[0]).filter((n) => !!n);
};

/** Pure: stream size rows + deprecation entries + compat export names ->
    the derived compat rows (same derivation plat.ts carried inline). */
export function compatSizeRows({ streamRows = [], entries = [], compatExports = [] } = {}) {
  const targetRows = new Map();
  for (const row of streamRows) {
    const name = row.kind === 'js'
      ? (/^\{\s*(\w+)\s*\}\s+from\s+'aura-glass(?:\/[\w-]+)?'$/.exec(row.import)?.[1]
        ?? /export const (\w+) =/.exec(row.import)?.[1])
      : undefined;
    if (name && !targetRows.has(name)) targetRows.set(name, row);
  }
  return [...new Set(compatExports)].sort().flatMap((name) => {
    const entry = entries.find((e) => e.symbol === name && e.compat != null);
    const targets = entry ? [...new Set(targetsOf(entry.replacement))].map((t) => targetRows.get(t)) : [];
    if (!targets.length || !targets[0]) return [];
    const limitBytes = targets.reduce((sum, t) => sum + (t?.limitBytes ?? 0), 0) + COMPAT_HEADROOM_BYTES;
    return [{ id: `plat:compat:${name}`, import: `{ ${name} } from 'aura-glass/compat'`, limitBytes, kind: 'js' }];
  });
}

async function loadInputs(root) {
  /* Lazy: load-fragments pulls esbuild, which must not load under jest
     when only the pure derivation is imported. */
  const { loadFragments } = await import('../../src/contracts/load-fragments.mjs');
  const size = await loadFragments('size-budgets', root);
  const deps = await loadFragments('deprecations', root);
  /* First-wins target lookup must see streams in the order the original
     inline derivation imported them: cmp, mat, surf. */
  const ordered = (fragments) => ['cmp', 'mat', 'surf'].flatMap(
    (s) => fragments.filter(({ stream }) => stream === s).flatMap(({ value }) => value ?? []),
  );
  const streamRows = ordered(size);
  const entries = ordered(deps);
  const compatExports = ['cmp', 'mat', 'surf'].flatMap(
    (s) => JSON.parse(readFileSync(join(root, `etc/api/compat.${s}.exports.json`), 'utf8')).exports ?? [],
  );
  return { streamRows, entries, compatExports };
}

export function renderBlock(rows) {
  const body = rows
    .map((r) => `  { id: ${JSON.stringify(r.id)}, import: ${JSON.stringify(r.import)}, limitBytes: ${r.limitBytes}, kind: 'js' },`)
    .join('\n');
  return `${BEGIN}\nconst compatRows: SizeBudgetRow[] = [\n${body}\n];\n${END}`;
}

export async function renderPlat(root = ROOT) {
  const current = readFileSync(join(root, 'fragments/size-budgets/plat.ts'), 'utf8');
  const block = renderBlock(compatSizeRows(await loadInputs(root)));
  const begin = current.indexOf(BEGIN);
  const end = current.indexOf(END);
  if (begin < 0 || end < begin) throw new Error('fragments/size-budgets/plat.ts: generated compat-rows markers missing');
  return current.slice(0, begin) + block + current.slice(end + END.length);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rendered = await renderPlat();
  if (process.argv.includes('--check')) {
    if (readFileSync(PLAT, 'utf8') !== rendered) {
      console.error('fragments/size-budgets/plat.ts compat rows are stale — run node scripts/plat/gen-compat-size-rows.mjs');
      process.exit(1);
    }
    console.log('compat size rows: up to date');
  } else {
    writeFileSync(PLAT, rendered);
    console.log('wrote fragments/size-budgets/plat.ts compat rows');
  }
}
