#!/usr/bin/env node
/* REQ-FIN-11 / REQ-CMP-19 token-name seam gate.

   Every `var(--ag-*)` in src/**\/*.css must name a variable that is either in the
   token manifest (src/tokens/generated/manifest.ts — written by `npm run
   tokens:build`, kept equal to the build by `mat:test:drift`) or in the contract
   lists PUBLIC_CSS_VARS ∪ MOTION_CSS_VARS (src/contracts/{tokens,motion}.ts,
   evaluated, not copied). Comments are ignored; fallbacks do not excuse a name.

   Baseline (PRD-F §4.3 rule 3): scripts/integration/baselines/undefined-component-vars.json,
   rows {file, owner, reqFin, expires:'RC-1', vars:[...]}. The gate fails on
     - a file with an undefined name and no row (new offender),
     - an undefined name in a baselined file that the row does not list (new offender),
     - a row whose file, or one of whose vars, no longer offends (stale — delete it),
     - a malformed row, and any row once RC-1 is reached: package.json `version` is a
       `-rc.N` pre-release, or today is past AG_RC1_DATE (ISO date, set by the release
       train once the RC-1 date is fixed). AC-FIN-GLOBAL needs the baseline at [].
   Every finding prints the replacement table entry for the name.

   Usage:
     node scripts/tokens/gates/undefined-component-vars.mjs              # gate src/**
     node scripts/tokens/gates/undefined-component-vars.mjs --file <css> # one file, no baseline
     node scripts/tokens/gates/undefined-component-vars.mjs --baseline <json> --src <dir>  # fixtures
   Exit: 0 clean, 1 findings, 2 setup error. */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = fileURLToPath(new URL('../../..', import.meta.url));
const require = createRequire(import.meta.url);

/** Published replacement table. CMP applies it under REQ-FIN-70 (CMP-08), SURF under REQ-FIN-80, MAT under its own REQ-FIN rows. */
export const REPLACEMENTS = {
  '--ag-accent': '--ag-color-accent',
  '--ag-focus-inner': '--ag-focus-width when used as a length (outline-offset, box-shadow spread); the colour is --ag-color-focus-inner',
  '--ag-color-focus-outer': '--ag-focus-outer',
  '--ag-color-focus-ring': '--ag-focus-outer',
  '--ag-space-1_5': 'calc(var(--ag-space-1) * 1.5)',
  '--ag-group-spacing': '--_ag-group-spacing (private; MAT-04 rename, reader in material.css under REQ-FIN-02)',
  '--ag-space-7': '--ag-space-8 (or calc(var(--ag-space-1) * 7))',
  '--ag-space-9': '--ag-space-10 (or calc(var(--ag-space-1) * 9))',
  '--ag-space-48': 'calc(var(--ag-space-16) * 3)',
  '--ag-space-72': 'calc(var(--ag-space-16) * 4.5)',
  '--ag-space-96': 'calc(var(--ag-space-16) * 6)',
  '--ag-control-h-*': '--ag-comp-control-height-{sm,md,lg}-{compact,default,spacious}',
  '--ag-chip-h-*': '--ag-comp-control-height-{sm,md,lg}-{compact,default,spacious}',
  '--ag-tint-*': 'the --ag-color-{accent,danger,warning,success,info} intent colours (MAT emits no tint family)',
};

export const replacementFor = (name) => {
  if (REPLACEMENTS[name]) return REPLACEMENTS[name];
  const wild = Object.keys(REPLACEMENTS).find((k) => k.endsWith('*') && name.startsWith(k.slice(0, -1)));
  return wild ? REPLACEMENTS[wild] : 'an emitted name from src/tokens/generated/manifest.ts or PUBLIC_CSS_VARS ∪ MOTION_CSS_VARS (private values belong in --_ag-*)';
};

export const REPLACEMENT_TABLE = Object.entries(REPLACEMENTS).map(([from, to]) => `  ${from} → ${to}`).join('\n');

/** Evaluate a contract module (types are stripped with the repo's typescript; no hand-copied lists). */
const loadContract = async (relPath) => {
  const ts = require('typescript');
  const src = readFileSync(join(ROOT, relPath), 'utf8');
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    fileName: relPath,
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
};

const collectStrings = (value, out) => {
  if (typeof value === 'string') out.add(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => collectStrings(v, out));
  return out;
};

export const contractVars = async () => {
  const { PUBLIC_CSS_VARS } = await loadContract('src/contracts/tokens.ts');
  const { MOTION_CSS_VARS } = await loadContract('src/contracts/motion.ts');
  if (!PUBLIC_CSS_VARS || !MOTION_CSS_VARS) throw new Error('contract exports PUBLIC_CSS_VARS / MOTION_CSS_VARS not found');
  return collectStrings([PUBLIC_CSS_VARS, MOTION_CSS_VARS], new Set());
};

export const manifestVars = (manifestPath = join(ROOT, 'src/tokens/generated/manifest.ts')) => {
  if (!existsSync(manifestPath)) throw new Error(`${relative(ROOT, manifestPath)} missing — run \`npm run tokens:build\``);
  const set = new Set();
  for (const m of readFileSync(manifestPath, 'utf8').matchAll(/"cssVar":\s*"(--[a-zA-Z0-9_-]+)"/g)) set.add(m[1]);
  if (set.size === 0) throw new Error(`${relative(ROOT, manifestPath)} has no cssVar entries`);
  return set;
};

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));

/** Every var(--ag-*) use in a CSS string: [{name, line}]. */
export const varUses = (css) => {
  const clean = stripComments(css);
  const uses = [];
  for (const m of clean.matchAll(/var\(\s*(--ag-[a-zA-Z0-9_-]+)/g)) {
    uses.push({ name: m[1], line: clean.slice(0, m.index).split('\n').length });
  }
  return uses;
};

const walk = (dir, out = []) => {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir).sort()) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { if (e !== 'node_modules' && e !== '.git') walk(p, out); }
    else if (e.endsWith('.css')) out.push(p);
  }
  return out;
};

const posix = (p) => p.split(sep).join('/');

/** Pure evaluation: offenders by file, baseline → findings. */
export const evaluate = ({ files, allowed, baseline, today = null, rc1Date = null, atRc = false }) => {
  const offenders = new Map(); // file -> Map(name -> first line)
  for (const { file, css } of files) {
    for (const u of varUses(css)) {
      if (allowed.has(u.name)) continue;
      if (!offenders.has(file)) offenders.set(file, new Map());
      const names = offenders.get(file);
      if (!names.has(u.name)) names.set(u.name, u.line);
    }
  }
  const findings = [];
  const rowOk = (r) => r && typeof r.file === 'string' && typeof r.owner === 'string' && /^REQ-FIN-\d+$/.test(r.reqFin ?? '')
    && r.expires === 'RC-1' && Array.isArray(r.vars) && r.vars.length > 0 && r.vars.every((v) => typeof v === 'string');
  const rows = new Map();
  for (const r of baseline) {
    if (!rowOk(r)) { findings.push(`${r?.file ?? '<row>'}: baseline row malformed (need {file, owner, reqFin: 'REQ-FIN-NN', expires: 'RC-1', vars: [...]})`); continue; }
    if (rows.has(r.file)) { findings.push(`${r.file}: duplicate baseline row`); continue; }
    rows.set(r.file, r);
    if (atRc || (rc1Date && today && today > rc1Date))
      findings.push(`${r.file}: baseline row EXPIRED (RC-1${rc1Date ? ` = ${rc1Date}` : ''}; owner ${r.owner}, ${r.reqFin})`);
  }
  for (const [file, names] of offenders) {
    const row = rows.get(file);
    for (const [name, line] of names) {
      if (row && row.vars.includes(name)) continue;
      findings.push(`${file}:${line}: var(${name}) is not declared (manifest ∪ PUBLIC_CSS_VARS ∪ MOTION_CSS_VARS) — use ${replacementFor(name)}`);
    }
  }
  for (const [file, row] of rows) {
    const names = offenders.get(file);
    if (!names) { findings.push(`${file}: baseline row is STALE — the file no longer uses an undefined --ag-* name; delete the row (owner ${row.owner}, ${row.reqFin})`); continue; }
    for (const v of row.vars) if (!names.has(v)) findings.push(`${file}: baseline var ${v} is STALE — no longer used; remove it from the row (owner ${row.owner}, ${row.reqFin})`);
  }
  return { findings, offenders, baselined: rows.size };
};

const arg = (n) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : undefined; };

const main = async () => {
  let allowed;
  try {
    allowed = new Set([...(await contractVars()), ...manifestVars()]);
  } catch (e) {
    console.error(`undefined-component-vars: ${e.message}`);
    process.exit(2);
  }
  const oneFile = arg('--file');
  const srcDir = resolve(ROOT, arg('--src') ?? 'src');
  const baselinePath = resolve(ROOT, arg('--baseline') ?? 'scripts/integration/baselines/undefined-component-vars.json');
  const paths = oneFile ? [resolve(ROOT, oneFile)] : walk(srcDir);
  const files = paths.map((p) => ({ file: posix(relative(ROOT, p)), css: readFileSync(p, 'utf8') }));
  const baseline = oneFile ? [] : (existsSync(baselinePath) ? JSON.parse(readFileSync(baselinePath, 'utf8')) : []);
  const today = new Date().toISOString().slice(0, 10);
  const rc1Date = process.env.AG_RC1_DATE || null;
  const { version } = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  const atRc = /-rc\.\d+/.test(version ?? '');
  const { findings, baselined } = evaluate({ files, allowed, baseline, today, rc1Date, atRc });
  if (findings.length) {
    for (const f of findings) console.error(f);
    console.error(`undefined-component-vars: ${findings.length} finding(s) over ${files.length} file(s)`);
    console.error(`replacement table (REQ-FIN-11):\n${REPLACEMENT_TABLE}`);
    process.exit(1);
  }
  console.log(`undefined-component-vars: clean (${files.length} files${baselined ? `, ${baselined} baselined until RC-1` : ''})`);
};

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch((e) => { console.error(`undefined-component-vars: ${e.stack ?? e}`); process.exit(2); });
}
