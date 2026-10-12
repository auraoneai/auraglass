#!/usr/bin/env node
/* REQ-MAT-61 (L1, pr + main, failClosed): src/a11y/css/focus.css is the only
   focus implementation in the library.
   Over every src/** css file other than src/a11y/css/focus.css it fails on:
     focus-indicator  — a rule keyed on a focus state (:focus, :focus-visible,
                        :focus-within, [data-focused], [data-focus-visible])
                        that declares an indicator property (outline*,
                        box-shadow). Reveal-on-focus rules (skip links,
                        visually-hidden, hover/focus-revealed chrome) only
                        change position/clip/opacity and stay allowed.
     outline-removal  — outline: none|0, outline-style: none or
                        outline-width: 0 in any rule (rest state included):
                        the ring must never be suppressed outside its owner.
   And over src/** ts/tsx/js/jsx (tests, stories excluded):
     tailwind-outline-none — focus:outline-none / focus-visible:outline-none;
     inline-outline-removal — an inline style object setting outline to
                        'none' / 0 (style={{ outline: 'none' }}).
   Usage: node scripts/mat/verify-focus-single-owner.mjs [--src <dir>]
   (--src scans a fixture tree instead of ./src). Exit 1 on any finding. */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import postcss from 'postcss';

const OWNER = 'src/a11y/css/focus.css';
const FOCUS_STATE = /:focus(?:-visible|-within)?\b|\[data-focused\]|\[data-focus-visible\]/;
const INDICATOR = /^(?:outline(?:-[a-z]+)?|box-shadow)$/i;
const SHIPPED_JS = /\.(?:tsx?|jsx?)$/;
const NOT_SHIPPED = /(?:__tests__|\.test\.|\.spec\.|\.stories\.|\/stories\/|__fixtures__)/;

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const isRemoval = (prop, value) => {
  const v = value.trim().toLowerCase();
  if (prop === 'outline') return /^(?:none|0(?:px)?)(?:\s|$)/.test(v);
  if (prop === 'outline-style') return v === 'none';
  if (prop === 'outline-width') return /^0(?:px)?$/.test(v);
  return false;
};

/** Findings for one css source. `rel` is the repo-relative path. */
export function scanCss(css, rel) {
  const out = [];
  if (rel === OWNER) return out;
  postcss.parse(css, { from: rel }).walkDecls((d) => {
    const rule = d.parent;
    if (!rule || rule.type !== 'rule') return;
    const prop = d.prop.toLowerCase();
    const line = d.source?.start?.line ?? 0;
    if (isRemoval(prop, d.value)) {
      out.push({ rule: 'outline-removal', file: rel, line, detail: `${rule.selector.replace(/\s+/g, ' ')} { ${prop}: ${d.value} }` });
      return;
    }
    if (INDICATOR.test(prop) && rule.selectors.some((s) => FOCUS_STATE.test(s))) {
      out.push({ rule: 'focus-indicator', file: rel, line, detail: `${rule.selector.replace(/\s+/g, ' ')} { ${prop}: ${d.value} }` });
    }
  });
  return out;
}

/** Findings for one shipped js/ts source. */
export function scanJs(text, rel) {
  const out = [];
  text.split('\n').forEach((l, i) => {
    if (/(?:^|[\s'"`])focus(?:-visible)?:outline-none(?=[\s'"`]|$)/.test(l)) {
      out.push({ rule: 'tailwind-outline-none', file: rel, line: i + 1, detail: l.trim().slice(0, 120) });
    }
    if (/\boutline(?:Style)?\s*:\s*(?:['"](?:none|0(?:px)?)['"]|0\b)/.test(l)) {
      out.push({ rule: 'inline-outline-removal', file: rel, line: i + 1, detail: l.trim().slice(0, 120) });
    }
  });
  return out;
}

/** Scan a tree; `root` is the repo root, `srcDir` the tree to scan (default <root>/src). */
export function verifyFocusSingleOwner(root = process.cwd(), srcDir = path.join(root, 'src')) {
  const findings = [];
  for (const f of walk(srcDir)) {
    const rel = path.relative(root, f).split(path.sep).join('/');
    if (f.endsWith('.css')) findings.push(...scanCss(fs.readFileSync(f, 'utf8'), rel));
    else if (SHIPPED_JS.test(f) && !NOT_SHIPPED.test(rel)) findings.push(...scanJs(fs.readFileSync(f, 'utf8'), rel));
  }
  return findings;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) {
  const i = process.argv.indexOf('--src');
  const root = process.cwd();
  const findings = verifyFocusSingleOwner(root, i >= 0 ? path.resolve(process.argv[i + 1]) : undefined);
  for (const f of findings) console.error(`${f.file}:${f.line} ${f.rule} ${f.detail}`);
  if (findings.length) {
    console.error(`focus single owner: ${findings.length} finding(s); the ring lives only in ${OWNER} (REQ-MAT-61)`);
    process.exit(1);
  }
  console.log(`focus single owner: ok (${OWNER} is the only focus implementation)`);
}
