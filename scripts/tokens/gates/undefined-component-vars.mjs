#!/usr/bin/env node
/* REQ-FIN-11 / REQ-CMP-19: every var(--ag-*) reference in src/**\/*.css must be
   declared — in the token manifest (dist/tokens/registry-cssvars.json, written by
   tokens:build) or in the contract lists PUBLIC_CSS_VARS ∪ MOTION_CSS_VARS
   (src/contracts). A miss is a seam violation: the CMP/SURF file must use an
   emitted name (the replacement table below is printed in the message).

   Baseline: scripts/integration/baselines/undefined-component-vars.json rows
   {file, owner, reqFin, expires:'RC-1'} per PRD-F §4.3 rule 3 — gate fails on a
   NEW offender file, a STALE row and a malformed row.

   --file <path>: check one file, no baseline (fixture verification). */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = fileURLToPath(new URL('../../..', import.meta.url));

/** Published replacement table (CMP applies it under REQ-FIN-70/-73; SURF under -90). */
export const REPLACEMENTS = {
  '--ag-accent': '--ag-color-accent',
  '--ag-focus-inner': '--ag-focus-width (as a length; --ag-color-focus-inner stays a colour)',
  '--ag-color-focus-outer': '--ag-focus-outer',
  '--ag-color-focus-ring': '--ag-focus-outer',
  '--ag-space-7': '--ag-space-8',
  '--ag-space-9': '--ag-space-10',
  '--ag-space-48': 'calc(var(--ag-space-16) * 3)',
  '--ag-space-72': 'calc(var(--ag-space-16) * 4.5)',
  '--ag-space-96': 'calc(var(--ag-space-16) * 6)',
  '--ag-control-h-*': '--ag-comp-control-height-{sm,md,lg}-{compact,default,spacious}',
  '--ag-chip-h-*': '--ag-comp-control-height-{sm,md,lg}-{compact,default,spacious}',
  '--ag-tint-*': 'the --ag-color-* intent tokens (none emitted as --ag-tint-*)',
};

/** Contract var sets — parsed so the gate tracks the contract, not a copy. */
const contractVars = () => {
  const tokensTs = readFileSync(join(ROOT, 'src/contracts/tokens.ts'), 'utf8');
  const motionTs = readFileSync(join(ROOT, 'src/contracts/motion.ts'), 'utf8');
  const names = new Set();
  const m = /export const PUBLIC_CSS_VARS = \{([\s\S]*?)\} as const;/s.exec(tokensTs);
  const m2 = /export const MOTION_CSS_VARS = \[([\s\S]*?)\] as const;/s.exec(motionTs);
  const body = (m?.[1] ?? '') + '\n' + (m2?.[1] ?? '');
  for (const hit of body.matchAll(/'(--ag-[a-z0-9-]+)'/g)) names.add(hit[1]);
  // list comprehensions in the contract: expand the mapped families literally
  for (const c of ['canvas', 'on-surface', 'on-surface-muted', 'accent', 'on-accent', 'border',
    'focus-inner', 'focus-outer', 'specular', 'danger', 'warning', 'success', 'info'])
    names.add(`--ag-color-${c}`);
  for (const s of ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16']) names.add(`--ag-space-${s}`);
  for (const r of ['xs', 'sm', 'md', 'lg', 'xl', 'full']) names.add(`--ag-radius-${r}`);
  for (const t of ['display', 'title-1', 'title-2', 'title-3', 'body', 'callout', 'caption', 'label', 'mono'])
    for (const k of ['size', 'leading', 'weight']) names.add(`--ag-type-${t}-${k}`);
  for (const z of ['content', 'chrome', 'overlay', 'transient', 'toast']) names.add(`--ag-z-${z}`);
  for (const d of ['instant', 'micro', 'small', 'medium', 'large'])
    for (const s of ['', '-exit']) names.add(`--ag-duration-${d}${s}`);
  for (const e of ['standard', 'emphasized', 'emphasized-decelerate', 'accelerate']) names.add(`--ag-ease-${e}`);
  for (const s of ['snappy', 'smooth', 'fluid'])
    for (const k of ['', '-duration']) names.add(`--ag-spring-${s}${k}`);
  for (const lit of ['--ag-duration-ambient', '--ag-light-angle', '--ag-specular', '--ag-glass-opacity',
    '--ag-surface-fill', '--ag-surface-rim', '--ag-surface-shadow', '--ag-surface-radius',
    '--ag-on-surface', '--ag-on-surface-muted', '--ag-radius-outer', '--ag-inset', '--ag-radius-inner',
    '--ag-focus-inner', '--ag-focus-outer', '--ag-focus-width',
    '--ag-scroll-padding-top', '--ag-scroll-padding-bottom',
    '--ag-shadow-thin', '--ag-shadow-regular', '--ag-shadow-thick',
    '--ag-state-hover-specular', '--ag-state-press-glow', '--ag-state-disabled-alpha',
    '--ag-target-min', '--ag-target-coarse', '--ag-density',
    '--ag-scrim-clear', '--ag-scrim-media',
    '--background', '--foreground', '--primary', '--primary-foreground', '--muted', '--border', '--ring', '--radius'])
    names.add(lit);
  return names;
};

const manifestVars = () => {
  const p = join(ROOT, 'dist/tokens/registry-cssvars.json');
  if (!existsSync(p)) {
    console.error('undefined-component-vars: dist/tokens/registry-cssvars.json missing — run `npm run tokens:build` first');
    process.exit(2);
  }
  const reg = JSON.parse(readFileSync(p, 'utf8'));
  const set = new Set();
  const grab = (o) => {
    if (typeof o === 'string' && o.startsWith('--')) set.add(o);
    else if (Array.isArray(o)) o.forEach(grab);
    else if (o && typeof o === 'object') Object.values(o).forEach(grab);
  };
  grab(reg);
  return set;
};

export const checkCss = (css, filename) => {
  const issues = [];
  for (const m of css.matchAll(/var\(\s*(--ag-[a-zA-Z0-9-]+)/g)) {
    issues.push({ file: filename, name: m[1], pos: m.index });
  }
  return issues;
};

const walk = (dir, out = []) => {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) { if (e !== 'node_modules' && e !== '.git') walk(p, out); }
    else if (/\.css$/.test(e)) out.push(p);
  }
  return out;
};

const main = () => {
  const allowed = new Set([...contractVars(), ...manifestVars()]);
  const fileArg = process.argv.indexOf('--file');
  const oneFile = fileArg !== -1 ? process.argv[fileArg + 1] : null;
  const files = oneFile ? [join(ROOT, oneFile)] : walk(join(ROOT, 'src'));
  const hits = [];
  for (const f of files) {
    for (const h of checkCss(readFileSync(f, 'utf8'), relative(ROOT, f)))
      if (!allowed.has(h.name)) hits.push(h);
  }
  const byFile = new Map();
  for (const h of hits) {
    if (!byFile.has(h.file)) byFile.set(h.file, []);
    byFile.get(h.file).push(h.name);
  }
  const BASELINE = join(ROOT, 'scripts/integration/baselines/undefined-component-vars.json');
  const baseline = !oneFile && existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : [];
  const rowOk = (r) => r && typeof r.file === 'string' && typeof r.owner === 'string'
    && typeof r.reqFin === 'string' && r.expires === 'RC-1';
  const covered = new Set();
  const reported = [];
  for (const [file, names] of byFile) {
    const rows = baseline.filter((r) => r.file === file);
    if (rows.length === 0) {
      for (const n of names) {
        const rep = REPLACEMENTS[n] ?? REPLACEMENTS[Object.keys(REPLACEMENTS).find((k) => k.endsWith('*') && n.startsWith(k.slice(0, -1))) ?? ''] ?? 'an emitted --ag-* name (see manifest)';
        reported.push(`${file}: var(${n}) is not declared — use ${rep}`);
      }
    } else {
      for (const r of rows) {
        if (!rowOk(r)) { reported.push(`${file}: baseline row malformed (need {file,owner,reqFin,expires:'RC-1'})`); break; }
        covered.add(r);
      }
    }
  }
  for (const r of baseline) {
    if (!rowOk(r)) continue;
    if (!byFile.has(r.file))
      reported.push(`${r.file}: baseline row is STALE — file no longer offends; delete it (owner ${r.owner}, ${r.reqFin})`);
  }
  if (reported.length) {
    for (const line of reported) console.error(line);
    console.error(`undefined-component-vars: ${reported.length} issue(s) (${covered.size} file(s) baselined until RC-1)`);
    process.exit(1);
  }
  console.log(`undefined-component-vars: clean (${files.length} files${covered.size ? `, ${covered.size} baselined` : ''})`);
};
if (process.argv[1] && process.argv[1].endsWith('undefined-component-vars.mjs')) main();
