/* Shared helpers for token gates (MAT-050..062). */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import picomatch from 'picomatch';
import postcss from 'postcss';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

export function walkFiles(dir, exts) {
  const out = [];
  const walk = (d) => {
    if (!existsSync(d)) return;
    for (const name of readdirSync(d).sort()) {
      if (name === 'node_modules' || name.startsWith('.')) continue;
      const p = join(d, name);
      try {
        if (statSync(p).isDirectory()) walk(p);
        else if (exts.some((e) => name.endsWith(e))) out.push(p);
      } catch { /* ignore */ }
    }
  };
  walk(dir);
  return out;
}

export const rel = (p) => relative(ROOT, p).replace(/\\/g, '/');

/** var(--x) uses in CSS text: [{name, hasFallback, index}]. */
export function cssVarUses(text) {
  const out = [];
  for (const m of text.matchAll(/var\(\s*(--_?ag-[a-zA-Z0-9-]+|@[a-z-]+\([^)]*\))\s*(,[^)]+)?\)/g)) {
    if (!m[1].startsWith('--')) continue;
    out.push({ name: m[1], hasFallback: m[2] != null, index: m.index });
  }
  return out;
}

/** Custom property declarations --x: in CSS text. */
export function cssVarDefs(text) {
  const out = new Set();
  for (const m of text.matchAll(/(--_?ag-[a-zA-Z0-9-]+|--background|--foreground|--primary|--primary-foreground|--muted|--border|--ring|--radius)\s*:/g))
    out.add(m[1]);
  return out;
}

/** Resolve a CSS file's @import closure (relative imports only). Returns Map<file, text>. */
export function importClosure(entryFile, seen = new Map()) {
  if (seen.has(entryFile) || !existsSync(entryFile)) return seen;
  const text = readFileSync(entryFile, 'utf8');
  seen.set(entryFile, text);
  for (const m of text.matchAll(/@import\s+(?:url\()?['"]([^'"]+)['"]\)?/g)) {
    const spec = m[1];
    if (!spec.startsWith('.')) continue;
    importClosure(join(dirname(entryFile), spec), seen);
  }
  return seen;
}

/** --_?ag-<name> refs inside TS/TSX text. Names must end alphanumeric (a match
 *  ending in '-' is a dynamic prefix like `--ag-color-${c}` — can't verify statically). */
export function tsVarRefs(text) {
  const out = [];
  for (const m of text.matchAll(/(--_?ag-[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)/g)) {
    const after = text[m.index + m[0].length];
    if (after === '-' || after === '$' || m[0].endsWith('-')) continue; // dynamic template head
    out.push({ name: m[1], index: m.index });
  }
  return out;
}

/** var(--ag-x) static uses inside TS/TSX text (skips dynamic template heads). */
export function tsVarUses(text) {
  const out = [];
  for (const m of text.matchAll(/var\(\s*(--_?ag-[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)\s*[,)]/g))
    out.push({ name: m[1], index: m.index });
  return out;
}

/** custom-prop assignment names in TS/TSX: '--ag-x': or ['--ag-x'] = or {"--ag-x":} */
export function tsVarDefs(text) {
  const out = new Set();
  for (const m of text.matchAll(/['"](--_?ag-[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)['"]\s*[,:]=?/g))
    out.add(m[1]);
  for (const m of text.matchAll(/\[['"](--_?ag-[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)['"]\]\s*=/g))
    out.add(m[1]);
  return out;
}

/* ---- stream attribution (REQ-MAT-17 / REQ-FIN-53) ----------------------------
 * A finding belongs to the stream that owns the file it sits in, resolved
 * through contracts/ownership.json on the 5x line (first matching row; rows
 * scoped to other lines are skipped). Generated dist artifacts are attributed to
 * the script that writes them, so dist token css resolves to the owner of
 * scripts/tokens/build.mjs. Stream ids are printed lower-case. */
const OWNERSHIP_ROWS = JSON.parse(readFileSync(join(ROOT, 'contracts/ownership.json'), 'utf8')).rows
  .filter((r) => !r.lines || r.lines.includes('5x'))
  .map((r) => ({ ...r, test: picomatch(r.glob, { dot: true }) }));

export const PRODUCERS = [
  ['dist/tokens.css', 'scripts/tokens/build.mjs'],
  ['dist/tokens/**', 'scripts/tokens/build.mjs'],
  ['dist/tailwind.css', 'scripts/tokens/build.mjs'],
  ['dist/css/tokens.css', 'scripts/tokens/build.mjs'],
  ['dist/css/tailwind.css', 'scripts/tokens/build.mjs'],
  ['dist/compat/tokens.css', 'scripts/tokens/build.mjs'],
  ['dist/css/compat/**', 'scripts/tokens/build.mjs'],
].map(([glob, producer]) => ({ test: picomatch(glob, { dot: true }), producer }));

/** Owning stream (lower-case: mat, plat, cmp, surf, qual, contract, none) of a repo-relative path. */
export function streamOf(relPath) {
  const p = relPath.replace(/\\/g, '/');
  const produced = PRODUCERS.find((x) => x.test(p));
  const target = produced ? produced.producer : p;
  const row = OWNERSHIP_ROWS.find((r) => r.test(target));
  return (row ? row.owner : 'PLAT').toLowerCase();
}

/** Partition findings by owning stream: MAT findings fail the gate, every other
 *  stream's are printed as `pre-existing (<stream>)` and never change the exit code. */
export function reportByStream(gate, findings, describe) {
  const mat = findings.filter((f) => f.stream === 'mat');
  const other = findings.filter((f) => f.stream !== 'mat');
  for (const f of other) console.log(`${gate}: pre-existing (${f.stream}) ${describe(f)}`);
  for (const f of mat) console.error(`${gate}: MAT ${describe(f)}`);
  return { mat, other };
}

/** Custom-property declarations and var() reads of one CSS text.
 *  defs: [{name, value, line}] (`initial` reservations excluded: they keep the
 *  name guaranteed-invalid and define nothing).
 *  uses: [{name, hasFallback, via, line}] where `via` is the custom property whose
 *  declaration value contains the read (null for a normal property).
 *  Unparseable CSS falls back to a declaration-regex scan and sets parseError. */
export function scanCss(text, from = 'inline.css') {
  const defs = [];
  const uses = [];
  const addUses = (value, via, line) => {
    for (const m of String(value).matchAll(/var\(\s*(--[a-zA-Z0-9_-]+)\s*(,)?/g))
      uses.push({ name: m[1], hasFallback: m[2] != null, via, line });
  };
  const addDecl = (prop, value, line) => {
    const custom = prop.startsWith('--');
    if (custom && String(value).trim() !== 'initial') defs.push({ name: prop, value, line });
    addUses(value, custom ? prop : null, line);
  };
  const properties = [];
  try {
    const root = postcss.parse(text, { from });
    root.walkDecls((d) => addDecl(d.prop, d.value, d.source?.start?.line ?? 1));
    root.walkAtRules('property', (a) => properties.push(a.params.trim()));
    return { defs, uses, properties, parseError: null };
  } catch (e) {
    const lineOf = (idx) => text.slice(0, idx).split('\n').length;
    for (const m of text.matchAll(/(^|[;{\s])([-a-zA-Z0-9_]+)\s*:\s*([^;{}]*)/g)) {
      if (m[2].startsWith('--') || /var\(/.test(m[3])) addDecl(m[2], m[3], lineOf(m.index));
    }
    for (const m of text.matchAll(/@property\s+(--[a-zA-Z0-9_-]+)/g)) properties.push(m[1]);
    return { defs, uses, properties, parseError: e.reason ?? e.message };
  }
}
