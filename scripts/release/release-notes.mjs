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

// .changeset/<name>.md frontmatter: `---\n'aura-glass': minor\n---\n` then body.
export function loadChangesets(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.md') && x !== 'README.md').sort()) {
    const text = readFileSync(join(dir, f), 'utf8');
    const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!m) continue;
    const bumps = [...m[1].matchAll(/['"]([\w@/-]+)['"]\s*:\s*(patch|minor|major)/g)]
      .map((b) => ({ pkg: b[1], bump: b[2] }));
    out.push({ file: f, bumps, body: m[2].trim() });
  }
  return out;
}

// Conventional-commit subjects grouped into the fixed heading order.
export function commitsToSections(subjects) {
  const sec = { Added: [], Fixed: [], 'Visual bug fixes': [], Deprecated: [], Breaking: [] };
  for (const s of subjects) {
    const m = /^(\w+)(?:\(([\w/-]+)\))?(!)?:\s*(.+)$/.exec(s);
    if (!m) { sec.Fixed.push(`- ${s}`); continue; }
    const [, type, , bang, msg] = m;
    const line = `- ${msg}`;
    if (bang) sec.Breaking.push(line);
    else if (type === 'feat') sec.Added.push(line);
    else if (type === 'fix' || type === 'perf') sec.Fixed.push(line);
    else if (type === 'deprecate' || type === 'deprecated') sec.Deprecated.push(line);
    else if (type === 'docs' || type === 'chore' || type === 'ci' || type === 'test') continue;
    else sec.Fixed.push(line);
  }
  return sec;
}

export function renderNotes({ version = '5.0.0', claims = {}, capabilityLedger = null,
  breakingRegister = null, changesets = [], commitSubjects = [], changeClass = null,
  visualFixes = [] } = {}) {
  const lines = [`# aura-glass ${version} release notes`, ''];
  lines.push('## Breaking', '');
  lines.push('### Dependency floors — handled by the `deps` codemod', '');
  for (const d of DEP_FLOORS) lines.push(`- \`${d}\` floor updated (run \`npx @auraglass/cli migrate 4to5 --transform deps\`).`);
  lines.push('');
  const items = breakingRegister?.items ?? breakingRegister?.changes ?? [];
  for (const b of items) lines.push(`- **B${String(b.id).replace(/^B/, '')}: ${b.title}** — ${b.affected ?? ''}`);
  for (const s of commitsToSections(commitSubjects).Breaking) lines.push(s);
  for (const cs of changesets.filter((c) => c.bumps.some((b) => b.bump === 'major')))
    lines.push(`- ${cs.body.split('\n')[0]} (.changeset/${cs.file})`);
  lines.push('', '## Deprecated', '');
  const depClaims = claims.deprecations ? claimsNumbers(claims.deprecations) : null;
  if (depClaims && Object.keys(depClaims).length) {
    for (const [k, v] of Object.entries(depClaims)) lines.push(`- ${k}: ${v}`);
    lines.push('');
  }
  lines.push('All 4.x deprecations and the new 5.x deprecation entries are listed in the',
    'generated guide (`apps/docs/generated/migration/deprecations.md` in a release',
    'build). Runtime warnings name the codemod that performs the change.', '');
  const secs = commitsToSections(commitSubjects);
  for (const s of secs.Deprecated) lines.push(s);
  lines.push('## Added', '');
  lines.push('- `aura-glass/compat` adapters for every deprecated component export.');
  lines.push('- `aura-glass/migrate` CLI (4to5 transforms; see the removal train).');
  for (const s of secs.Added) lines.push(s);
  for (const cs of changesets.filter((c) => c.bumps.length))
    lines.push(`- ${cs.body.split('\n')[0]} (.changeset/${cs.file})`);
  if (capabilityLedger?.capabilities) {
    for (const c of capabilityLedger.capabilities) lines.push(`- ${c.name ?? c.id}: ${c.summary ?? ''}`);
  }
  lines.push('', '## Fixed', '');
  if (secs.Fixed.length) for (const s of secs.Fixed) lines.push(s);
  else lines.push('_Populated by the fix ledger at RC._');
  lines.push('');
  lines.push('## Visual bug fixes', '');
  const vf = changeClass?.visualFixes ?? changeClass?.visual ?? null;
  if (Array.isArray(vf) && vf.length) {
    for (const v of vf) lines.push(`- ${v.title ?? v.id}${v.pr ? ` (PR #${v.pr})` : ''}`);
  } else if (visualFixes.length) {
    // docs/release/visual-fixes/*.json records (REQ-PLAT-62 4.x port).
    for (const f of visualFixes) lines.push(`- ${f.fix ?? f.id ?? f}: ${f.selector ?? ''}`.trim());
  } else {
    lines.push('_Entries come from `docs/release/visual-fixes/*.json` records (change class C-I-VF)._');
  }
  lines.push('');
  lines.push('## Security', '');
  lines.push('_Sourced from the security claims file; see SECURITY.md for the support policy._', '');
  return lines.join('\n');
}

export function main(argv = process.argv.slice(2), { root = ROOT } = {}) {
  const arg = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
  const claimsDir = arg('--claims-dir', join(root, 'docs/claims'));
  const ledgerPath = arg('--capability-ledger', PATHS.capabilityLedger);
  const out = arg('--out', join(root, 'docs/release/notes/5.0.0.md'));
  // --tag <vX.Y.Z>: subjects since the previous tag; --line <4x|5x> is accepted
  // (line-neutral: inputs are whatever exists at root); --since overrides range.
  const tag = arg('--tag');
  const argLine = arg('--line', null);
  const since = arg('--since');
  let commitSubjects = [];
  try {
    const range = since ? `${since}..HEAD`
      : tag ? `${execFileSync('git', ['tag', '-l', 'v*', '--sort=-creatordate'], { cwd: root, encoding: 'utf8' })
          .split('\n').filter((t) => t && t !== `v${tag.replace(/^v/, '')}`)[0] ?? 'HEAD'}..HEAD`
        : null;
    if (range) commitSubjects = execFileSync('git', ['log', range, '--format=%s'],
      { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
  } catch { /* shallow/young history — proceed without subjects */ }
  const capabilityLedger = existsSync(ledgerPath) ? JSON.parse(readFileSync(ledgerPath, 'utf8')) : null;
  const breakingRegisterPath = arg('--breaking-register', PATHS.breakingRegister);
  const breakingRegister = existsSync(breakingRegisterPath)
    ? JSON.parse(readFileSync(breakingRegisterPath, 'utf8')) : null;
  const vfDir = join(root, 'docs/release/visual-fixes');
  const visualFixes = existsSync(vfDir)
    ? readdirSync(vfDir).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(join(vfDir, f), 'utf8')))
    : [];
  const changeClassPath = arg('--change-class', join(root, '.artifacts/plat/change-class.json'));
  const changeClass = existsSync(changeClassPath) ? JSON.parse(readFileSync(changeClassPath, 'utf8')) : null;
  const version = tag ? tag.replace(/^v/, '') : '5.0.0';
  const text = renderNotes({ version, claims: loadClaims(claimsDir), capabilityLedger,
    breakingRegister, changesets: loadChangesets(join(root, '.changeset')),
    commitSubjects, changeClass, visualFixes });
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
