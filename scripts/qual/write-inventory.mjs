#!/usr/bin/env node
/* REQ-QUAL-02 (QUAL). Source-derived export inventory.
   Default: checks the inventory gate (packages/qa/baselines/inventory.json) and writes
   $AURAGLASS_EVIDENCE_DIR/qual/$CI_JOB_NAME_SLUG/inventory.json (EVIDENCE.jobDir) for later lanes.
   --print-baseline: prints the baseline rows the current unclassified exports need and exits.
   Needs Node type stripping (Node >= 22.18, or --experimental-strip-types on 22.6+). */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { INVENTORY_BASELINE, checkSourceInventory, sourceInventory } from '../../packages/qa/src/inventory/inventoryGate.ts';
import { readBaseline } from '../../packages/qa/src/evidence/expiringBaseline.ts';
import { loadOwnerOf } from '../../packages/qa/src/evidence/ownership.ts';
import { reqFinFor } from '../../packages/qa/src/evidence/attribution.ts';

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const root = resolve(opt('root', '.'));

if (args.includes('--print-baseline')) {
  const ownerOf = loadOwnerOf(root);
  const rows = sourceInventory(root).unclassified.map((u) => {
    const file = u.declaration.replace(/:\d+$/, '');
    const owner = ownerOf(file);
    return { file, owner, reqFin: reqFinFor(owner, file), expires: 'RC-1', entry: u.entry, name: u.name };
  });
  process.stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
  process.exit(0);
}

let inv;
try {
  inv = checkSourceInventory(root, readBaseline(resolve(root, opt('baseline', INVENTORY_BASELINE))), process.env.AG_SCOPE);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
const outDir = join(root, process.env.AURAGLASS_EVIDENCE_DIR ?? '.artifacts', 'qual', process.env.CI_JOB_NAME_SLUG ?? 'local');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'inventory.json'), `${JSON.stringify({ version: 1, items: inv.items, baselined: inv.baselined }, null, 2)}\n`);
const count = (c) => inv.items.filter((i) => i.class === c).length;
console.log(`inventory: ${inv.items.length} value exports over ${inv.entries.length} entries — visual ${count('visual')}, `
  + `alias ${count('alias')}, nonvisual ${count('nonvisual')}; ${inv.baselined.length} unclassified in the expiring baseline`);
