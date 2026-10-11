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
            [--tag vX.Y.Z] [--line 4x|5x] [--since <ref>]

   REQ-PLAT-16: `--tag` sets the version; `--line 4x` renders the 4.x notes
   (CHANGELOG.md section + deprecations added in that version + commits since
   the previous same-major tag) instead of the 5.0.0 skeleton.
   REQ-PLAT-56: on the 4x line the notes open with the dependencies that moved
   to peers since the previous tag (package.json diff), each tied to its
   kind:'dependency' DEP entry; a moved package without one fails closed.  */
import { execFileSync } from 'node:child_process';
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

// ---------------------------------------------------------------- 4.x line
// REQ-PLAT-16: a 4.x tag (`--line 4x`) gets 4.x notes — the CHANGELOG.md
// section of that version plus the deprecations whose `since` is that version.
// The 5.0.0 skeleton above (dependency floors, compat/migrate entry points)
// never appears in a 4.x release.

const SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;
export function parseSemver(v) {
  const m = SEMVER.exec(String(v).replace(/^v/, ''));
  if (!m) return null;
  return { major: +m[1], minor: +m[2], patch: +m[3], pre: m[4] ? m[4].split('.') : [] };
}
export function compareSemver(a, b) {
  const x = typeof a === 'string' ? parseSemver(a) : a;
  const y = typeof b === 'string' ? parseSemver(b) : b;
  for (const k of ['major', 'minor', 'patch']) if (x[k] !== y[k]) return x[k] - y[k];
  if (!x.pre.length || !y.pre.length) return y.pre.length - x.pre.length;
  for (let i = 0; i < Math.max(x.pre.length, y.pre.length); i++) {
    const p = x.pre[i]; const q = y.pre[i];
    if (p === undefined) return -1;
    if (q === undefined) return 1;
    const pn = /^\d+$/.test(p); const qn = /^\d+$/.test(q);
    if (pn && qn) { if (+p !== +q) return +p - +q; continue; }
    if (pn !== qn) return pn ? -1 : 1;
    if (p !== q) return p < q ? -1 : 1;
  }
  return 0;
}

/** Previous release tag: the highest `v*` semver tag below `version`; on the
 *  4x line restricted to the same major, so a 5.x prerelease tag never becomes
 *  the base of a 4.x range. */
export function previousTag(tags, version, line) {
  const cur = parseSemver(version);
  if (!cur) throw new Error(`release-notes: '${version}' is not a semver version`);
  return tags
    .map((t) => ({ t, v: parseSemver(t) }))
    .filter(({ t, v }) => /^v/.test(t) && v && compareSemver(v, cur) < 0
      && (line !== '4x' || v.major === cur.major))
    .sort((a, b) => compareSemver(b.v, a.v))[0]?.t ?? null;
}

/** Body of `## [<version>]` in CHANGELOG.md (up to the next `## ` or `# `). */
export function changelogSection(text, version) {
  const lines = String(text).split('\n');
  const esc = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const start = lines.findIndex((l) => new RegExp(`^## \\[${esc}\\](\\s|$)`).test(l));
  if (start < 0) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) if (/^#{1,2} /.test(lines[i])) { end = i; break; }
  return { heading: lines[start], body: lines.slice(start + 1, end).join('\n').trim() };
}

/** REQ-PLAT-56: packages that were in `dependencies` at the previous tag and
 *  are a peer (not a dependency) at HEAD. Derived from the two package.json
 *  files, never from a hand-kept list. */
export function movedDependencies(prevPkg, curPkg) {
  const prevDeps = prevPkg?.dependencies ?? {};
  const curDeps = curPkg?.dependencies ?? {};
  const peers = curPkg?.peerDependencies ?? {};
  const meta = curPkg?.peerDependenciesMeta ?? {};
  return Object.keys(prevDeps)
    .filter((name) => !(name in curDeps) && name in peers)
    .sort()
    .map((name) => ({ name, from: prevDeps[name], to: peers[name], optional: meta[name]?.optional === true }));
}

function movedDependencySection({ moved, deprecations, previous, version }) {
  const lines = ['## Moved dependencies (install them yourself)', ''];
  if (moved === null) {
    lines.push(`_Moved dependencies unavailable: no package.json at a previous ${parseSemver(version).major}.x tag in the clone._`, '');
    return { lines, ids: new Set() };
  }
  if (!moved.length) {
    lines.push(`No package moved from \`dependencies\` to \`peerDependencies\` since ${previous}.`, '');
    return { lines, ids: new Set() };
  }
  const missing = [];
  const rows = moved.map((m) => {
    const dep = deprecations.find((d) => d.kind === 'dependency' && d.symbol === m.name && d.since === version);
    if (!dep) missing.push(m.name);
    return { ...m, dep };
  });
  if (missing.length) {
    // G-07: every 4.2 install-level change ships with a DEP entry and a dev warning.
    throw new Error(`release-notes: moved dependencies without a kind:'dependency' DEP entry since ${version}: ${missing.join(', ')}`);
  }
  lines.push(`These packages were \`dependencies\` in ${previous} and are now`,
    '`peerDependencies`; npm no longer installs them for you. Install the ones',
    'whose feature you use. Without the package, the feature throws at call',
    'time; importing `aura-glass` itself does not.', '',
    '| Package | Range in ' + previous + ' | Peer range | Optional | Deprecation |', '| --- | --- | --- | --- | --- |');
  for (const r of rows) {
    lines.push(`| \`${r.name}\` | \`${r.from}\` | \`${r.to}\` | ${r.optional ? 'yes' : 'no'} | \`${r.dep.id}\` (removed in ${r.dep.removeIn ?? 'n/a'}) |`);
  }
  lines.push('');
  return { lines, ids: new Set(rows.map((r) => r.dep.id)) };
}

export function renderNotes4x({ version, changelog, deprecations = [], commitSubjects = [],
  previous = null, rangeError = null, moved = undefined } = {}) {
  const v = parseSemver(version);
  if (!v || v.major !== 4) throw new Error(`release-notes: --line 4x needs a 4.x version, got '${version}'`);
  const section = changelogSection(changelog ?? '', version);
  if (!section || !section.body) {
    throw new Error(`release-notes: CHANGELOG.md has no non-empty '## [${version}]' section`);
  }
  const lines = [`# aura-glass ${version} release notes`, ''];
  // Moved dependencies come first: they are the one change in a 4.x minor
  // that breaks an install without a code change (PLAT-56).
  let shown = new Set();
  if (moved !== undefined) {
    const s = movedDependencySection({ moved, deprecations, previous, version });
    lines.push(...s.lines);
    shown = s.ids;
  }
  lines.push('## Changelog', '', `From \`CHANGELOG.md\` \`${section.heading.replace(/^## /, '')}\`.`, '',
    section.body, '');
  lines.push('## Deprecations added', '');
  if (shown.size) lines.push(`The ${shown.size} dependency entries are in the table above.`, '');
  const added = deprecations.filter((d) => d.since === version && !shown.has(d.id))
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
  if (added.length) {
    for (const d of added) {
      const subject = [d.kind, d.entry, d.symbol ?? d.component ?? d.prop ?? d.selector]
        .filter(Boolean).join(' ');
      lines.push(`- \`${d.id}\` (${subject}, removed in ${d.removeIn ?? 'n/a'}): ${d.message ?? ''}`.trimEnd());
    }
  } else if (!shown.size) {
    lines.push(`No deprecation entry has \`since: '${version}'\`.`);
  }
  lines.push('');
  lines.push(`## Commits${previous ? ` since ${previous}` : ''}`, '');
  if (rangeError) {
    lines.push(`_Commit range unavailable: ${rangeError}._`);
  } else {
    const secs = commitsToSections(commitSubjects);
    const order = ['Breaking', 'Deprecated', 'Added', 'Fixed'];
    let any = false;
    for (const h of order) {
      if (!secs[h].length) continue;
      any = true;
      lines.push(`### ${h}`, '', ...secs[h], '');
    }
    if (!any) lines.push('_No user-facing conventional commits in the range._');
  }
  lines.push('');
  return lines.join('\n');
}

function commitRange({ root, since, tag, version, line }) {
  if (since) return { range: `${since}..HEAD`, previous: since };
  if (!tag) return { range: null, previous: null };
  const tags = execFileSync('git', ['tag', '-l', 'v*'], { cwd: root, encoding: 'utf8' })
    .split('\n').filter(Boolean);
  const previous = previousTag(tags, version, line);
  if (!previous) throw new Error(`no earlier ${line === '4x' ? `v${parseSemver(version).major}.*` : 'v*'} tag in the clone`);
  return { range: `${previous}..HEAD`, previous };
}

export async function main(argv = process.argv.slice(2), { root = ROOT } = {}) {
  const arg = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
  const claimsDir = arg('--claims-dir', join(root, 'docs/claims'));
  const ledgerPath = arg('--capability-ledger', PATHS.capabilityLedger);
  // --tag <vX.Y.Z>: version from the tag, subjects since the previous tag of
  // the line; --line <4x|5x> selects the 4.x or 5.x notes; --since overrides
  // the range.
  const tag = arg('--tag');
  const line = arg('--line', '5x');
  if (line !== '4x' && line !== '5x') {
    console.error(`FAIL release-notes: --line must be 4x or 5x, got '${line}'`);
    return 1;
  }
  const since = arg('--since');
  const version = tag ? tag.replace(/^v/, '')
    : line === '4x' ? JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version : '5.0.0';
  if (!parseSemver(version)) { console.error(`FAIL release-notes: '${tag}' is not a vX.Y.Z tag`); return 1; }
  const out = arg('--out', join(root, `docs/release/notes/${version}.md`));
  let commitSubjects = [];
  let previous = null;
  let rangeError = null;
  try {
    const r = commitRange({ root, since, tag, version, line });
    previous = r.previous;
    if (r.range) commitSubjects = execFileSync('git', ['log', '--no-merges', r.range, '--format=%s'],
      { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
  } catch (e) {
    // Shallow/young history: the notes say so instead of silently listing nothing.
    rangeError = String(e?.message ?? e).split('\n')[0];
    console.error(`release-notes: commit range unavailable (${rangeError})`);
  }
  let text;
  if (line === '4x') {
    const changelogPath = join(root, 'CHANGELOG.md');
    const changelog = existsSync(changelogPath) ? readFileSync(changelogPath, 'utf8') : '';
    const { loadEntries } = await import('./gen-deprecations.mjs');
    // Moved dependencies: package.json at the previous tag vs the working tree.
    let moved = null;
    if (previous) {
      try {
        const prevPkg = JSON.parse(execFileSync('git', ['show', `${previous}:package.json`],
          { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
        moved = movedDependencies(prevPkg, JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')));
      } catch (e) {
        console.error(`release-notes: package.json at ${previous} unavailable (${String(e?.message ?? e).split('\n')[0]})`);
      }
    }
    text = renderNotes4x({ version, changelog, deprecations: await loadEntries(root),
      commitSubjects, previous, rangeError, moved });
  } else {
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
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, text);
  console.log(`release-notes: wrote ${out}`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().then((code) => process.exit(code), (e) => { console.error(e); process.exit(1); });
}
