#!/usr/bin/env node
/* scripts/release/check-tsdoc-deprecated.mjs — REQ-PLAT-27 (PLAT-188/189).
   For every deprecation entry of kind export|prop|prop-value, the owning source
   declaration must carry a `@deprecated` TSDoc tag matching
   `since <since>, removed in <removeIn>` plus `{@link <replacement>}` when the
   entry names a replacement. Reverse direction: any `@deprecated` tag whose text
   carries `removed in` on a covered export must have an entry.

     node scripts/release/check-tsdoc-deprecated.mjs [--roots src] [--entries <json>] */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const COVERED_KINDS = new Set(['export', 'prop', 'prop-value']);

export function findDeclFiles(symbol, roots, { cwd = ROOT } = {}) {
  const out = [];
  for (const root of roots) {
    try {
      const hits = execFileSync('git', ['grep', '-l', `\\b${symbol}\\b`, '--', `${root}/`], { cwd, encoding: 'utf8' });
      out.push(...hits.split('\n').filter((f) => /\.(ts|tsx)$/.test(f)));
    } catch { /* git grep exits 1 on no match */ }
  }
  return [...new Set(out)];
}

export function deprecatedTags(text) {
  const tags = [];
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('@deprecated')) {
      const block = lines.slice(Math.max(0, i - 30), i + 4).join('\n');
      const decl = lines.slice(i + 1, i + 8).join('\n');
      const sym = /\b(?:export\s+(?:declare\s+)?(?:const|let|var|function|class|interface|type|enum)\s+|readonly\s+)(\w+)/.exec(decl)?.[1];
      tags.push({ line: i + 1, text: lines[i], block, symbol: sym ?? null });
    }
  }
  return tags;
}

export function checkEntry({ entry, readFile, findFiles, missingIsError = true }) {
  const errors = [];
  if (!COVERED_KINDS.has(entry.kind)) return errors;
  const files = findFiles(entry.symbol);
  const tag = { wantSince: `since ${entry.since}`, wantRemoved: `removed in ${entry.removeIn}` };
  let ok = false;
  for (const f of files) {
    const text = readFile(f);
    for (const t of deprecatedTags(text)) {
      const window = t.block;
      if (!window.includes(entry.symbol) && t.symbol !== entry.symbol) continue;
      if (!window.includes(tag.wantSince) || !window.includes(tag.wantRemoved)) {
        errors.push(`${entry.id}: ${f}:${t.line} @deprecated lacks '${tag.wantSince}, ${tag.wantRemoved}'`);
        continue;
      }
      if (entry.replacement && !window.includes(`{@link ${entry.replacement}}`) && !window.includes(`{@link ${entry.replacement}`)) {
        errors.push(`${entry.id}: ${f}:${t.line} missing {@link ${entry.replacement}}`);
        continue;
      }
      ok = true;
    }
  }
  if (!files.length && missingIsError) errors.push(`${entry.id}: no source declaration found for '${entry.symbol}'`);
  else if (!ok && !errors.some((e) => e.startsWith(entry.id))) {
    errors.push(`${entry.id}: '${entry.symbol}' lacks a matching @deprecated tag`);
  }
  return errors;
}

// Reverse: @deprecated tags on covered files with no matching entry.
export function checkReverse(files, entries, { readFile }) {
  const errors = []; const symbols = new Set(entries.filter((e) => COVERED_KINDS.has(e.kind)).map((e) => e.symbol));
  for (const f of files) {
    const text = readFile(f);
    for (const t of deprecatedTags(text)) {
      if (!t.text.includes('removed in')) continue;
      if (t.symbol && !symbols.has(t.symbol)) errors.push(`${f}:${t.line}: @deprecated '${t.symbol}' has no deprecation entry`);
    }
  }
  return errors;
}

export async function main(argv = process.argv.slice(2), { root = ROOT } = {}) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const line = arg('--line', '5x');
  // On 4.x the tag lives on the deprecated declaration itself (roots: src).
  // On next the 4.x sources are quarantined under legacy/ and the seam is
  // src/compat — entries without a compat wrapper are 4.x-only tags.
  const roots = (arg('--roots') ?? (line === '4x' ? 'src' : 'src/compat')).split(',');
  const missingIsError = line === '4x';
  let entries;
  if (arg('--entries')) entries = JSON.parse(readFileSync(arg('--entries'), 'utf8'));
  else {
    const { loadEntries } = await import('./gen-deprecations.mjs');
    entries = await loadEntries(root);
  }
  const readFile = (f) => readFileSync(join(root, f), 'utf8');
  const findFiles = (sym) => findDeclFiles(sym, roots, { cwd: root });
  const errors = entries.flatMap((e) => checkEntry({ entry: e, readFile, findFiles, missingIsError }));
  if (argv.includes('--reverse')) {
    const files = findDeclFiles('@deprecated', roots, { cwd: root });
    errors.push(...checkReverse(files, entries, { readFile }));
  }
  if (errors.length) { for (const e of errors) console.error(`FAIL ${e}`); return 1; }
  console.log(`check-tsdoc-deprecated: ${entries.filter((e) => COVERED_KINDS.has(e.kind)).length} covered entries OK`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().then((c) => process.exit(c)).catch((e) => { console.error(e); process.exit(1); });
}
