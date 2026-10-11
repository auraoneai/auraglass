#!/usr/bin/env node
/* verify-foundation-pattern (CMP-020/021, REQ-CMP-05/08). Prints `file:line rule`
   for each violation; exit 1 when a ratcheted check exceeds its baseline or a
   strict check has any hit.
   Checks:
     (a) asChild usage outside src/compat/** — TypeScript compiler API on JSX
         attributes and exported *Props types (ratcheted by baseline json)
     (b) imports of primitives/focus/{FocusTrap,ScreenReader,SkipLinks} and the
         7 legacy alias shim directories (ratcheted, strict after FND-042)
     (c) /\.(skip|todo|fixme)\(|\bxit\(|expect\(true\)/ in test files (strict)
     (d) !important inside .css files in directories containing a *.meta.ts
         (strict, CMP-020)
     (e) @base-ui/react imports outside *.client.tsx / src/foundation/** (strict)
   Usage: node scripts/cmp/verify-foundation-pattern.mjs [--root DIR] [--baseline FILE]
*/
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import ts from 'typescript';

const argv = process.argv.slice(2);
function argValue(flag, dflt) {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : dflt;
}
const ROOT = path.resolve(argValue('--root', process.cwd()));
const BASELINE_FILE = path.resolve(argValue('--baseline', path.join(ROOT, 'scripts/cmp/foundation-pattern-baseline.json')));

const SHIM_PREFIXES = [
  'primitives/slot/',
  'primitives/portal/',
  'primitives/label/',
  'primitives/dismissable-layer/',
  'primitives/positioning/',
  'primitives/roving-focus/',
  'primitives/glass/',
];
const FOCUS_SHIMS = /primitives\/focus\/(FocusTrap|ScreenReader|SkipLinks)/;
const NO_SKIP_RE = /\.(skip|todo|fixme)\(|\bxit\(|expect\(true\)/;
const BASE_UI_RE = /^@base-ui\/react(\/|$)/;

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'storybook-static', 'coverage', '.artifacts', 'legacy']);

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || SKIP_DIRS.has(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const isFixture = (r) => /(^|\/)fixtures\//.test(r);
const isCompat = (r) => r.startsWith('src/compat/');
const isTs = (r) => /\.(tsx?|mts|cts)$/.test(r);
const isTsx = (r) => /\.(tsx|jsx)$/.test(r);
const isTest = (r) => /\.test\.[cm]?[jt]sx?$/.test(r) || r.startsWith('tests/');
const inFoundation = (r) => r.startsWith('src/foundation/');
const isClient = (r) => r.endsWith('.client.tsx') || r.endsWith('.client.jsx');

function lineOf(text, pos) {
  let n = 1;
  for (let i = 0; i < pos; i++) if (text.charCodeAt(i) === 10) n++;
  return n;
}

const violations = [];
const counts = { asChild: new Map(), shimImport: new Map() };
const bump = (map, r) => map.set(r, (map.get(r) ?? 0) + 1);

function checkAsChild(file) {
  const r = rel(file);
  if (!isTs(r) || isCompat(r) || isTest(r) || isFixture(r)) return;
  const text = fs.readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, r.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const visit = (node) => {
    if (ts.isJsxAttribute(node) && node.name.text === 'asChild') {
      bump(counts.asChild, r);
      violations.push(`${r}:${lineOf(text, node.getStart(sf))} no-asChild (JSX attribute outside src/compat/**)`);
    }
    if ((ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && /Props$/.test(node.name.text)) {
      const mods = ts.canHaveModifiers?.(node) ? ts.getModifiers?.(node) : null;
      const exported = node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ||
        (node.parent?.kind === ts.SyntaxKind.ModuleBlock);
      void mods;
      if (exported) {
        const members = ts.isInterfaceDeclaration(node) ? node.members :
          (ts.isTypeLiteralNode(node.type) ? node.type.members : null);
        if (members) {
          for (const m of members) {
            if (m.name && ts.isIdentifier(m.name) && m.name.text === 'asChild') {
              bump(counts.asChild, r);
              violations.push(`${r}:${lineOf(text, m.getStart(sf))} no-asChild (exported ${node.name.text} member)`);
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

function checkImports(file) {
  const r = rel(file);
  if (!/\.(tsx?|jsx?|mjs|cjs|mts|cts)$/.test(r) || isFixture(r)) return;
  const text = fs.readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const visit = (node) => {
    let spec = null;
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      spec = node.moduleSpecifier.text;
    } else if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'require' &&
      node.arguments.length === 1 && ts.isStringLiteral(node.arguments[0])) {
      spec = node.arguments[0].text;
    }
    if (spec !== null) {
      const s = spec.replace(/\\/g, '/');
      if (FOCUS_SHIMS.test(s) || SHIM_PREFIXES.some((p) => s.includes(p) || s.endsWith(p.slice(0, -1)))) {
        bump(counts.shimImport, r);
        violations.push(`${r}:${lineOf(text, node.getStart(sf))} no-legacy-shim-import (${s})`);
      }
      if (isTs(r) && !isTest(r) && BASE_UI_RE.test(s) && !isClient(r) && !inFoundation(r)) {
        violations.push(`${r}:${lineOf(text, node.getStart(sf))} base-ui-outside-client (import '${s}' only allowed in *.client.tsx or src/foundation/**)`);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

function checkNoSkip(file) {
  const r = rel(file);
  if (!isTest(r) || isFixture(r)) return;
  const text = fs.readFileSync(file, 'utf8');
  const re = new RegExp(NO_SKIP_RE.source, 'g');
  let m;
  while ((m = re.exec(text))) {
    violations.push(`${r}:${lineOf(text, m.index)} no-skip-todo-fixme (${m[0]})`);
  }
}

function checkImportant(file, hasMetaDir) {
  const r = rel(file);
  if (!r.endsWith('.css') || !hasMetaDir || isFixture(r)) return;
  const text = fs.readFileSync(file, 'utf8');
  const re = /!important/g;
  let m;
  while ((m = re.exec(text))) {
    violations.push(`${r}:${lineOf(text, m.index)} no-important (css in meta dir)`);
  }
}

const metaDirs = new Set();
for (const f of walk(path.join(ROOT, 'src'))) {
  if (f.endsWith('.meta.ts')) metaDirs.add(path.dirname(f));
}
const SCAN_ROOTS = ['src', 'tests', 'stories', 'apps', 'lint', 'fragments', 'registry'];
for (const top of SCAN_ROOTS) {
  for (const f of walk(path.join(ROOT, top))) {
    checkAsChild(f);
    checkImports(f);
    checkNoSkip(f);
    checkImportant(f, metaDirs.has(path.dirname(f)));
  }
}

let baseline = { checks: {} };
if (fs.existsSync(BASELINE_FILE)) {
  baseline = JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8'));
}
const baselineFor = (key) => baseline.checks?.[key] ?? {};
let over = 0;
for (const [key, map] of [['asChild', counts.asChild], ['shimImport', counts.shimImport]]) {
  const bl = baselineFor(key);
  for (const [r, n] of map) {
    const allowed = bl[r] ?? 0;
    if (n > allowed) {
      over += n - allowed;
      console.log(`ratchet ${key}: ${r} has ${n} > baseline ${allowed}`);
    }
  }
}
for (const v of violations) console.log(v);
if (over > 0 || violations.length > 0) {
  const strictHits = violations.length - [...counts.asChild.values()].reduce((a, b) => a + b, 0) - [...counts.shimImport.values()].reduce((a, b) => a + b, 0);
  if (strictHits > 0 || over > 0) {
    console.error(`verify-foundation-pattern: ${strictHits} strict violation(s), ${over} over-baseline`);
    process.exit(1);
  }
}
console.log('verify-foundation-pattern: OK');
