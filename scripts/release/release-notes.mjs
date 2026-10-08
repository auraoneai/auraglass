#!/usr/bin/env node
/* scripts/release/release-notes.mjs — REQ-PLAT-32 (PLAT-203). Assembles the
   5.0.0 notes skeleton under docs/release/notes/5.0.0.md in the fixed heading
   order: Breaking -> Deprecated -> Added -> Fixed -> Visual bug fixes ->
   Security. Any dependency floor claims land FIRST inside Breaking (the deps
   codemod handles them). Counts are claims-sourced: each claims-*.md file
   contributes its declared numbers verbatim — no re-derivation. The SURF
   capability-ledger is read-only input for the Added/Fixed section mapping.

     node scripts/release/release-notes.mjs [--claims-dir docs/claims]
            [--capability-ledger docs/auraglass-5/capability-ledger.json]
            [--out docs/release/notes/5.0.0.md] [--check]                */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
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
  // A claims file declares numbers as `name: value` under a `## Numbers`
  // heading; we carry them verbatim.
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

export function renderNotes({ version = '5.0.0', claims = {}, capabilityLedger = null, breakingRegister = null } = {}) {
  const lines = [`# aura-glass ${version} release notes`, ''];
  lines.push('## Breaking', '');
  lines.push('### Dependency floors — handled by the `deps` codemod', '');
  for (const d of DEP_FLOORS) lines.push(`- \`${d}\` floor updated (run \`npx @auraglass/cli migrate 4to5 --transform deps\`).`);
  lines.push('');
  const items = breakingRegister?.items ?? [];
  for (const b of items) lines.push(`- **B${String(b.id).replace(/^B/, '')}: ${b.title}** — ${b.affected ?? ''}`);
  lines.push('', '## Deprecated', '');
  const depClaims = claims.deprecations ? claimsNumbers(claims.deprecations) : null;
  if (depClaims && Object.keys(depClaims).length) {
    for (const [k, v] of Object.entries(depClaims)) lines.push(`- ${k}: ${v}`);
    lines.push('');
  }
  lines.push('All 4.x deprecations and the new 5.x deprecation entries are listed in the',
    'generated guide (`apps/docs/generated/migration/deprecations.md` in a release',
    'build). Runtime warnings name the codemod that performs the change.', '');
  lines.push('## Added', '');
  lines.push('- `aura-glass/compat` adapters for every deprecated component export.');
  lines.push('- `aura-glass/migrate` CLI (4to5 transforms; see the removal train).');
  if (capabilityLedger?.capabilities) {
    for (const c of capabilityLedger.capabilities) lines.push(`- ${c.name ?? c.id}: ${c.summary ?? ''}`);
  }
  lines.push('', '## Fixed', '', '_Populated by the fix ledger at RC._', '');
  lines.push('## Visual bug fixes', '');
  lines.push('_Entries come from `docs/release/visual-fixes/*.json` records (change class C-I-VF)._', '');
  lines.push('## Security', '');
  lines.push('_Sourced from the security claims file; see SECURITY.md for the support policy._', '');
  return lines.join('\n');
}

export function main(argv = process.argv.slice(2), { root = ROOT } = {}) {
  const arg = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
  const claimsDir = arg('--claims-dir', join(root, 'docs/claims'));
  const ledgerPath = arg('--capability-ledger', PATHS.capabilityLedger);
  const out = arg('--out', join(root, 'docs/release/notes/5.0.0.md'));
  const capabilityLedger = existsSync(ledgerPath) ? JSON.parse(readFileSync(ledgerPath, 'utf8')) : null;
  const breakingRegister = existsSync(PATHS.breakingRegister)
    ? JSON.parse(readFileSync(PATHS.breakingRegister, 'utf8')) : null;
  const text = renderNotes({ claims: loadClaims(claimsDir), capabilityLedger, breakingRegister });
  if (argv.includes('--check')) {
    const existing = existsSync(out) ? readFileSync(out, 'utf8') : null;
    if (existing !== text) { console.error(`FAIL release-notes: ${out} is stale`); return 1; }
    console.log('release-notes: up to date'); return 0;
  }
  writeFileSync(out, text);
  console.log(`release-notes: wrote ${out}`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try { process.exit(main()); } catch (e) { console.error(e); process.exit(1); }
}
