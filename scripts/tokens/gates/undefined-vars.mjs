#!/usr/bin/env node
// MAT-050 gate undefined-vars.
// For each importable dist/css entry, resolve its @import closure (postcss parses
// the entries; closure resolution is plain fs): every var(--ag-* | --_ag-* |
// --aura-* | --glass-*) without a fallback must be defined inside the closure.
// (Legacy names are covered too — MAT-062 superset proof found the frozen 4.x
// file carries three dangling --aura-* refs; those are grandfathered below.)
// Also scans src/** for --ag-* names absent from dist/tokens/manifest.json.
// Reports {entry, var, file:line}; exit 1 on any finding.
// Supersedes scripts/ci/check-undefined-custom-props.mjs + audit-css-var-coverage.js.
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import postcss from 'postcss';
import { ROOT, rel, walkFiles, cssVarUses, cssVarDefs, importClosure, tsVarRefs, tsVarUses, tsVarDefs } from './_util.mjs';

const ENTRIES_REL = [
  'dist/css/tailwind.css',
  'dist/css/tokens.css',
  'dist/tokens.css',
  'dist/tailwind.css',
  'dist/compat/tokens.css',
  'dist/css/compat/legacy-primitives.css',
];
const DEFAULT_ENTRIES = ENTRIES_REL.filter((p) => existsSync(join(ROOT, p)));

// --dist <dir> / --src <dir> / --manifest <path> fixture overrides (MAT-053)
const arg = (n) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : undefined; };
const distRoot = arg('--dist');
const srcRoot = arg('--src');
const manifestArg = arg('--manifest');
const ENTRIES = distRoot
  ? walkFiles(distRoot, ['.css'])
  : DEFAULT_ENTRIES;

const findings = [];

for (const entry of ENTRIES) {
  const abs = distRoot ? entry : join(ROOT, entry);
  const closure = importClosure(abs);
  const defined = new Set();
  const useSites = [];
  for (const [file, text] of closure) {
    let root;
    try { root = postcss.parse(text, { from: file }); }
    catch (e) { findings.push({ entry, var: null, loc: `${rel(file)}:1`, msg: `unparseable CSS: ${e.message}` }); continue; }
    root.walkDecls((d) => {
      if (d.prop.startsWith('--')) defined.add(d.prop);
      for (const m of String(d.value).matchAll(/var\(\s*(--(?:_?ag|aura|glass)-[a-zA-Z0-9-]+)\s*(,[^)]*)?\)/g))
        useSites.push({ name: m[1], hasFallback: m[2] != null, file, line: d.source.start.line });
    });
    root.walkAtRules('custom-variant', () => {}); // variants reference attrs, not vars
  }
  // legacy-primitives.css is a byte-frozen 4.x artifact: bare refs to names
  // that were already dangling in 4.x are preserved quirks, not new bugs
  const grandfathered = [];
  for (const u of useSites) {
    if (u.hasFallback || defined.has(u.name)) continue;
    // compat/ output dir (frozen 4.x file + generated aliases) may preserve
    // 4.x dangling --aura-*/--glass-* refs — faithful freeze, not a new bug
    if (/[/\\]compat[/\\]/.test(u.file) && /^--(aura|glass)-/.test(u.name)) {
      grandfathered.push({ entry, var: u.name, loc: `${rel(u.file)}:${u.line}` });
      continue;
    }
    findings.push({ entry, var: u.name, loc: `${rel(u.file)}:${u.line}` });
  }
  for (const g of grandfathered)
    console.log(`undefined-vars: grandfathered ${g.var} at ${g.loc} (pre-existing 4.x dangling ref in frozen compat css)`);
}

// TS scan: --ag-* names in src TS/TSX absent from the manifest.
// Definitions (style-object custom-prop assignments) are collected first — they
// declare a component-level surface, not a manifest lookup. Usages (var(--ag-x)
// with a static name, or bare refs) must then resolve to a manifest var or a
// defined name. Dynamic template heads (`--ag-color-${x}`) are skipped.
const manifestPath = manifestArg ? resolve(ROOT, manifestArg) : join(ROOT, 'dist/tokens/manifest.json');
if (!existsSync(manifestPath)) {
  console.error('undefined-vars: dist/tokens/manifest.json missing — run npm run tokens:build first');
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const known = new Set(manifest.tokens.map((t) => t.cssVar));
const srcFiles = walkFiles(srcRoot ?? join(ROOT, 'src'), ['.ts', '.tsx'])
  .filter((f) => !rel(f).includes('/generated/') && !rel(f).endsWith('.generated.ts'));
const defined = new Set();
for (const f of srcFiles) for (const d of tsVarDefs(readFileSync(f, 'utf8'))) defined.add(d);
for (const f of srcFiles) {
  const r = rel(f);
  const text = readFileSync(f, 'utf8');
  const lineOf = (idx) => text.slice(0, idx).split('\n').length;
  for (const u of tsVarUses(text)) {
    if (!u.name.startsWith('--ag-')) continue; // private --_ag-* allowed (recipe names)
    if (known.has(u.name) || defined.has(u.name)) continue;
    findings.push({ entry: 'src-scan', var: u.name, loc: `${r}:${lineOf(u.index)}` });
  }
}

if (findings.length) {
  for (const f of findings) console.error(`undefined-vars: ${f.entry} ${f.var ?? ''} at ${f.loc}${f.msg ? ` — ${f.msg}` : ''}`);
  process.exit(1);
}
console.log(`undefined-vars: 0 findings across ${ENTRIES.length} entries (${ENTRIES.join(', ')})`);
