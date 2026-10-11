#!/usr/bin/env node
/* MAT-102 — REQ-MAT-39 independent-glass-recipes metric.
   N = distinct src files OUTSIDE src/material/** and compiler output that emit a
   backdrop-filter/-webkit-backdrop-filter declaration or backdropFilter key,
   + 1 if src/material/** emits any.

   Usage:
     node scripts/mat/count-glass-recipes.mjs [--root <dir>]
         [--ratchet <baseline.json>] [--strict] [--update [--baseline <baseline.json>]]
         [--out <recipes.json>]
   Always prints `independent-glass-recipes: N` and writes the summary to --out
   (CI: .artifacts/mat/$CI_JOB_NAME_SLUG/recipes.json), else
   $AURAGLASS_EVIDENCE_DIR/mat/count-glass-recipes/recipes.json (default .artifacts).
   --ratchet fails on N > baseline.N or any noRegression file emitting;
   --strict fails on N > 1 (post-5.0.0-beta.1 mode);
   --update re-records the baseline (default <root>/scripts/mat/glass-recipes-baseline.json)
   from this measurement, keeping its noRegression list. The baseline is never hand-edited. */
import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { emitsBackdropFilter } from './optics-patterns.mjs';
import { isMain as isMainModule } from './_is-main.mjs';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const ROOT = resolve(opt('--root', '.'));
const RATCHET = opt('--ratchet', null);
const STRICT = args.includes('--strict');
const UPDATE = args.includes('--update');
const OUT = opt('--out', null);
const BASELINE = opt('--baseline', null);
const SCAN_EXT = /\.(css|ts|tsx|js|jsx|mjs|cjs)$/;

const isExcluded = (rel) =>
  rel.includes('/generated/') || rel.startsWith('dist/') || rel.startsWith('legacy/')
  || rel.includes('/node_modules/');

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === 'dist' || name.startsWith('.')) continue;
      yield* walk(p);
    } else if (SCAN_EXT.test(name)) {
      yield p;
    }
  }
}

export function count(root) {
  const srcDir = join(root, 'src');
  const inside = [];
  const outside = [];
  if (existsSync(srcDir)) {
    for (const file of walk(srcDir)) {
      const rel = relative(root, file).replace(/\\/g, '/');
      if (isExcluded(rel)) continue;
      const text = readFileSync(file, 'utf8');
      if (!emitsBackdropFilter(text)) continue;
      (rel.startsWith('src/material/') ? inside : outside).push(rel);
    }
  }
  const n = outside.length + (inside.length ? 1 : 0);
  return { n, inside, outside };
}

const isMain = isMainModule(import.meta.url);

if (isMain) {
  if (UPDATE && (RATCHET || STRICT)) {
    console.error('[count-glass-recipes] --update records a baseline; it cannot be combined with --ratchet/--strict');
    process.exit(2);
  }
  const { n, inside, outside } = count(ROOT);
  console.log(`independent-glass-recipes: ${n}`);
  for (const f of inside) console.log(`  inside  ${f}`);
  for (const f of outside) console.log(`  outside ${f}`);

  const outFile = OUT
    ? resolve(OUT)
    : join(process.env.AURAGLASS_EVIDENCE_DIR ?? join(ROOT, '.artifacts'), 'mat', 'count-glass-recipes', 'recipes.json');
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, JSON.stringify({
    'independent-glass-recipes': n, inside, outside,
  }, null, 1));

  if (UPDATE) {
    const baselineFile = resolve(BASELINE ?? join(ROOT, 'scripts/mat/glass-recipes-baseline.json'));
    const prev = existsSync(baselineFile) ? JSON.parse(readFileSync(baselineFile, 'utf8')) : {};
    let recordedAt = null;
    try {
      recordedAt = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch {
      recordedAt = null; // not a git checkout (fixture roots): the measurement still records
    }
    const next = {
      N: n,
      noRegression: prev.noRegression ?? [],
      inside,
      outside,
      recordedAt,
      recordedBy: 'node scripts/mat/count-glass-recipes.mjs --update',
    };
    writeFileSync(baselineFile, `${JSON.stringify(next, null, 2)}\n`);
    console.log(`[count-glass-recipes] baseline recorded: N=${n} -> ${relative(process.cwd(), baselineFile) || baselineFile}`);
    process.exit(0);
  }

  let failed = false;
  if (RATCHET) {
    const baseline = JSON.parse(readFileSync(resolve(RATCHET), 'utf8'));
    if (n > baseline.N) {
      console.error(`[count-glass-recipes] ratchet regression: ${baseline.N} -> ${n}`);
      failed = true;
    }
    for (const f of baseline.noRegression ?? []) {
      if (outside.includes(f) || inside.includes(f)) {
        console.error(`[count-glass-recipes] noRegression file re-emitted optics: ${f}`);
        failed = true;
      }
    }
    if (!failed) console.log(`[count-glass-recipes] ratchet OK (N=${n} <= ${baseline.N})`);
  }
  if (STRICT && n > 1) {
    console.error(`[count-glass-recipes] strict: ${n} > 1`);
    failed = true;
  }
  process.exit(failed ? 1 : 0);
}
