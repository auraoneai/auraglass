#!/usr/bin/env node
/* scripts/qual/perf/freeze-inputs.mjs — JSON inputs for tests/perf/qual/budgets-frozen.test.ts (REQ-QUAL-39), run as a
   child process so the test needs no ESM import under jest's --experimental-vm-modules.
     --rows <root>       → { perf: PerfBudgetRow[], size: SizeBudgetRow[] } via loadFragments (S-50) at <root>
     --seed-check <sha>  → { dirs, markers }: seed markers at <sha> in the meta directories of
                           thresholds.json#perf.calibration.seedFreeSubjects (Button, Dialog) */
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, readJson, readMetas, seedMarkersAt } from './lib.mjs';

const [flag, value] = process.argv.slice(2);
if (flag === '--rows') {
  const { loadFragments } = await import(pathToFileURL(join(ROOT, 'src/contracts/load-fragments.mjs')).href);
  const rows = async (kind) => (await loadFragments(kind, resolve(value))).flatMap((f) => (Array.isArray(f.value) ? f.value : []));
  process.stdout.write(JSON.stringify({ perf: await rows('perf-budgets'), size: await rows('size-budgets') }));
} else if (flag === '--seed-check') {
  const subjects = readJson(join(ROOT, 'certification/thresholds.json')).perf.calibration.seedFreeSubjects;
  const metas = await readMetas(ROOT);
  const dirs = subjects.map((s) => metas.find((m) => m.name === s)?.dir ?? null);
  if (dirs.includes(null)) { process.stderr.write(`no ComponentMeta for ${subjects.filter((_, i) => !dirs[i]).join(', ')}\n`); process.exit(1); }
  process.stdout.write(JSON.stringify({ dirs, markers: seedMarkersAt(value, dirs, ROOT) }));
} else {
  process.stderr.write('usage: --rows <root> | --seed-check <sha>\n');
  process.exit(64);
}
