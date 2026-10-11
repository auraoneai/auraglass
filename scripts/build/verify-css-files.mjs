#!/usr/bin/env node
/* REQ-FIN-14 (MAT-19 + CMP-09): every css file under src/ and every
   fragments/css/<stream>.ts row must satisfy the layer contract:

     1. line 1 is exactly LAYER_ORDER_STATEMENT (single source:
        src/contracts/tokens.ts) — comments come after it.
     2. the file contains exactly one @layer <name> BLOCK and that name equals
        its fragment row's layer (files with no fragment row still need
        line 1 + a single canonical @layer name; @layer <a, b, ...>
        statement lines don't count as blocks).
     3. no @layer media / @layer backdrops (never canonical layer names).
     4. no double inclusion: the same file in two fragment rows, or a
        registered file that is also @import-ed by another registered file.
     5. no !important.
     6. no :root selector outside ag.tokens / ag.compat rows.
     7. every fragment row's file exists on disk.
     8. every src css file ships: it has a fragment row or is @import-ed by a
        file that has one (unregistered files never reach a bundle).

   Current offenders outside FIN-A's files are carried in
   scripts/integration/baselines/css-files.json ({file, owner, reqFin,
   expires}). A violation on a non-baselined file fails; a baselined violation
   prints as BASELINED and passes; a stale baseline row (no longer offending),
   a malformed row, or an expired row fails — owners delete their rows in the
   same PR that fixes the file (PRD-F §4.3 rule 3).

   Usage: node scripts/build/verify-css-files.mjs [--write-baseline]
   (run with cwd = the repo, or a fixture mini-repo)
*/
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { rowProblems } from '../integration/lib/baseline-expiry.mjs';

const ROOT = process.cwd();
const BASELINE = 'scripts/integration/baselines/css-files.json';
const WRITE_BASELINE = process.argv.includes('--write-baseline');

const CANONICAL_LAYERS = new Set(['ag.compat', 'ag.reset', 'ag.tokens', 'ag.material', 'ag.components', 'ag.a11y']);
const BANNED_LAYERS = /^\s*(media|backdrops)\s*$/;
const ROOT_ALLOWED = new Set(['ag.tokens', 'ag.compat']);

/* LAYER_ORDER_STATEMENT, read from the contract so the gate and the contract
   never drift. */
const tokensSrc = fs.readFileSync(path.join(ROOT, 'src/contracts/tokens.ts'), 'utf8');
const stmtMatch = tokensSrc.match(/LAYER_ORDER_STATEMENT\s*=\s*'([^']+)'/);
if (!stmtMatch) { console.error('verify-css-files: could not read LAYER_ORDER_STATEMENT from src/contracts/tokens.ts'); process.exit(2); }
const LAYER_ORDER_STATEMENT = stmtMatch[1];

/* fragment rows from fragments/css/<stream>.ts — simple object literals. */
const ROW_RE = /\{\s*file:\s*'([^']+)'\s*,\s*layer:\s*'([^']+)'\s*,\s*bundle:\s*'([^']+)'(?:\s*,\s*order:\s*(\d+))?\s*\}/g;
function fragmentRows(rootDir = ROOT) {
  const dir = path.join(rootDir, 'fragments', 'css');
  const rows = [];
  if (!fs.existsSync(dir)) return rows;
  for (const f of fs.readdirSync(dir).sort()) {
    if (!f.endsWith('.ts')) continue;
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    for (const m of src.matchAll(ROW_RE)) {
      rows.push({ stream: f.replace(/\.ts$/, ''), file: m[1], layer: m[2], bundle: m[3], order: m[4] ? Number(m[4]) : undefined });
    }
  }
  return rows;
}

export const ownerOf = (() => {
  let rows = null;
  return (file) => {
    if (rows === null) {
      rows = [];
      const p = path.join(ROOT, 'contracts', 'ownership.json');
      if (fs.existsSync(p)) {
        for (const r of JSON.parse(fs.readFileSync(p, 'utf8')).rows ?? []) {
          const re = new RegExp('^' + r.glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\u0000').replace(/\*/g, '[^/]*').replace(/\u0000/g, '.*') + '$');
          rows.push({ re, owner: r.owner });
        }
      }
    }
    return rows.find((r) => r.re.test(file))?.owner ?? 'NONE';
  };
})();

/* file -> the REQ-FIN that removes its baseline row (PRD-F §5/§6.1). FIN-A
   files map to their own REQ-FIN; each stream fixes line 1 and the outer
   @layer of its own files: MAT under REQ-FIN-58, CMP under REQ-FIN-70
   (CMP-08), SURF under REQ-FIN-80 (SURF-03), PLAT compat css under REQ-FIN-33. */
const REQ_FIN_BY_PATH = [
  [/^src\/a11y\/css\//, 'REQ-FIN-05'],
  [/^src\/theme\/preferences-panel\/GlassPreferencesPanel\.css$/, 'REQ-FIN-05'],
  [/^src\/material\/css\/(material|lens)\.css$/, 'REQ-FIN-02'],
  [/^src\/material\/css\/generated\//, 'REQ-FIN-03'],
  [/^src\/motion\/css\/(motion-modes|loading)\.css$/, 'REQ-FIN-12'],
  [/^src\/compat\/css\//, 'REQ-FIN-33'],
];
const REQ_FIN_BY_OWNER = { MAT: 'REQ-FIN-58', CMP: 'REQ-FIN-70', SURF: 'REQ-FIN-80', PLAT: 'REQ-FIN-33', QUAL: 'REQ-FIN-100', CONTRACT: 'REQ-FIN-463', NONE: 'REQ-FIN-14' };
export const reqFinFor = (file, owner) => REQ_FIN_BY_PATH.find(([re]) => re.test(file))?.[1] ?? REQ_FIN_BY_OWNER[owner] ?? 'REQ-FIN-14';

const walkCss = (dir, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkCss(p, out);
    else if (e.name.endsWith('.css')) out.push(p);
  }
  return out;
};

const LAYER_BLOCK_RE = /@layer\s+([a-zA-Z0-9.,\s-]+?)\s*\{/g;
const IMPORT_RE = /@import\s+(?:url\(\s*)?['"]?([^'")\s;]+)['"]?\s*\)?[^;]*;/g;
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

const violations = [];
const add = (file, rule, msg) => violations.push({ file, rule, msg });

export function scan(rootDir) {
  violations.length = 0;
  const cssDir = path.join(rootDir, 'src');
  const files = walkCss(cssDir).map((f) => path.relative(rootDir, f).replace(/\\/g, '/'));
  const rows = fragmentRows(rootDir);
  const rowFor = new Map();
  const seen = new Map();
  for (const r of rows) {
    if (seen.has(r.file)) add(r.file, 'double-inclusion', `registered twice in fragments/css (${seen.get(r.file)} and ${r.stream})`);
    seen.set(r.file, r.stream);
    rowFor.set(r.file, r);
    if (!fs.existsSync(path.join(rootDir, r.file))) add(r.file, 'missing-file', `fragment row (${r.stream}.ts) names a file that does not exist`);
  }

  /* @import graph: a file imported by a registered file ships through it */
  const importsOf = new Map();
  for (const rel of files) {
    const body = stripComments(fs.readFileSync(path.join(rootDir, rel), 'utf8'));
    const targets = [];
    for (const m of body.matchAll(IMPORT_RE)) {
      if (!m[1].startsWith('.')) continue;          // package imports are consumer-facing docs, not inclusion
      targets.push(path.posix.normalize(path.posix.join(path.posix.dirname(rel), m[1])));
    }
    importsOf.set(rel, targets);
  }
  const fileSet = new Set(files);
  for (const [rel, targets] of importsOf) {
    for (const t of targets) {
      // case-sensitive on purpose: CI runs on Linux even when the Mac FS is not
      if (t.startsWith('src/') && !fileSet.has(t)) add(rel, 'missing-import', `@import of ${t}, which does not exist (paths are case-sensitive)`);
      // the importer is the offender: registration in fragments/css is how a
      // file ships, so a second copy through @import is the one to delete
      else if (rowFor.has(t) && rowFor.has(rel)) add(rel, 'double-inclusion', `@import-s ${t}, which fragments/css/${rowFor.get(t).stream}.ts already registers (register it or import it, not both)`);
    }
  }
  const shipped = new Set();
  const visit = (rel) => {
    for (const t of importsOf.get(rel) ?? []) if (!shipped.has(t)) { shipped.add(t); visit(t); }
  };
  for (const r of rows) { shipped.add(r.file); visit(r.file); }

  for (const rel of files) {
    if (!shipped.has(rel)) add(rel, 'unregistered', 'no fragments/css/<stream>.ts row and not @import-ed by a registered file — it never reaches a bundle');
    const css = fs.readFileSync(path.join(rootDir, rel), 'utf8');
    const firstLine = css.split('\n', 1)[0].trim();
    if (firstLine !== LAYER_ORDER_STATEMENT) {
      add(rel, 'layer-order-statement', `line 1 must be "${LAYER_ORDER_STATEMENT}"`);
    }
    const body = stripComments(css);
    const blocks = [...body.matchAll(LAYER_BLOCK_RE)].map((m) => m[1].trim());
    const badLayers = blocks.filter((l) => BANNED_LAYERS.test(l));
    for (const l of badLayers) add(rel, 'banned-layer', `@layer ${l} is not a canonical layer (use ag.components with a backdrops/media bundle)`);
    const canonicalBlocks = blocks.filter((l) => CANONICAL_LAYERS.has(l));
    const row = rowFor.get(rel);
    if (canonicalBlocks.length !== 1) {
      add(rel, 'one-layer', `expected exactly one canonical @layer block, found ${canonicalBlocks.length} (${canonicalBlocks.join(', ') || 'none'})`);
    } else if (row && canonicalBlocks[0] !== row.layer) {
      add(rel, 'layer-mismatch', `file declares @layer ${canonicalBlocks[0]} but fragments/css/${row.stream}.ts registers ${row.layer}`);
    }
    if (/!important\b/.test(body)) add(rel, 'no-important', '!important is never allowed in library CSS');
    const layer = row?.layer ?? canonicalBlocks[0];
    if (/:root\b/.test(body) && !ROOT_ALLOWED.has(layer ?? '')) {
      add(rel, 'no-root', ':root selectors only allowed in ag.tokens / ag.compat rows');
    }
  }
  return violations;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const vs = scan(ROOT);
  let baseline = [];
  if (fs.existsSync(path.join(ROOT, BASELINE))) baseline = JSON.parse(fs.readFileSync(path.join(ROOT, BASELINE), 'utf8'));

  if (WRITE_BASELINE) {
    // shrink-only: rows are kept only for files that still offend; a new
    // offender is never added here (it must be fixed, PRD-F §4.3 rule 3)
    const offending = new Set(vs.map((v) => v.file));
    const out = baseline.filter((b) => offending.has(b.file));
    fs.writeFileSync(path.join(ROOT, BASELINE), JSON.stringify(out, null, 2) + '\n');
    console.log(`verify-css-files: kept ${out.length} of ${baseline.length} baseline rows in ${BASELINE}`);
    process.exit(0);
  }

  const baselined = new Set(baseline.map((b) => b.file));
  const hard = vs.filter((v) => !baselined.has(v.file));
  for (const v of vs) {
    const row = baseline.find((b) => b.file === v.file);
    console.log(`${row ? 'BASELINED' : 'FAIL'} ${v.file} ${v.rule} ${v.msg}${row ? ` (owner ${row.owner}, removed by ${row.reqFin})` : ` (owner ${ownerOf(v.file)}, ${reqFinFor(v.file, ownerOf(v.file))})`}`);
  }
  const stale = baseline.filter((b) => !vs.some((v) => v.file === b.file));
  for (const s of stale) console.log(`FAIL stale baseline row: ${s.file} no longer offends — delete the row (owner ${s.owner})`);
  const problems = rowProblems(baseline, { gate: 'verify-css-files', version: undefined });
  for (const m of problems) console.log(`FAIL ${m}`);
  console.log(`verify-css-files: ${vs.length} violation(s) across ${walkCss(path.join(ROOT, 'src')).length} css files, ${baseline.length} baseline rows`);
  process.exit(hard.length > 0 || stale.length > 0 || problems.length > 0 ? 1 : 0);
}
