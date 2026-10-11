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
     - REQ-FIN-12 `ungated-loop`: `infinite` or --ag-duration-ambient outside
       [data-ag-continuous="on"] (expiring baseline:
       scripts/integration/baselines/ungated-loops.json)
     - `css-parse`: a stylesheet that does not parse (never baselinable)
   Modes: --count-literals prints the literal census; --write-baseline writes
   reports/motion-css-baseline.json; --gate ungated-loop reports only the
   REQ-FIN-12 gate; --file <path> / --baseline <path> check one file.
   Library: postcss (walk order stable). */
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

const GATE_RE = /\[\s*data-ag-continuous\s*=\s*(?:"on"|'on'|on)\s*\]/;
/** Drop every :not(...) group (balanced parens) so a negated gate never counts. */
const stripNot = (sel) => {
  let out = ''; let i = 0;
  while (i < sel.length) {
    if (sel.startsWith(':not(', i)) {
      let depth = 0; let j = i + 4;
      for (; j < sel.length; j += 1) {
        if (sel[j] === '(') depth += 1;
        else if (sel[j] === ')') { depth -= 1; if (depth === 0) break; }
      }
      i = j + 1;
    } else { out += sel[i]; i += 1; }
  }
  return out;
};
export const selectorGated = (sel) => GATE_RE.test(stripNot(String(sel)));
const ruleGated = (rule) => {
  for (let n = rule; n; n = n.parent) {
    if (n.type === 'rule' && (n.selectors ?? [n.selector]).every(selectorGated)) return true;
  }
  return false;
};
const insideKeyframes = (node) => {
  for (let n = node.parent; n; n = n.parent) {
    if (n.type === 'atrule' && /keyframes$/i.test(n.name)) return true;
  }
  return false;
};

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
  // under a [data-ag-continuous="on"] gate. A rule is gated when every one of
  // its selectors carries the gate outside :not(), or when a (nesting) ancestor
  // rule is gated. Only the rule's own declarations are checked, so nested
  // rules are reported once, against their own gate.
  root.walkRules((r) => {
    if (insideKeyframes(r) || ruleGated(r)) return;
    for (const d of r.nodes ?? []) {
      if (d.type !== 'decl') continue;
      const v = String(d.value ?? '');
      if (/\binfinite\b/i.test(v) || v.includes('--ag-duration-ambient'))
        push(d, 'ungated-loop', `infinite animation / --ag-duration-ambient outside [data-ag-continuous="on"] (REQ-FIN-12); gate the loop or provide a static frame`);
    }
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

/* REQ-FIN-12 baseline (PRD-F §4.3 rule 3). Pre-existing ungated-loop offenders
   live in scripts/integration/baselines/ungated-loops.json as
   {file, owner, reqFin, expires: 'RC-1'} rows. Only `ungated-loop` findings are
   baselinable; every other rule (and a CSS parse error) always fails. The gate
   fails on a NEW offending file, a STALE row (its file no longer has an
   ungated loop), a malformed row, and on every row once the package version
   has reached RC-1 (5.x `-rc.N` or a final release). */
export const DEFAULT_BASELINE = 'scripts/integration/baselines/ungated-loops.json';
export const BASELINE_RULE = 'ungated-loop';
export const rcReached = (version) => {
  const m = /^(\d+)\.\d+\.\d+(?:-([0-9A-Za-z.-]+))?$/.exec(String(version ?? ''));
  if (!m) return false;
  if (Number(m[1]) < 5) return false;
  return m[2] === undefined || /^rc\./.test(m[2]);
};
const rowOk = (r) => r && typeof r.file === 'string' && typeof r.owner === 'string'
  && typeof r.reqFin === 'string' && r.expires === 'RC-1';

/** applyBaseline(issues, baseline, {checkedFiles, version}) -> report lines (empty = pass) */
export function applyBaseline(issues, baseline, { checkedFiles, version } = {}) {
  const reported = [];
  const rows = Array.isArray(baseline) ? baseline : [];
  const loopFiles = new Set(issues.filter((i) => i.rule === BASELINE_RULE).map((i) => i.file));
  const expired = rcReached(version);
  const rowsByFile = new Map();
  for (const r of rows) {
    if (!rowOk(r)) { reported.push(`${r?.file ?? '<row>'}: baseline row is malformed (need {file, owner, reqFin, expires:'RC-1'})`); continue; }
    rowsByFile.set(r.file, r);
  }
  for (const i of issues) {
    const row = i.rule === BASELINE_RULE ? rowsByFile.get(i.file) : undefined;
    if (row && !expired) continue;
    const hint = i.rule !== BASELINE_RULE ? ''
      : row ? ` [EXPIRED: baseline row (owner ${row.owner}, ${row.reqFin}) expired at RC-1 (version ${version}); fix the file]`
      : ` [NEW: fix, or add a baseline row {file,owner,reqFin,expires:'RC-1'}]`;
    reported.push(`${i.file}:${i.line}:${i.col}  ${i.rule}  ${i.message}${hint}`);
  }
  const checked = checkedFiles ? new Set(checkedFiles) : null;
  for (const [file, r] of rowsByFile) {
    if (checked && !checked.has(file)) {
      if (!existsSync(file)) reported.push(`${file}: baseline row is STALE — file does not exist; delete the row (owner ${r.owner}, ${r.reqFin})`);
      continue;
    }
    if (!loopFiles.has(file))
      reported.push(`${file}: baseline row is STALE — file no longer offends; delete the row (owner ${r.owner}, ${r.reqFin})`);
  }
  return reported;
}

const argValue = (argv, flag) => {
  const i = argv.indexOf(flag);
  return i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : undefined;
};

if (process.argv[1] && process.argv[1].endsWith('verify-motion-css.mjs')) {
  const argv = process.argv.slice(2);
  const args = new Set(argv);
  // contract scope: src/**/*.css, *.module.css, dist/styles.css (+ fragments).
  // Test fixtures under tests/lint/fixtures are intentionally violating — excluded.
  // --file <path>: check just that file; no baseline unless --baseline is given.
  // --baseline <path>: baseline to apply (default: DEFAULT_BASELINE on a full run).
  // --gate ungated-loop: report only the REQ-FIN-12 loop gate (plus CSS parse
  // errors, which block every rule). Without it every REQ-MOT-67 rule reports.
  const gate = argValue(argv, '--gate');
  if (gate !== undefined && gate !== BASELINE_RULE) {
    console.error(`verify-motion-css: unknown --gate '${gate}' (supported: ${BASELINE_RULE})`);
    process.exit(2);
  }
  const fileArg = argValue(argv, '--file');
  const files = fileArg ? [fileArg] : [...walk('src'), ...walk('fragments')];
  if (!fileArg && existsSync('dist/styles.css')) files.push('dist/styles.css');
  const baselinePath = argValue(argv, '--baseline') ?? (fileArg ? undefined : DEFAULT_BASELINE);
  const all = [];
  let census = { ms: 0, s: 0, 'cubic-bezier': 0, linear: 0 };
  const checkedFiles = [];
  for (const f of files) {
    const rel = relative(process.cwd(), f);
    checkedFiles.push(rel);
    try {
      const { issues, literals } = checkCss(readFileSync(f, 'utf8'), rel);
      all.push(...issues);
      for (const k of Object.keys(census)) census[k] += literals[k];
    } catch (e) {
      if (e?.name !== 'CssSyntaxError') throw e;
      // a stylesheet that does not parse cannot be verified: never baselinable
      all.push({ file: rel, line: e.line ?? 0, col: e.column ?? 0, rule: 'css-parse', message: `CSS does not parse: ${e.reason ?? e.message}` });
    }
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
  const baseline = baselinePath ? JSON.parse(readFileSync(baselinePath, 'utf8')) : [];
  const version = process.env.AG_VERSION
    ?? (existsSync('package.json') ? JSON.parse(readFileSync('package.json', 'utf8')).version : undefined);
  const scoped = gate ? all.filter((i) => i.rule === BASELINE_RULE || i.rule === 'css-parse') : all;
  const reported = applyBaseline(scoped, baseline, { checkedFiles: fileArg ? checkedFiles : null, version });
  const baselined = new Set(all.filter((i) => i.rule === BASELINE_RULE && baseline.some((r) => r?.file === i.file)).map((i) => i.file)).size;
  if (reported.length) {
    for (const line of reported) console.error(line);
    console.error(`verify-motion-css: ${reported.length} issue(s) (${baselined} file(s) baselined until RC-1)`);
    process.exit(1);
  }
  const note = baselined ? `, ${baselined} file(s) baselined until RC-1` : '';
  console.log(`verify-motion-css${gate ? ` --gate ${gate}` : ''}: clean (${files.length} files${note})`);
}
