#!/usr/bin/env node
/* REQ-PLAT-70: cold-import latency — spawn `node -e "import('<dist entry>')"`
   11 times per root entry and require the median ≤ 150 ms. Runs on whatever
   Node version CI provides (the pack-matrix exercises 20.19 and 22). */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DIST, ROOT, manifestEntries } from '../build/lib/graph.mjs';

const RUNS = Number(process.env.AG_COLD_IMPORT_RUNS || 11);
const BUDGET_MS = Number(process.env.AG_COLD_IMPORT_BUDGET || 150);
const ROOT_ENTRIES = ['.', './material', './compat'];

const once = (file) => {
  const t0 = process.hrtime.bigint();
  const r = spawnSync(process.execPath,
    ['--input-type=module', '-e', `await import(${JSON.stringify(file)})`],
    { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  return { ms, ok: r.status === 0 };
};

export async function run() {
  if (!existsSync(DIST)) { console.error('cold-import: dist/ missing — build first'); return 1; }
  const entries = manifestEntries(ROOT).js.filter(e => ROOT_ENTRIES.includes(e.subpath));
  const rows = [];
  let bad = 0;
  for (const e of entries) {
    const file = join(ROOT, e.default);
    if (!existsSync(file)) continue;
    const times = [];
    let failures = 0;
    for (let i = 0; i < RUNS; i++) {
      const { ms, ok } = once(file);
      if (!ok) failures++;
      times.push(ms);
    }
    times.sort((a, b) => a - b);
    const median = times[Math.floor(times.length / 2)];
    rows.push({ subpath: e.subpath, median: Math.round(median), failures });
    if (median > BUDGET_MS || failures) bad++;
  }
  for (const r of rows) {
    const flag = r.median > BUDGET_MS || r.failures ? 'FAIL' : 'ok';
    console.log(`cold-import: ${r.subpath} median ${r.median}ms (${r.failures} failure(s)) ${flag}`);
  }
  if (bad) { console.error(`cold-import: ${bad} entrie(s) over ${BUDGET_MS}ms or failing`); return 1; }
  console.log(`cold-import: all medians within ${BUDGET_MS}ms (${process.version})`);
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(await run());
