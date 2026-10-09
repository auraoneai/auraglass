#!/usr/bin/env node
/* scripts/release/release-notes.mjs — REQ-PLAT-62 (4.x port of PLAT-203).
   Assembles release notes for the tag under docs/release/notes/<version>.md
   in the fixed heading order: Breaking -> Deprecated -> Added -> Fixed ->
   Visual bug fixes -> Security. Dependency floor claims land FIRST inside
   Breaking. Counts are claims-sourced verbatim from docs/claims/claims-*.md
   (no re-derivation); the capability-ledger is read-only input.

     node scripts/release/release-notes.mjs
       --tag <tag> --line <4x|5x> [--out <md>] [--claims-dir <dir>]
       [--breaking-register <json>] [--check]                       */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { relPaths } from './lib/policy.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const PATHS = relPaths(ROOT);
export const HEADINGS = ['Breaking', 'Deprecated', 'Added', 'Fixed', 'Visual bug fixes', 'Security'];
export const DEP_FLOORS = [
  'date-fns', 'chart.js', 'react-chartjs-2', 'zod', 'framer-motion', 'tailwind-merge',
];

export function claimsNumbers(text) {
  const nums = {};
  const m = text.match(/^## Numbers\n([\s\S]*?)(?=^##\s|\s*$)/m);
  if (m) for (const line of m[1].split('\n')) {
    const kv = line.match(/^\s*-\s*([a-z0-9_.-]+)\s*:\s*(.+)$/i);
    if (kv) nums[kv[1]] = kv[2].trim();
  }
  return nums;
}
export function loadClaims(claimsDir) {
  const claims = {};
  if (existsSync(claimsDir)) {
    for (const f of readdirSync(claimsDir).filter((x) => x.startsWith('claims-') && x.endsWith('.md'))) {
      claims[f.replace(/^claims-|\.md$/g, '')] = readFileSync(join(claimsDir, f), 'utf8');
    }
  }
  return claims;
}

export function renderNotes({ version = '4.3.0', claims = {}, breakingRegister = null, visualFixes = [] } = {}) {
  const lines = [`# aura-glass ${version} release notes`, ''];
  lines.push('## Breaking', '');
  lines.push('### Dependency floors — handled by the `deps` codemod', '');
  for (const d of DEP_FLOORS) lines.push(`- \`${d}\` floor updated (run \`npx @auraglass/cli migrate 4to5 --transform deps\`).`);
  lines.push('');
  for (const b of breakingRegister?.items ?? []) {
    lines.push(`- **${b.id}: ${b.title}** — ${b.affected ?? ''}`);
  }
  lines.push('', '## Deprecated', '');
  const depClaims = claims.deprecations ? claimsNumbers(claims.deprecations) : null;
  if (depClaims && Object.keys(depClaims).length) {
    for (const [k, v] of Object.entries(depClaims)) lines.push(`- ${k}: ${v}`);
    lines.push('');
  }
  lines.push('All 4.x deprecations shipped in this minor are listed in deprecations.json.',
    'Runtime warnings name the codemod that performs the change.', '');
  lines.push('## Added', '');
  lines.push('- `aura-glass/material` experimental 5.x bridge surface.');
  lines.push('- `aura-glass/compat` stylesheet tokens bridge.');
  lines.push('- `@auraglass/cli` migrate 4to5 transforms.');
  lines.push('', '## Fixed', '', '_Populated by the fix ledger at RC._', '');
  lines.push('## Visual bug fixes', '');
  for (const f of visualFixes) lines.push(`- ${f.fix ?? f.id ?? f}: ${f.selector ?? ''}`.trim());
  if (!visualFixes.length) lines.push('_Entries come from `docs/release/visual-fixes/*.json` records._');
  lines.push('', '## Security', '');
  lines.push('_Sourced from the security claims file; see SECURITY.md for the support policy._', '');
  return lines.join('\n');
}

export function main(argv = process.argv.slice(2), { root = ROOT } = {}) {
  const arg = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
  const tag = arg('--tag', null);
  const version = (tag ?? 'v0.0.0').replace(/^v/, '');
  const claimsDir = arg('--claims-dir', join(root, 'docs/claims'));
  const out = arg('--out', join(root, `docs/release/notes/${version}.md`));
  const breakingRegisterPath = arg('--breaking-register', PATHS.breakingRegister);
  const breakingRegister = existsSync(breakingRegisterPath)
    ? JSON.parse(readFileSync(breakingRegisterPath, 'utf8')) : null;
  const vfDir = join(root, 'docs/release/visual-fixes');
  const visualFixes = existsSync(vfDir)
    ? readdirSync(vfDir).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(join(vfDir, f), 'utf8')))
    : [];
  const text = renderNotes({ version, claims: loadClaims(claimsDir), breakingRegister, visualFixes });
  if (argv.includes('--check')) {
    const existing = existsSync(out) ? readFileSync(out, 'utf8') : null;
    if (existing !== text) { console.error(`FAIL release-notes: ${out} is stale`); return 1; }
    console.log('release-notes: up to date'); return 0;
  }
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, text);
  console.log(`release-notes: wrote ${out}`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try { process.exit(main()); } catch (e) { console.error(e); process.exit(1); }
}
