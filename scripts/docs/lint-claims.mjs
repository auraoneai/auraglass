#!/usr/bin/env node
// lint-claims.mjs — REQ-PLAT-104 (PLAT-391). Hand-written numbers in shipped
// prose are forbidden. Any match of the PRD regex (verbatim)
//   \b\d+(\.\d+)?\s?(%|KB|MB|ms|s|components|flagships|targets|recipes|blocks|transforms)\b
// outside a claim fails, in README.md, apps/docs/content/**, llms.txt.tmpl and
// the generated release body. Only claim regions
// (`<!-- ag:claim id="…" -->…<!-- /ag:claim -->`, `<Claim id="…" />`) and code
// fences are skipped. scripts/docs/claims-allow.json lists non-claim numbers
// (versions, viewport widths, Node floors) — each entry needs a reason.
// Claim markers are checked too: an unpaired/legacy marker or an unknown id
// fails.
//
// Usage: node scripts/docs/lint-claims.mjs [--file <path>]...
//   --file adds a target (e.g. the release body at another path).
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLAIM_SOURCES } from './gen-claims.mjs';
import { RELEASE_BODY } from './paths.mjs';
import { REGION_RE } from './render-claims.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** PRD REQ-PLAT-104 regex, verbatim. */
export const NUMBER_RE = /\b\d+(\.\d+)?\s?(%|KB|MB|ms|s|components|flagships|targets|recipes|blocks|transforms)\b/g;
export const SCAN = ['README.md', 'apps/docs/content', 'llms.txt.tmpl', RELEASE_BODY];
const ALLOW_FILE = 'scripts/docs/claims-allow.json';
const CLAIM_JSX_RE = /<Claim\s+id=["']([\w-]+)["']\s*\/>/g;

function* files(dir) {
  for (const f of readdirSync(dir, { recursive: true }).map(String).sort()) {
    if (/\.(md|mdx)$/.test(f)) yield join(dir, f);
  }
}

export function loadAllow(root = ROOT) {
  const p = join(root, ALLOW_FILE);
  const rows = existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : [];
  const bad = rows.filter((r) => typeof r.text !== 'string' || !r.text || typeof r.reason !== 'string' || !r.reason.trim());
  if (bad.length) throw new Error(`${ALLOW_FILE}: every entry needs non-empty "text" and "reason" (${JSON.stringify(bad[0])})`);
  return rows;
}

/** Lint one file's text. Returns violations { line, text, kind }. */
export function lintText(text, { file = '', allow = [] } = {}) {
  const v = [];
  const known = new Set(Object.keys(CLAIM_SOURCES));
  for (const m of text.matchAll(REGION_RE)) if (!known.has(m[1])) v.push({ line: lineOf(text, m.index), text: m[0].slice(0, 60), kind: 'unknown-claim' });
  for (const m of text.matchAll(CLAIM_JSX_RE)) if (!known.has(m[1])) v.push({ line: lineOf(text, m.index), text: m[0], kind: 'unknown-claim' });
  /* blank claim regions (keeping line numbers), then walk lines outside fences */
  const blanked = text.replace(REGION_RE, (s) => s.replace(/[^\n]/g, ' ')).replace(CLAIM_JSX_RE, (s) => ' '.repeat(s.length));
  let fence = null;
  blanked.split('\n').forEach((line, i) => {
    const f = line.match(/^\s*(`{3,}|~{3,})/);
    if (f) { if (!fence) fence = f[1][0]; else if (f[1][0] === fence) fence = null; return; }
    if (fence) return;
    if (/ag:claim/.test(line)) v.push({ line: i + 1, text: line.trim().slice(0, 60), kind: 'unpaired-claim-marker' });
    for (const m of line.matchAll(NUMBER_RE)) {
      if (allow.some((a) => a.text === m[0] && (!a.file || a.file === file))) continue;
      v.push({ line: i + 1, text: m[0], kind: 'unsourced-number' });
    }
  });
  return v;
}

function lineOf(text, index) { return text.slice(0, index).split('\n').length; }

export function lint(root = ROOT, { extra = [] } = {}) {
  const allow = loadAllow(root);
  const violations = [];
  for (const rel of new Set([...SCAN, ...extra])) {
    const base = join(root, rel);
    if (!existsSync(base)) continue;
    const targets = rel === 'apps/docs/content' ? [...files(base)] : [base];
    for (const abs of targets) {
      const file = relative(root, abs);
      for (const x of lintText(readFileSync(abs, 'utf8'), { file, allow })) violations.push({ file, ...x });
    }
  }
  return violations;
}

export function main(argv = process.argv.slice(2), root = ROOT) {
  const extra = [];
  for (let i = 0; i < argv.length; i++) if (argv[i] === '--file') extra.push(argv[++i]);
  for (const rel of extra) if (!existsSync(join(root, rel))) { console.error(`lint-claims: ${rel} missing`); return 1; }
  const v = lint(root, { extra });
  if (v.length) {
    v.forEach((x) => console.error(`  FAIL ${x.file}:${x.line} ${x.kind} "${x.text}"`));
    console.error(`lint-claims: ${v.length} violation(s) — source the number through a claim region or add a reasoned ${ALLOW_FILE} entry`);
    return 1;
  }
  console.log('lint-claims: clean');
  return 0;
}
if (process.argv[1]?.endsWith('lint-claims.mjs')) process.exitCode = main();
