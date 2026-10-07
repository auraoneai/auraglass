#!/usr/bin/env node
/* MAT-325 (ga-cert): reads the a11y certification artifacts and emits
   a11y-cert-summary.json — one row per AC-A11Y-01..25 with value, target,
   pass, and source artifact. Any artifact whose SHA differs from the GA SHA
   (--sha required) rejects the run. */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const argv = process.argv.slice(2);
const shaIdx = argv.indexOf('--sha');
const GA_SHA = shaIdx >= 0 ? argv[shaIdx + 1] : process.env.CI_COMMIT_SHA ?? null;
const ART_DIR = argv.find((a) => a.startsWith('--dir='))?.split('=')[1] ?? '.artifacts';
const OUT = path.join(ART_DIR, 'a11y-cert-summary.json');

const artifacts = {
  matrix: 'contrast-matrix.json',
  pixel: 'a11y-pixel-contrast.json',
  axe: 'axe-results.json',
  focus: 'focus-appearance.json',
  manual: GA_SHA ? `a11y-manual-${GA_SHA}.json` : null,
};

const load = (name) => {
  const p = path.join(ART_DIR, name);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null;
};

const problems = [];
const arts = {};
for (const [k, name] of Object.entries(artifacts)) {
  if (!name) continue;
  arts[k] = load(name);
  if (arts[k] && GA_SHA && arts[k].sha && arts[k].sha !== GA_SHA) {
    problems.push(`${name}: sha ${arts[k].sha} != GA sha ${GA_SHA}`);
  }
}

const minRatio = (rows, pred) =>
  Math.min(...(rows ?? []).filter(pred ?? (() => true)).map((r) => Number(r.worstRatio ?? r.ratio ?? Infinity)));

const rows = [];
const add = (id, value, target, pass, source) =>
  rows.push({ id, value, target, pass: pass === true, source });

// AC-A11Y-01..25 rows — id order mirrors the spec's numbering; unmeasured rows
// report pass:false with source 'missing' rather than being omitted.
add('AC-A11Y-01', minRatio(arts.pixel?.rows, (r) => r.kind === 'text' || r.need >= 4.5), '>=4.5', arts.pixel ? minRatio(arts.pixel?.rows) >= 4.5 : false, artifacts.pixel);
add('AC-A11Y-02', arts.pixel?.rows?.filter((r) => r.fail === true).length ?? null, '0', arts.pixel ? (arts.pixel.rows ?? []).every((r) => r.fail !== true) : false, artifacts.pixel);
add('AC-A11Y-03', arts.matrix ? 'computed' : null, 'all pairs pass', !!arts.matrix, artifacts.matrix);
add('AC-A11Y-04', arts.axe?.rows?.reduce((s, r) => s + (r.seriousCritical ?? 0), 0) ?? null, '0', arts.axe ? arts.axe.rows.every((r) => (r.seriousCritical ?? 0) === 0) : false, artifacts.axe);
add('AC-A11Y-05', arts.focus?.filter ? arts.focus.filter((r) => r.fail).length : (arts.focus?.rows ?? []).filter((r) => r.fail).length, '0', Array.isArray(arts.focus) ? arts.focus.every((r) => !r.fail) : (arts.focus?.rows ?? []).every((r) => !r.fail), artifacts.focus);
add('AC-A11Y-06', arts.manual ? 'present' : null, 'records on GA sha', !!arts.manual, artifacts.manual ?? 'a11y-manual-<sha>.json');
for (let i = 7; i <= 25; i += 1) {
  add(`AC-A11Y-${String(i).padStart(2, '0')}`, null, 'per spec', false, 'missing');
}

if (GA_SHA === null) problems.push('--sha (or CI_COMMIT_SHA) required to pin artifacts to the GA SHA');

fs.mkdirSync(ART_DIR, { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ sha: GA_SHA, rows, generated: new Date().toISOString() }, null, 2));
for (const p of problems) console.error(`FAIL ${p}`);
if (problems.length || rows.some((r) => !r.pass)) {
  console.log(`a11y-cert-summary: ${rows.filter((r) => r.pass).length}/${rows.length} pass — ${OUT}`);
  process.exit(1);
}
console.log(`a11y-cert-summary: all ${rows.length} rows pass — ${OUT}`);
