#!/usr/bin/env node
// lint-claims.mjs — PLAT-391. Hand-written numbers in shipped prose are
// forbidden: any numeric claim matching the PRD number-regex must come from
// an `ag:claim` region or the committed allow-list (claims-allow.json, with
// a reason per entry). Scans README.md, llms.txt, apps/docs/content/**,
// docs/quickstart/**.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SCAN = ['README.md', 'llms.txt', 'apps/docs/content', 'docs/quickstart'];
/* PRD §claims: versioned/perf-ish numbers in prose — sizes, times, counts,
   percentages, contrast ratios. Versions like v5.0.0 and code literals are
   allowed; the regex needs prose context (word + number + unit/range). */
const NUMBER_RE = /\b(?:\d+(?:\.\d+)?\s?(?:KB|MB|GB|ms|s\b|components|blocks|items|recipes|transforms|gates|exports|tokens|:1)|≥\s?\d|\b\d{2,3}%|\b\d\.\d+:1)\b/g;
const ALLOW = JSON.parse(readFileSync(join(ROOT, 'scripts/docs/claims-allow.json'), 'utf8'));

function* files(dir) {
  if (!existsSync(dir)) return;
  for (const f of readdirSync(dir, { recursive: true })) {
    const p = join(dir, String(f));
    if (/\.(md|mdx|txt)$/.test(String(f))) yield p;
  }
}

export function lint(root = ROOT) {
  const violations = [];
  for (const rel of SCAN) {
    const base = join(root, rel);
    const targets = existsSync(base) && !base.endsWith('.md') && !base.endsWith('.txt') ? [...files(base)] : existsSync(base) ? [base] : [];
    for (const file of targets) {
      const src = readFileSync(file, 'utf8');
      const lines = src.split('\n');
      lines.forEach((line, i) => {
        if (/ag:claim|```|^\s*#/.test(line)) return;
        /* URLs, badge targets and markdown link destinations are not prose. */
        const prose = line.replace(/https?:\/\/\S+/g, ' ').replace(/\]\([^)]*\)/g, ']()');
        for (const m of prose.matchAll(NUMBER_RE)) {
          const key = `${file.replace(`${root}/`, '')}:${m[0]}`;
          if (ALLOW.some((a) => a.file === file.replace(`${root}/`, '') && a.text === m[0])) continue;
          violations.push({ file: file.replace(`${root}/`, ''), line: i + 1, text: m[0], key });
        }
      });
    }
  }
  return violations;
}

/* PLAT-owned prose fails the gate; numbers in other lanes' docs warn so
   their owners can source or allow them (findings reported, not hidden). */
const PLAT_OWNED_FILES = /^README\.md$|^llms\.txt$|^llms-full\.txt$|^apps\/docs\/content\/plat\/|^docs\/quickstart\//;

export function main() {
  const v = lint();
  const fail = v.filter((x) => PLAT_OWNED_FILES.test(x.file));
  const warn = v.filter((x) => !PLAT_OWNED_FILES.test(x.file));
  warn.forEach((x) => console.warn(`  WARN ${x.file}:${x.line} unsourced number "${x.text}" (owner lane)`));
  if (fail.length) { fail.forEach((x) => console.error(`  FAIL ${x.file}:${x.line} unsourced number "${x.text}"`)); process.exit(1); }
  console.log(`lint-claims: clean (${warn.length} owner-lane warnings)`);
}
if (process.argv[1]?.endsWith('lint-claims.mjs')) main();
