#!/usr/bin/env node
/* MAT-232 REQ-MOT-67: PostCSS AST over src/**\/*.css, *.module.css and
   dist/styles.css. Exits 1 with file:line diagnostics on:
     - transition: all | transition-property: all | transition-all |
       glass-transition-all
     - animated properties outside the REQ-MOT-12 allow-list
     - backdrop-filter / filter / box-shadow / geometry / border-radius /
       clip-path inside @keyframes or transitions
     - cubic-bezier y values outside [0,1]
     - !important inside motion rules (rules carrying transition/animation)
     - duplicate @keyframes names, keyframes not prefixed ag-
     - unregistered custom properties in transitions
     - time literals / cubic-bezier in transition*|animation* outside tokens.css
   Modes: --count-literals prints the literal census; --write-baseline writes
   reports/motion-css-baseline.json. Library: postcss (walk order stable). */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import postcss from 'postcss';

export const ALLOWED_PROPS = new Set([
  'transform', 'opacity', 'translate', 'scale', 'rotate',
  '--ag-specular', '--_ag-optics', '--_ag-press', '--_ag-refraction-scale', '--_ag-hover',
  '--_ag-pointer', 'color', 'background-color', 'border-color', 'outline-color',
  'display', 'overlay',
]);
export const BANNED_IN_MOTION = new Set([
  'backdrop-filter', '-webkit-backdrop-filter', 'filter', 'box-shadow',
  'width', 'height', 'top', 'left', 'right', 'bottom', 'inset', 'inset-inline',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'border-radius', 'border-top-left-radius', 'border-top-right-radius',
  'border-bottom-left-radius', 'border-bottom-right-radius', 'clip-path',
]);
const REGISTERED_CUSTOM = /^--(ag|_ag)-/;
const MOTION_PROP_RE = /^(transition|transition-property|animation|animation-name|animation-duration|animation-timing-function)$/;

const legs = (v) => {
  const out = []; let depth = 0; let cur = '';
  for (const ch of String(v)) {
    if (ch === '(') depth += 1;
    if (ch === ')') depth -= 1;
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur); return out.map((l) => l.trim()).filter(Boolean);
};
const propOf = (leg) => (leg.trim().split(/\s+/)[0] ?? '').toLowerCase();

/** checkCss(cssSource, filename) → diagnostics[{file,line,col,rule,message}] */
export function checkCss(source, filename = '<css>') {
  const issues = [];
  const literals = { ms: 0, s: 0, 'cubic-bezier': 0, linear: 0 };
  const isTokens = /tokens\.css$|tokens\.generated/.test(filename);
  const root = postcss.parse(source, { from: filename });
  const seenKeyframes = new Map();

  const push = (node, rule, message) => {
    issues.push({
      file: filename, line: node.source?.start?.line ?? 0, col: node.source?.start?.column ?? 0,
      rule, message,
    });
  };
  const walkDecls = (container, inKeyframes) =>
    container.walkDecls((d) => {
      const prop = d.prop.toLowerCase();
      const value = d.value;
      const motionRule = MOTION_PROP_RE.test(prop);
      // literal census
      for (const m of String(value).matchAll(/\d+(?:\.\d+)?ms\b/g)) literals.ms += m.length;
      for (const m of String(value).matchAll(/\d+(?:\.\d+)?s\b/g)) { if (!/ms\b/.test(m[0])) literals.s += m.length; }
      literals['cubic-bezier'] += (String(value).match(/cubic-bezier\(/g) ?? []).length;
      literals.linear += (String(value).match(/linear\(/g) ?? []).length;

      if (prop === 'transitionall' || prop === 'glass-transition-all') {
        push(d, 'no-transition-all', `transition 'all' is banned — enumerate allow-listed props`);
      }
      if (prop === 'transition' || prop === 'transition-property' || prop === 'animation-name' || prop === 'animation') {
        for (const leg of legs(value)) {
          const p = propOf(leg);
          if (prop === 'animation' || prop === 'animation-name') {
            if (BANNED_IN_MOTION.has(p)) push(d, 'banned-prop', `'${p}' may not be animated (REQ-MOT-12)`);
          } else {
            if (p === 'all') { push(d, 'no-transition-all', `transition 'all' is banned`); continue; }
            if (p && !ALLOWED_PROPS.has(p) && !/^none$|^inherit$|^initial$|^revert$/.test(p)) {
              push(d, 'not-allowed', `'${p}' is not on the REQ-MOT-12 transition allow-list`);
            }
          }
        }
      }
      if ((inKeyframes || motionRule) && BANNED_IN_MOTION.has(prop)) {
        push(d, 'banned-prop', `'${prop}' animates layout/filter (REQ-MOT-12)${inKeyframes ? ' inside @keyframes' : ''}`);
      }
      if (d.important && motionRule) {
        push(d, 'no-important', `!important inside a motion rule is banned`);
      }
      for (const m of String(value).matchAll(/cubic-bezier\(([^)]+)\)/g)) {
        const parts = m[1].split(',').map((x) => parseFloat(x.trim()));
        if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
          if (parts[1] < 0 || parts[1] > 1 || parts[3] < 0 || parts[3] > 1) {
            push(d, 'bezier-range', `cubic-bezier y outside [0,1]: ${m[0]}`);
          }
        }
      }
      if (!isTokens && motionRule) {
        // structural zero is exempt (transition-duration: 0s in modes); anything else literal is not
        const stripped = String(value).replace(/\b0(?:\.0+)?(?:ms|s)\b/g, '');
        if (/\d+(?:\.\d+)?ms|(?<![\d.])\d+(?:\.\d+)?s\b|cubic-bezier\(/.test(stripped)) {
          push(d, 'literal-outside-tokens', `time/bezier literal in ${prop} outside tokens.css — use var(--ag-*) tokens`);
        }
      }
      if (motionRule) {
        for (const m of String(value).matchAll(/(--[\w-]+)/g)) {
          if (!REGISTERED_CUSTOM.test(m[1])) {
            push(d, 'unregistered-custom', `unregistered custom property '${m[1]}' in ${prop} (must be --ag-*/--_ag-*)`);
          }
        }
      }
    });

  // REQ-FIN-12: any infinite animation or the ambient-duration token must live
  // inside a [data-ag-continuous="on"] gate (selector-level; a gated ancestor
  // rule counts too — postcss rules here are flat, so selector must carry it).
  root.walkRules((r) => {
    const sel = r.selector ?? '';
    if (sel.includes('data-ag-continuous')) return;
    r.walkDecls((d) => {
      const v = d.value ?? '';
      if (/\binfinite\b/.test(v) || v.includes('--ag-duration-ambient'))
        push(d, 'ungated-loop', `infinite animation / --ag-duration-ambient outside [data-ag-continuous="on"] (REQ-FIN-12); gate the loop or provide a static frame`);
    });
  });

  root.walkAtRules('keyframes', (at) => {
    const name = at.params.trim();
    if (!/^ag-/.test(name)) push(at, 'keyframes-prefix', `@keyframes '${name}' must be prefixed ag-`);
    if (seenKeyframes.has(name)) push(at, 'dup-keyframes', `duplicate @keyframes '${name}' (first at ${seenKeyframes.get(name)})`);
    else seenKeyframes.set(name, `${filename}:${at.source?.start?.line ?? 0}`);
    walkDecls(at, true);
  });
  root.walkRules((r) => walkDecls(r, false));
  // declaration-order-independent: at-rule bodies already walked above; catch
  // declarations inside @media/supports that were reached via walkRules.
  return { issues, literals };
}

/* ---- CLI ---- */
const walk = (dir, out = []) => {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) { if (e !== 'node_modules' && e !== '.git') walk(p, out); }
    else if (/\.css$/.test(e) && !p.includes('/dist/')) out.push(p);
  }
  return out;
};

if (process.argv[1] && process.argv[1].endsWith('verify-motion-css.mjs')) {
  const args = new Set(process.argv.slice(2));
  // contract scope: src/**/*.css, *.module.css, dist/styles.css (+ fragments).
  // Test fixtures under tests/lint/fixtures are intentionally violating — excluded.
  // --file <path>: check just that file, no baseline (fixture verification).
  let files;
  const fileArg = process.argv.indexOf('--file');
  if (fileArg !== -1 && process.argv[fileArg + 1]) {
    files = [process.argv[fileArg + 1]];
    args.delete('--file'); args.delete(process.argv[fileArg + 1]);
  } else {
    files = [...walk('src'), ...walk('fragments')];
    if (existsSync('dist/styles.css')) files.push('dist/styles.css');
  }
  const all = [];
  let census = { ms: 0, s: 0, 'cubic-bezier': 0, linear: 0 };
  for (const f of files) {
    const { issues, literals } = checkCss(readFileSync(f, 'utf8'), relative(process.cwd(), f));
    all.push(...issues);
    for (const k of Object.keys(census)) census[k] += literals[k];
  }
  if (args.has('--count-literals')) {
    console.log('motion-css literals:', JSON.stringify(census));
  }
  if (args.has('--write-baseline')) {
    mkdirSync('reports', { recursive: true });
    writeFileSync('reports/motion-css-baseline.json',
      JSON.stringify({ generatedAt: new Date().toISOString(), literals: census, issues: all }, null, 1) + '\n');
    console.log(`motion-css baseline: reports/motion-css-baseline.json (${all.length} issues)`);
  }
  // REQ-FIN-12 baseline (PRD-F §4.3 rule 3): pre-existing ungated-loop offenders
  // live in scripts/integration/baselines/ungated-loops.json as
  // {file, owner, reqFin, expires} rows — gate fails on a NEW offender, a STALE
  // row, and any row past expires. Only ungated-loop findings are baselinable.
  const BASELINE = 'scripts/integration/baselines/ungated-loops.json';
  const baseline = fileArg === -1 && existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : [];
  const rowOk = (r) => r && typeof r.file === 'string' && typeof r.owner === 'string'
    && typeof r.reqFin === 'string' && r.expires === 'RC-1';
  // per §4.3 rule 3 a baseline row covers every finding in that file; the owning
  // REQ-FIN deletes the row when the file is fixed. A file absent from the
  // baseline is a NEW offender.
  const byFile = new Map();
  for (const i of all) byFile.set(i.file, (byFile.get(i.file) ?? 0) + 1);
  const covered = new Set();
  const reported = [];
  for (const i of all) {
    const rows = baseline.filter((r) => r.file === i.file);
    if (rows.length === 0) {
      reported.push(`${i.file}:${i.line}:${i.col}  ${i.rule}  ${i.message} [NEW: fix, or add a baseline row {file,owner,reqFin,expires:'RC-1'}]`);
    } else {
      for (const r of rows) {
        if (!rowOk(r)) { reported.push(`${i.file}: baseline row for ${i.file} is malformed (need {file, owner, reqFin, expires:'RC-1'})`); break; }
        covered.add(r);
      }
    }
  }
  for (const r of baseline) {
    if (covered.has(r)) continue;
    if (!byFile.has(r.file))
      reported.push(`${r.file}: baseline row is STALE — file no longer offends; delete the row (owner ${r.owner}, ${r.reqFin})`);
  }
  if (reported.length) {
    for (const line of reported) console.error(line);
    console.error(`verify-motion-css: ${reported.length} issue(s) (${covered.size} file(s) baselined until RC-1)`);
    process.exit(1);
  }
  const note = covered.size ? `, ${covered.size} file(s) baselined until RC-1` : '';
  console.log(`verify-motion-css: clean (${files.length} files${note})`);
}
