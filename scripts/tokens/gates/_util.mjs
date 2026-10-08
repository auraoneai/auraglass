/* Shared helpers for token gates (MAT-050..062). */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

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
