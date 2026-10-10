#!/usr/bin/env node
/**
 * REQ-PLAT-48 — regenerate the reduced-motion file table.
 * Lists every src file that wires a reduced-motion signal into a
 * framer-motion prop (animate/whileHover/whileTap/whileFocus/whileDrag/
 * exit/transition/variants), plus the conversion spelling it uses.
 * Usage: node scripts/docs/gen-reduced-motion-table.mjs [--check]
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../..', import.meta.url).pathname;
const OUT = join(ROOT, 'docs/release/reduced-motion-file-table.md');
const PROPS = 'animate|whileHover|whileTap|whileFocus|whileDrag|exit|transition|variants';

const files = execSync(
  `rg -ln "prefersReducedMotion|reducedMotion|shouldAnimate" src -g '*.tsx' -g '*.ts'`,
  { cwd: ROOT, encoding: 'utf8' }
).trim().split('\n').filter(Boolean);

const SIGNAL = /prefersReducedMotion|reducedMotion|shouldAnimate/;

/** Bodies of every `<prop>={...}` JSX expression (braces balanced). */
function motionExpressions(src) {
  const out = [];
  const re = new RegExp(`\\b(?:${PROPS})=\\{`, 'g');
  let m;
  while ((m = re.exec(src))) {
    let depth = 1;
    let i = re.lastIndex;
    for (; i < src.length && depth > 0; i++) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}') depth--;
    }
    out.push(src.slice(re.lastIndex, i - 1).trim());
  }
  return out;
}

const rows = [];
for (const f of files) {
  const src = readFileSync(join(ROOT, f), 'utf8');
  // Inspect only the brace-balanced `prop={...}` expressions, so that a
  // prettier-wrapped ternary still counts and unrelated `key: {}` object
  // literals elsewhere in the file are not reported as empty branches.
  const exprs = motionExpressions(src).filter((e) => SIGNAL.test(e));
  if (exprs.length === 0) continue;
  const emptyBranch = exprs.some((e) => /\?\s*\{\}\s*:|:\s*\{\}\s*$/.test(e));
  const undefinedBranch = exprs.some((e) => /\?\s*undefined\s*:|:\s*undefined\s*$/.test(e));
  const cookie = /cookie-consent/.test(f);
  rows.push({ f, emptyBranch, undefinedBranch, cookie });
}
rows.sort((a, b) => a.f.localeCompare(b.f));

const lines = [
  '# Reduced-motion file table (generated)',
  '',
  'REQ-PLAT-48 — files wiring a reduced-motion signal into framer-motion props.',
  'Regenerate: `node scripts/docs/gen-reduced-motion-table.mjs`.',
  'Exception: `cookie-consent/` keeps motion gated via its explicit',
  '`disableAnimation` prop — it is exempt from `auraglass/motion-no-empty-animate`.',
  '',
  '| File | Pattern |',
  '|------|---------|',
  ...rows.map((r) => `| \`${r.f}\` | ${r.cookie ? 'cookie-consent exception' : r.undefinedBranch ? '`? undefined :`' : r.emptyBranch ? 'FLAGGED `? {} :`' : 'conditional'} |`),
  '',
  `Total: ${rows.length} files.`,
];

const text = lines.join('\n') + '\n';
if (process.argv.includes('--check')) {
  const cur = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  if (cur !== text) {
    console.error('reduced-motion-file-table.md is stale — run gen-reduced-motion-table.mjs');
    process.exit(1);
  }
  console.log('reduced-motion-file-table.md in sync');
  process.exit(0);
}
writeFileSync(OUT, text);
console.log(`written ${OUT} — ${rows.length} files`);
