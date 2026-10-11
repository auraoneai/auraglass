#!/usr/bin/env node
// QUAL (REQ-QUAL-50, REQ-QUAL-59 copy rule; REQ-FIN-106; FIN-450): rendered-copy lint for story files.
//
//   node scripts/storybook/lint-story-copy.mjs [--baseline <path>] [--prune] [files...]
//
// Scans the copy a story renders — JSX text, string JSX attributes that carry text (aria-label, title, placeholder,
// label, …) and string `args` — in every story file matched by the .storybook/main.ts globs (or the given files).
// Banned: the REQ-QUAL-50 list, and the rendered text `Default`. Violations are attributed to the file's owner;
// exit 1 when one is not in the expiring baseline (certification/baselines-gates/story-contract.json).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, storyFiles, parseStoryFile, ownerOf } from './lib/story-static.mjs';
import { compare, formatByOwner, loadBaseline, packageVersion, pruneBaseline } from './lib/baseline.mjs';

/** REQ-QUAL-50 banned copy. Matching is case-insensitive; `Sample ` keeps its trailing space (so "Samples" passes). */
export const BANNED_COPY = ['glass morphism', 'Lorem', 'Sample ', 'This is a', 'Click Me', 'consciousness', 'quantum', 'predictive', 'eye tracking'];
/** The rendered text `Default` (a placeholder label), matched as the whole string. */
export const BANNED_EXACT = ['Default'];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PATTERNS = BANNED_COPY.map((w) => ({ word: w, re: new RegExp(`(?:^|[^\\p{L}])${esc(w).replace(/ /g, '\\s')}`, 'iu') }));
// `glass morphism` also covers the one-word spelling
PATTERNS.push({ word: 'glass morphism', re: /glassmorphism/i });

/** Copy violations in one story file's source. */
export function lintCopy(file, source, owner = ownerOf(file)) {
  const { copy } = parseStoryFile(file, source);
  const out = [];
  for (const c of copy) {
    for (const p of PATTERNS) {
      if (p.re.test(c.text)) {
        out.push({ check: 'story-copy', rule: 'banned-copy', key: `${file}|${p.word.trim().toLowerCase()}`, owner, file,
          message: `${file}:${c.line} renders "${c.text.slice(0, 60)}" (banned: "${p.word.trim()}", ${c.where})` });
      }
    }
    if (BANNED_EXACT.includes(c.text)) {
      out.push({ check: 'story-copy', rule: 'rendered-default', key: `${file}|default`, owner, file,
        message: `${file}:${c.line} renders the placeholder text "Default" (${c.where})` });
    }
  }
  // one row per (file, word): the owner fixes the file, the baseline does not track line numbers
  return [...new Map(out.map((v) => [`${v.rule}|${v.key}`, v])).values()];
}

export function lintAllCopy(root = ROOT, files = null) {
  const list = files ?? storyFiles(root).map((f) => f.file).filter((f) => !f.endsWith('.mdx'));
  return list.flatMap((f) => lintCopy(f, readFileSync(join(root, f), 'utf8'), ownerOf(f, root)));
}

function main(argv) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined; };
  const files = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && argv[i - 1] === '--baseline'));
  const violations = lintAllCopy(ROOT, files.length ? files : null);
  if (argv.includes('--prune')) { console.log(`lint-story-copy: pruned ${pruneBaseline(violations, ['story-copy'])} stale rows`); return 0; }
  const r = compare(violations, loadBaseline(ROOT, arg('--baseline')), { checks: ['story-copy'], version: packageVersion(ROOT) });
  console.log(`lint-story-copy: ${violations.length} violations (${r.baselined.length} baselined, ${r.introduced.length} introduced, ${r.stale.length} stale baseline rows)`);
  if (r.introduced.length) { console.error(`FAIL introduced, per owner:\n${formatByOwner(r.introduced)}`); return 1; }
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exit(main(process.argv.slice(2)));
