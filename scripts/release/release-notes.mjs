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
            [--out docs/release/notes/5.0.0.md] [--check]
            [--tag vX.Y.Z[-pre.N]] [--line 4x|5x] [--since <ref>]

   --tag sets the version (header and inputs) and collects the conventional-commit
   subjects since the previous tag of the same major (REQ-PLAT-16). --line 5x
   renders the 5.0 notes structure; --line 4x renders the 4.x variant: the
   CHANGELOG.md `## [X.Y.Z]` section of the tag, then the deprecations whose
   `since` is that version (from deprecations.json). Without --line the line
   follows the tag's major.                                                    */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cmpSemver, parseSemver } from './dist-tag.mjs';
import { relPaths } from './lib/policy.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
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
  breakingRegister = null, changesets = [], commitSubjects = [], changeClass = null } = {}) {
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
  } else {
    lines.push('_Entries come from `docs/release/visual-fixes/*.json` records (change class C-I-VF)._');
  }
  lines.push('');
  lines.push('## Security', '');
  lines.push('_Sourced from the security claims file; see SECURITY.md for the support policy._', '');
  return lines.join('\n');
}

// The body of CHANGELOG.md's `## [version]` section (up to the next `## [` or `# `).
export function changelogSection(text, version) {
  const lines = String(text).split('\n');
  const head = lines.findIndex((l) => {
    const m = /^##\s*\[v?([^\]]+)\]/.exec(l);
    return m && m[1].trim() === version;
  });
  if (head < 0) return null;
  let end = lines.length;
  for (let i = head + 1; i < lines.length; i++) {
    if (/^##\s*\[/.test(lines[i]) || /^#\s/.test(lines[i])) { end = i; break; }
  }
  return lines.slice(head + 1, end).join('\n').trim();
}

// 4.x variant (REQ-PLAT-16): changelog section + deprecations added in this version.
export function renderNotes4x({ version, changelog = '', deprecations = null } = {}) {
  const section = changelogSection(changelog, version);
  if (section == null) throw new Error(`release-notes: CHANGELOG.md has no ## [${version}] section`);
  if (!deprecations || !Array.isArray(deprecations.entries)) {
    throw new Error('release-notes: deprecations.json (entries[]) is required for the 4.x notes');
  }
  const added = deprecations.entries
    .filter((e) => e.since === version)
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const lines = [`# aura-glass ${version} release notes`, '', section, '', `## Deprecations added in ${version}`, ''];
  if (added.length) {
    for (const e of added) {
      const what = e.entry ? `${e.entry}${e.symbol && e.symbol !== '*' ? ` \`${e.symbol}\`` : ''}` : `\`${e.symbol ?? e.id}\``;
      lines.push(`- **${e.id}** (${e.kind}, removed in ${e.removeIn}): ${what}${e.replacement ? ` → ${e.replacement}` : ''}`);
    }
  } else {
    lines.push(`_No deprecation entry has \`since: ${version}\`._`);
  }
  lines.push('');
  return lines.join('\n');
}

// Previous release tag of the same major, semver-lower than `tag`.
export function previousTag(tags, tag) {
  const cur = parseSemver(tag);
  if (!cur) return null;
  return (
    tags
      .filter((t) => t !== tag && parseSemver(t)?.major === cur.major && cmpSemver(t, tag) < 0)
      .sort((a, b) => cmpSemver(b, a))[0] ?? null
  );
}

export function main(argv = process.argv.slice(2), { root = ROOT } = {}) {
  const arg = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
  const claimsDir = arg('--claims-dir', join(root, 'docs/claims'));
  const PATHS = relPaths(root);
  const ledgerPath = arg('--capability-ledger', PATHS.capabilityLedger);
  const out = arg('--out', join(root, 'docs/release/notes/5.0.0.md'));
  const tag = arg('--tag');
  if (tag != null && !parseSemver(tag)) throw new Error(`release-notes: --tag ${tag} is not semver`);
  const version = tag ? tag.replace(/^v/, '') : '5.0.0';
  const line = arg('--line', null) ?? (parseSemver(version).major === 4 ? '4x' : '5x');
  if (line !== '4x' && line !== '5x') throw new Error(`release-notes: --line must be 4x or 5x, got ${line}`);
  const since = arg('--since');

  let text;
  if (line === '4x') {
    const changelogPath = join(root, 'CHANGELOG.md');
    const depPath = join(root, 'deprecations.json');
    text = renderNotes4x({
      version,
      changelog: existsSync(changelogPath) ? readFileSync(changelogPath, 'utf8') : '',
      deprecations: existsSync(depPath) ? JSON.parse(readFileSync(depPath, 'utf8')) : null,
    });
  } else {
    let commitSubjects = [];
    let range = null;
    if (since) range = `${since}..HEAD`;
    else if (tag) {
      const tags = execFileSync('git', ['tag', '--list', 'v*'], { cwd: root, encoding: 'utf8' })
        .split('\n').filter(Boolean);
      const prev = previousTag(tags, tag);
      if (prev) range = `${prev}..HEAD`;
    }
    if (range) {
      commitSubjects = execFileSync('git', ['log', range, '--no-merges', '--format=%s'],
        { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
    }
    const capabilityLedger = existsSync(ledgerPath) ? JSON.parse(readFileSync(ledgerPath, 'utf8')) : null;
    const breakingRegister = existsSync(PATHS.breakingRegister)
      ? JSON.parse(readFileSync(PATHS.breakingRegister, 'utf8')) : null;
    const changeClassPath = arg('--change-class', join(root, '.artifacts/plat/change-class.json'));
    const changeClass = existsSync(changeClassPath) ? JSON.parse(readFileSync(changeClassPath, 'utf8')) : null;
    text = renderNotes({ version, claims: loadClaims(claimsDir), capabilityLedger,
      breakingRegister, changesets: loadChangesets(join(root, '.changeset')),
      commitSubjects, changeClass });
  }
  if (argv.includes('--check')) {
    const existing = existsSync(out) ? readFileSync(out, 'utf8') : null;
    if (existing !== text) { console.error(`FAIL release-notes: ${out} is stale`); return 1; }
    console.log('release-notes: up to date'); return 0;
  }
  writeFileSync(out, text);
  console.log(`release-notes: wrote ${out} (${line}, ${version})`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  // the CLI reads its inputs from the working directory (the CI checkout root)
  try { process.exit(main(process.argv.slice(2), { root: process.cwd() })); } catch (e) { console.error(e); process.exit(1); }
}
