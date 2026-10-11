#!/usr/bin/env node
// MAT-050 gate undefined-vars (REQ-MAT-17, REQ-FIN-53).
// Entries:
//   1. the dist token css entries (dist/tokens.css, dist/css/tokens.css, the
//      tailwind bridges, dist/compat/tokens.css, the frozen legacy-primitives.css),
//      each resolved through its relative @import closure;
//   2. every css bundle that carries a MAT row in fragments/css (loadFragments('css')):
//      the bundle's closure is every fragment row of that bundle (all streams, as
//      scripts/build/lib/css.mjs assembles it), plus the ag.material generated
//      supplements styles.css inlines, plus dist/tokens.css (the token layer every
//      bundle sits on), each with its @import closure.
// Every var(--ag-* | --_ag-* | --aura-* | --glass-*) without a fallback must be
// declared (or @property-registered) inside the entry's closure. `initial`
// reservations (the MAT-003 privates registry) define nothing and do not count.
// Also scans src/** TS/TSX for static var(--ag-*) names absent from
// dist/tokens/manifest.json and from component style-object definitions.
// Each finding is attributed to the stream owning the file it sits in
// (contracts/ownership.json): non-MAT findings print `pre-existing (<stream>)`;
// the gate exits 1 only on MAT findings.
// Fixture overrides (MAT-053): --dist <dir> (entries = every css file under it;
// no fragment bundles unless --fragments <root>), --src <dir>, --manifest <path>,
// --fragments <root> (repo-like root holding fragments/css/*), --tokens-css <path>
// (the token layer of each bundle closure; default <root>/dist/tokens.css).
// Grandfathered frozen
// 4.x refs are always printed (the MAT-062 superset proof reads them).
// Supersedes scripts/ci/check-undefined-custom-props.mjs + audit-css-var-coverage.js.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { loadFragments } from '../../../src/contracts/load-fragments.mjs';
import {
  ROOT, rel, walkFiles, importClosure, scanCss, streamOf, reportByStream, tsVarUses, tsVarDefs,
} from './_util.mjs';

const TOKEN_ENTRIES_REL = [
  'dist/css/tailwind.css',
  'dist/css/tokens.css',
  'dist/tokens.css',
  'dist/tailwind.css',
  'dist/compat/tokens.css',
  'dist/css/compat/legacy-primitives.css',
];
const VAR_RE = /^--(?:_?ag|aura|glass)-/;

const arg = (n) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : undefined; };
const distRoot = arg('--dist');
const srcRoot = arg('--src');
const manifestArg = arg('--manifest');
const fragmentsArg = arg('--fragments');
const fragRoot = fragmentsArg ? resolve(ROOT, fragmentsArg) : distRoot ? null : ROOT;
// paths inside a fixture root are attributed as if they sat at the repo root
const relTo = (base) => (p) => relative(base, p).replace(/\\/g, '/');
const relFrag = fragRoot ? relTo(fragRoot) : rel;

const findings = [];
const grandfathered = [];

/** Check one closure (Map<file, text>) and push findings tagged with `entry`. */
function checkClosure(entry, closure, relOf) {
  const defined = new Set();
  const useSites = [];
  for (const [file, text] of closure) {
    const r = relOf(file);
    const scan = scanCss(text, file);
    if (scan.parseError) {
      findings.push({ entry, var: null, loc: `${r}:1`, stream: streamOf(r), msg: `unparseable CSS: ${scan.parseError}` });
    }
    for (const d of scan.defs) defined.add(d.name);
    for (const p of scan.properties) defined.add(p);
    for (const u of scan.uses) if (VAR_RE.test(u.name)) useSites.push({ ...u, file: r });
    // a relative @import whose target is absent truncates the closure — say so
    // instead of reporting every var it would have defined
    for (const m of text.matchAll(/@import\s+(?:url\()?['"](\.[^'"]+)['"]\)?/g)) {
      if (!existsSync(join(dirname(file), m[1])))
        findings.push({ entry, var: null, loc: r, stream: streamOf(r), msg: `@import '${m[1]}' target missing (closure incomplete — run npm run tokens:build first)` });
    }
  }
  for (const u of useSites) {
    if (u.hasFallback || defined.has(u.name)) continue;
    // compat/ output (frozen 4.x file + generated aliases) preserves the 4.x
    // dangling --aura-*/--glass-* refs byte-for-byte — faithful freeze, not a new bug
    if (/(^|\/)compat\//.test(u.file) && /^--(aura|glass)-/.test(u.name)) {
      grandfathered.push({ entry, var: u.name, loc: `${u.file}:${u.line}` });
      continue;
    }
    findings.push({ entry, var: u.name, loc: `${u.file}:${u.line}`, stream: streamOf(u.file) });
  }
}

// 1. dist token entries (or every css file under --dist)
const tokenEntries = distRoot
  ? walkFiles(resolve(ROOT, distRoot), ['.css'])
  : TOKEN_ENTRIES_REL.map((p) => join(ROOT, p)).filter((p) => existsSync(p));
for (const abs of tokenEntries) checkClosure(rel(abs), importClosure(abs), rel);

// 2. fragment bundles that carry MAT rows
const bundleNames = [];
if (fragRoot) {
  const frags = await loadFragments('css', fragRoot);
  const bundles = new Map();
  for (const { stream, value } of frags) {
    for (const row of value ?? []) {
      if (!bundles.has(row.bundle)) bundles.set(row.bundle, { rows: [], mat: false });
      const b = bundles.get(row.bundle);
      b.rows.push({ ...row, stream });
      if (stream === 'mat') b.mat = true;
    }
  }
  const tokensCss = arg('--tokens-css') ? resolve(ROOT, arg('--tokens-css')) : join(fragRoot, 'dist/tokens.css');
  const generatedDir = join(fragRoot, 'src/material/css/generated');
  for (const [name, b] of [...bundles].sort(([a], [z]) => a.localeCompare(z))) {
    if (!b.mat) continue;
    bundleNames.push(name);
    const closure = new Map();
    for (const row of b.rows) {
      const abs = join(fragRoot, row.file);
      if (!existsSync(abs)) {
        findings.push({ entry: name, var: null, loc: row.file, stream: row.stream, msg: 'css fragment file missing' });
        continue;
      }
      importClosure(abs, closure);
    }
    // styles.css inlines the ag.material generated css (scripts/build/lib/css.mjs layerSupplements)
    if (name === 'styles.css' && existsSync(generatedDir)) {
      for (const n of readdirSync(generatedDir).sort()) if (n.endsWith('.css')) importClosure(join(generatedDir, n), closure);
    }
    if (existsSync(tokensCss)) importClosure(tokensCss, closure);
    else findings.push({ entry: name, var: null, loc: 'dist/tokens.css', stream: streamOf('dist/tokens.css'), msg: 'token layer missing — run npm run tokens:build first' });
    checkClosure(`bundle:${name}`, closure, relFrag);
  }
}

// 3. TS scan: --ag-* names in src TS/TSX absent from the manifest.
// Definitions (style-object custom-prop assignments) are collected first — they
// declare a component-level surface, not a manifest lookup. Usages (var(--ag-x)
// with a static name) must then resolve to a manifest var or a defined name.
// Dynamic template heads (`--ag-color-${x}`) are skipped.
const manifestPath = manifestArg ? resolve(ROOT, manifestArg) : join(ROOT, 'dist/tokens/manifest.json');
if (!existsSync(manifestPath)) {
  console.error('undefined-vars: dist/tokens/manifest.json missing — run npm run tokens:build first');
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const known = new Set(manifest.tokens.map((t) => t.cssVar));
const srcBase = srcRoot ? resolve(ROOT, srcRoot) : join(ROOT, 'src');
const srcFiles = walkFiles(srcBase, ['.ts', '.tsx'])
  .filter((f) => !rel(f).includes('/generated/') && !rel(f).endsWith('.generated.ts'));
const tsDefined = new Set();
for (const f of srcFiles) for (const d of tsVarDefs(readFileSync(f, 'utf8'))) tsDefined.add(d);
for (const f of srcFiles) {
  const r = rel(f);
  const text = readFileSync(f, 'utf8');
  const lineOf = (idx) => text.slice(0, idx).split('\n').length;
  for (const u of tsVarUses(text)) {
    if (!u.name.startsWith('--ag-')) continue; // private --_ag-* reads are covered by the css closures
    if (known.has(u.name) || tsDefined.has(u.name)) continue;
    findings.push({ entry: 'src-scan', var: u.name, loc: `${r}:${lineOf(u.index)}`, stream: streamOf(r) });
  }
}

for (const g of grandfathered)
  console.log(`undefined-vars: grandfathered ${g.var} at ${g.loc} (pre-existing 4.x dangling ref in frozen compat css)`);
const { mat, other } = reportByStream('undefined-vars', findings,
  (f) => `${f.entry} ${f.var ?? ''} at ${f.loc}${f.msg ? ` — ${f.msg}` : ''}`.replace(/\s+/g, ' '));
const summary = `${tokenEntries.length} token entries, ${bundleNames.length} MAT bundles (${bundleNames.join(', ') || 'none'})`;
if (mat.length) {
  console.error(`undefined-vars: ${mat.length} MAT finding(s), ${other.length} pre-existing in other streams, across ${summary}`);
  process.exit(1);
}
console.log(`undefined-vars: 0 MAT findings (${other.length} pre-existing in other streams) across ${summary}`);
