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

const rows = [];
for (const f of files) {
  const src = readFileSync(join(ROOT, f), 'utf8');
  const inMotion = new RegExp(`(${PROPS})=\\{[^\\n]*(prefersReducedMotion|reducedMotion|shouldAnimate)`);
  if (!inMotion.test(src)) continue;
  const emptyBranch = /\?\s*\{\}\s*:|:\s*\{\}\s*[},]/.test(src);
  const undefinedBranch = /\?\s*undefined\s*:|:\s*undefined\s*[},]/.test(src);
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
