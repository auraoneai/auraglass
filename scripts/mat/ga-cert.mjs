#!/usr/bin/env node
/* scripts/mat/ga-cert.mjs — GA certification step (MAT-374, release scope).
 * Collects the §16 numbers for MAT's GA row: measures what is locally
 * measurable (artifact byte sizes) and reads the runtime numbers emitted by
 * the owning lanes' jobs from .artifacts/**. With `--enforce` any missing
 * measurement fails closed; without it missing inputs report `pending`. */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, relative } from 'node:path';

const root = process.cwd();
const ENFORCE = process.argv.includes('--enforce');
const rows = []; // { metric, budget, observed, status }
const record = (metric, budget, observed, unit, pass) =>
  rows.push({ metric, budget, observed, status: pass == null ? 'pending' : pass ? 'pass' : 'FAIL' });

const gz = (p) => gzipSync(readFileSync(p)).length;
const first = (cands) => cands.find((p) => existsSync(join(root, p)));
const sumFiles = (dir, ext) => {
  const abs = join(root, dir);
  if (!existsSync(abs)) return null;
  let total = 0;
  const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (f.endsWith(ext)) total += gz(p); } };
  walk(abs);
  return total;
};

// — locally measurable byte budgets —
const prepaint = first(['dist/prepaint.js', 'dist/ag-prepaint.js', 'dist/theme/prepaint.js']);
record('prepaint script min bytes', '<= 1536 B', prepaint ? `${statSync(join(root, prepaint)).size} B` : 'missing', 'B', prepaint ? statSync(join(root, prepaint)).size <= 1536 : null);
const theme = first(['dist/theme.js', 'dist/theme/index.js']);
record('./theme min+gz', '<= 4096 B', theme ? `${gz(join(root, theme))} B` : 'missing', 'B', theme ? gz(join(root, theme)) <= 4096 : null);
const a11yCss = sumFiles('src/a11y/css', '.css');
record('src/a11y/css min+gz', '<= 3072 B', a11yCss == null ? 'missing' : `${a11yCss} B`, 'B', a11yCss == null ? null : a11yCss <= 3072);

// — numbers read from lane artifacts under .artifacts/** —
const artifacts = {};
const readArtifacts = (dir) => {
  if (!existsSync(dir)) return;
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) readArtifacts(p);
    else if (f.endsWith('.json')) {
      try { artifacts[relative(root, p)] = JSON.parse(readFileSync(p, 'utf8')); } catch { /* not JSON */ }
    }
  }
};
readArtifacts(join(root, '.artifacts'));
const find = (keys) => {
  for (const [file, json] of Object.entries(artifacts)) {
    const stack = [json];
    while (stack.length) {
      const cur = stack.pop();
      if (cur && typeof cur === 'object') {
        for (const k of keys) if (typeof cur[k] === 'number') return { file, value: cur[k] };
        stack.push(...Object.values(cur));
      }
    }
  }
  return null;
};
const runtime = (metric, key, budget, pass) => {
  const hit = find([key]);
  record(metric, budget, hit ? `${hit.value} (${hit.file})` : 'missing', '', hit ? pass(hit.value) : null);
};

runtime('prepaint eval ms (mid-tier)', 'prepaintEvalMs', '<= 1 ms', (v) => v <= 1);
runtime('media query listeners', 'mqlCount', '<= 6', (v) => v <= 6);
runtime('contrast observers', 'contrastObservers', '0', (v) => v === 0);
runtime('sticky writes per frame', 'stickyWrites', '<= 1', (v) => v <= 1);
runtime('preference re-renders', 'preferenceRerenders', '<= 1', (v) => v <= 1);
runtime('scheme toggle style recalc ms', 'schemeRecalcMs', '<= 16 ms', (v) => v <= 16);
runtime('inert swap ms', 'inertSwapMs', '<= 2 ms', (v) => v <= 2);
runtime('announcer writes per 1000ms', 'announcerWrites', '<= 1', (v) => v <= 1);
runtime('hydration warnings', 'hydrationWarnings', '0', (v) => v === 0);
runtime('CLS', 'cls', '0.000', (v) => v === 0);
runtime('solid-rung frame vs lightweight', 'solidRungFrameDeltaPct', '<= +5%', (v) => v <= 5);
runtime('hit-area layouts', 'hitAreaLayouts', '0', (v) => v === 0);

const outDir = join(root, '.artifacts/mat/ga-cert');
mkdirSync(outDir, { recursive: true });
const table = ['| metric | budget | observed | status |', '|---|---|---|---|',
  ...rows.map((r) => `| ${r.metric} | ${r.budget} | ${r.observed} | ${r.status} |`)].join('\n');
writeFileSync(join(outDir, 'budget-table.md'), `${table}\n`);
console.log(table);

const fails = rows.filter((r) => r.status === 'FAIL');
const miss = rows.filter((r) => r.status === 'pending');
if (fails.length > 0) { console.error(`[ga-cert] ${fails.length} overruns`); process.exit(1); }
if (ENFORCE && miss.length > 0) { console.error(`[ga-cert] ${miss.length} measurements missing under --enforce`); process.exit(1); }
if (miss.length > 0) console.log(`[ga-cert] pending: ${miss.length} measurements absent`);
console.log('[ga-cert] done');
