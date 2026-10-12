#!/usr/bin/env node
/* scripts/release/release-notes.mjs — REQ-PLAT-32 (PLAT-203). Assembles the
   5.0.0 notes skeleton under docs/release/notes/5.0.0.md in the fixed heading
   order: Breaking -> Deprecated -> Added -> Fixed -> Visual bug fixes ->
   Security. Any dependency floor claims land FIRST inside Breaking (the deps
   codemod handles them). Counts are claims-sourced: each claims-*.md file
   contributes its declared numbers verbatim — no re-derivation. Sources:
   Deprecated = deprecation fragments with `since` == version; Added = commits,
   changesets and SURF's "New capability" file (REQ-SURF-182: the output of
   `verify-capability-ledger.mjs --report release-notes --out`, never the
   ledger itself); Visual bug fixes = docs/release/visual-fixes/*.json plus
   change-class.json; Security = `## Advisories` bullets of
   docs/claims/claims-security.md plus fragments with exception 'security'.

     node scripts/release/release-notes.mjs [--claims-dir docs/claims]
            [--new-capability .artifacts/surf/ledger/new-capability.md]
            [--out docs/release/notes/5.0.0.md] [--check]
            [--tag vX.Y.Z] [--line 4x|5x] [--since <ref>]

   REQ-PLAT-16: `--tag` sets the version; `--line 4x` renders the 4.x notes
   (CHANGELOG.md section + deprecations added in that version + commits since
   the previous same-major tag) instead of the 5.0.0 skeleton.
   REQ-PLAT-56: on the 4x line the notes open with the dependencies that moved
   to peers since the previous tag (package.json diff), each tied to its
   kind:'dependency' DEP entry; a moved package without one fails closed.
   REQ-PLAT-35: a 4.x minor's notes carry the downstream-grep record
   (docs/release/decisions/downstream-X.Y.0.json); in the tag pipeline of
   that tag a missing record exits 1.                                      */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { relPaths } from './lib/policy.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
export const HEADINGS = ['Breaking', 'Deprecated', 'Added', 'Fixed', 'Visual bug fixes', 'Security'];
/** Output of `verify-capability-ledger.mjs --report release-notes --out`. */
export const NEW_CAPABILITY_REL = '.artifacts/surf/ledger/new-capability.md';
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

/** REQ-PLAT-20: docs/release/visual-fixes/<slug>.json records
 *  `{ id, cells[], compositeArtifact, measuredContrast?[] }`, sorted by slug. */
export function loadVisualFixes(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.json')).sort().map((f) => {
    let rec;
    try { rec = JSON.parse(readFileSync(join(dir, f), 'utf8')); } catch (e) {
      throw new Error(`release-notes: docs/release/visual-fixes/${f} is not JSON (${String(e?.message ?? e).split('\n')[0]})`);
    }
    return { slug: f.replace(/\.json$/, ''), ...rec };
  });
}

/** Bullets under `## Advisories` in the security claims file, verbatim. */
export function securityAdvisories(text) {
  const m = String(text ?? '').match(/^## Advisories\n([\s\S]*?)(?=^##\s|(?![\s\S]))/m);
  return m ? m[1].split('\n').filter((l) => /^\s*-\s+\S/.test(l)).map((l) => l.trim()) : [];
}

/** SURF's `--report release-notes --out` output (REQ-SURF-182): its
 *  `## New capability (<v>)` heading becomes a `###` under Added. */
export function newCapabilityLines(text) {
  if (text == null) return [];
  const out = String(text).trimEnd().split('\n').map((l) => l.replace(/^## /, '### '));
  if (!out.some((l) => /^\s*-\s+\S/.test(l))) out.push('', 'No capability-ledger row is delivered in this release.');
  return out;
}

const depSubject = (d) => [d.kind, d.entry, d.symbol ?? d.component ?? d.prop ?? d.selector]
  .filter(Boolean).join(' ');

export function renderNotes({ version = '5.0.0', claims = {}, breakingRegister = null,
  changesets = [], commitSubjects = [], changeClass = null, deprecations = [],
  visualFixes = [], newCapability = null } = {}) {
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
  // The deprecation fragments are the source: every entry whose `since` is
  // this version, with its removal version and message.
  const added = deprecations.filter((d) => d.since === version)
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
  for (const d of added) {
    lines.push(`- \`${d.id}\` (${depSubject(d)}, removed in ${d.removeIn ?? 'n/a'}): ${d.message ?? ''}`.trimEnd());
  }
  if (!added.length) lines.push(`No deprecation entry has \`since: '${version}'\`.`);
  lines.push('', 'All 4.x deprecations and the new 5.x deprecation entries are listed in the',
    'generated guide (`apps/docs/generated/migration/deprecations.md` in a release',
    'build). Runtime warnings name the codemod that performs the change.', '');
  const secs = commitsToSections(commitSubjects);
  for (const s of secs.Deprecated) lines.push(s);
  if (secs.Deprecated.length) lines.push('');
  lines.push('## Added', '');
  lines.push('- `aura-glass/compat` adapters for every deprecated component export.');
  lines.push('- `@auraglass/cli` with `migrate 4to5` (codemod transforms; see the removal train).');
  for (const s of secs.Added) lines.push(s);
  for (const cs of changesets.filter((c) => c.bumps.length))
    lines.push(`- ${cs.body.split('\n')[0]} (.changeset/${cs.file})`);
  const cap = newCapabilityLines(newCapability);
  if (cap.length) lines.push('', ...cap);
  lines.push('', '## Fixed', '');
  if (secs.Fixed.length) for (const s of secs.Fixed) lines.push(s);
  else lines.push('No fix commit in the range.');
  lines.push('');
  lines.push('## Visual bug fixes', '');
  const vf = [
    ...visualFixes.map((v) => {
      const cells = Array.isArray(v.cells) ? v.cells.length : 0;
      const link = v.compositeArtifact ? ` — [composite](${v.compositeArtifact})` : '';
      return `- \`${v.id}\` (\`docs/release/visual-fixes/${v.slug}.json\`, ${cells} cell${cells === 1 ? '' : 's'})${link}`;
    }),
    ...(changeClass?.visualFixes ?? changeClass?.visual ?? []).map((v) =>
      `- ${v.title ?? v.id}${v.pr ? ` (PR #${v.pr})` : ''}${v.compositeArtifact ? ` — [composite](${v.compositeArtifact})` : ''}`),
  ];
  if (vf.length) lines.push(...vf);
  else lines.push('No visual-fix record (`docs/release/visual-fixes/*.json`) and no C-I-VF change in this release.');
  lines.push('');
  lines.push('## Security', '');
  const sec = [
    ...securityAdvisories(claims.security),
    ...deprecations.filter((d) => d.exception === 'security' && d.since === version)
      .sort((a, b) => String(a.id).localeCompare(String(b.id)))
      .map((d) => `- \`${d.id}\` (${depSubject(d)}, security exception): ${d.message ?? ''}`.trimEnd()),
  ];
  if (sec.length) lines.push(...sec);
  else lines.push('No security advisory and no security-exception deprecation in this release.');
  lines.push('', 'Supported versions and reporting: `SECURITY.md`.', '');
  return lines.join('\n');
}

// ---------------------------------------------------------------- 4.x line
// REQ-PLAT-16: a 4.x tag (`--line 4x`) gets 4.x notes — the CHANGELOG.md
// section of that version plus the deprecations whose `since` is that version.
// The 5.0.0 skeleton above (dependency floors, compat/migrate entry points)
// never appears in a 4.x release.

const SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/;
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

/** DEP `since` values that may announce a dependency moved in the range
 *  previous..version: any version above the previous tag up to this one. The
 *  range spans more than one minor only when a minor in between has no tag in
 *  the clone (a 4.3.0 render before v4.2.0 exists); then the 4.2.0 entries
 *  are the right ones. A non-semver --since base allows `since == version`
 *  only. */
export function depWindow(previous, version) {
  const lo = previous ? parseSemver(previous) : null;
  const fn = (since) => {
    if (!since || !parseSemver(since)) return false;
    if (!lo) return since === version;
    return compareSemver(since, lo) > 0 && compareSemver(since, version) <= 0;
  };
  fn.label = lo ? `in (${String(previous).replace(/^v/, '')}, ${version}]` : `== ${version}`;
  return fn;
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
  const inWindow = depWindow(previous, version);
  const rows = moved.map((m) => {
    const dep = deprecations.find((d) => d.kind === 'dependency' && d.symbol === m.name && inWindow(d.since));
    if (!dep) missing.push(m.name);
    return { ...m, dep };
  });
  if (missing.length) {
    // G-07: every 4.2 install-level change ships with a DEP entry and a dev warning.
    throw new Error(`release-notes: moved dependencies without a kind:'dependency' DEP entry with since ${inWindow.label}: ${missing.join(', ')}`);
  }
  lines.push(`These packages were \`dependencies\` in ${previous} and are now`,
    '`peerDependencies`; npm no longer installs them for you. Install the ones',
    'whose feature you use. Without the package, the feature throws at call',
    'time; importing `aura-glass` itself does not.', '',
    '| Package | Range in ' + previous + ' | Peer range | Optional | Deprecation |', '| --- | --- | --- | --- | --- |');
  for (const r of rows) {
    const since = r.dep.since === version ? '' : `since ${r.dep.since}, `;
    lines.push(`| \`${r.name}\` | \`${r.from}\` | \`${r.to}\` | ${r.optional ? 'yes' : 'no'} | \`${r.dep.id}\` (${since}removed in ${r.dep.removeIn ?? 'n/a'}) |`);
  }
  lines.push('');
  return { lines, ids: new Set(rows.map((r) => r.dep.id)) };
}

/** REQ-PLAT-35 / REQ-FIN-113: path of the operator's downstream-grep record
 *  for a 4.x minor (OP-2 writes it at the cut). */
export const downstreamRecordPath = (version) => `docs/release/decisions/downstream-${version}.json`;

/** The record section of a 4.x minor's notes: per-root status and hit counts,
 *  plus the record's sha256 so the attached file can be matched to the notes.
 *  `record` is { text } when the file exists, null when it does not. */
export function downstreamSection({ version, record }) {
  const path = downstreamRecordPath(version);
  const lines = ['## Downstream grep record', ''];
  if (!record) {
    lines.push(`_Not committed yet: \`${path}\` (operator run OP-2 at the cut). The tag pipeline refuses to render these notes without it._`, '');
    return lines;
  }
  let report;
  try { report = JSON.parse(record.text); } catch (e) {
    throw new Error(`release-notes: ${path} is not JSON (${String(e?.message ?? e).split('\n')[0]})`);
  }
  const roots = Array.isArray(report?.roots) ? report.roots : null;
  if (!roots || !roots.length) throw new Error(`release-notes: ${path} has no roots`);
  const n = (x) => (Array.isArray(x) ? x.length : 0);
  lines.push(`Attached record: \`${path}\` (sha256 \`${createHash('sha256').update(record.text).digest('hex')}\`).`, '',
    '| Root | Status | Pins | Imports | Removed-symbol hits |', '| --- | --- | --- | --- | --- |');
  for (const r of roots) {
    lines.push(`| \`${r.root}\` | ${r.status ?? 'unknown'} | ${n(r.pins)} | ${n(r.imports)} | ${n(r.removedSymbolHits)} |`);
  }
  lines.push('');
  return lines;
}

/** docs/security/advisories/*.md drafts: title (first heading or **Title:**)
 *  and the `**Patched in:** X` version, sorted by file name. */
export function loadAdvisories(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.md')).sort().map((f) => {
    const text = readFileSync(join(dir, f), 'utf8');
    const title = (text.match(/^\*\*Title:\*\*\s*(.+)$/m) ?? text.match(/^#\s+(.+)$/m))?.[1]?.trim() ?? f;
    const patched = text.match(/\*\*Patched in:\*\*\s*v?([0-9][\w.-]*)/)?.[1]?.replace(/\.$/, '') ?? null;
    return { file: `docs/security/advisories/${f}`, title, patched };
  });
}

/** REQ-PLAT-32 / REQ-PLAT-52 (4x): every deprecation entry of this version that
 *  carries an `exception` (security, privacy, crash, legal, honesty) plus the
 *  advisories patched in this version. */
export function securitySection4x({ version, deprecations = [], advisories = [] }) {
  const lines = ['## Security and privacy', ''];
  const adv = advisories.filter((a) => a.patched === version);
  for (const a of adv) lines.push(`- Advisory: ${a.title} (\`${a.file}\`)`);
  const exc = deprecations.filter((d) => d.since === version && d.exception)
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
  for (const d of exc) {
    lines.push(`- \`${d.id}\` (${d.exception}; ${depSubject(d)}): ${d.message ?? ''}`.trimEnd());
  }
  if (!adv.length && !exc.length) {
    lines.push(`No advisory is patched in ${version} and no deprecation entry of ${version} carries an exception.`);
  }
  lines.push('');
  return lines;
}

export function renderNotes4x({ version, changelog, deprecations = [], commitSubjects = [],
  previous = null, rangeError = null, moved = undefined, downstream = undefined, advisories = [] } = {}) {
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
  if (downstream !== undefined) lines.push(...downstreamSection({ version, record: downstream }));
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
  lines.push(...securitySection4x({ version, deprecations, advisories }));
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

export async function main(argv = process.argv.slice(2), { root = ROOT, env = process.env } = {}) {
  const arg = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
  const claimsDir = arg('--claims-dir', join(root, 'docs/claims'));
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
    // A 4.x minor (X.Y.0) carries the operator's downstream-grep record. In the
    // tag pipeline for that tag (CI_COMMIT_TAG === --tag) a missing record
    // fails the job; anywhere else the notes say it is not committed yet.
    let downstream;
    const sv = parseSemver(version);
    if (sv.patch === 0 && !sv.pre.length) {
      const recPath = join(root, downstreamRecordPath(version));
      downstream = existsSync(recPath) ? { text: readFileSync(recPath, 'utf8') } : null;
      if (!downstream && tag && env.CI_COMMIT_TAG === tag) {
        console.error(`FAIL release-notes: ${downstreamRecordPath(version)} is required for ${tag} (OP-2 downstream grep at the cut)`);
        return 1;
      }
    }
    text = renderNotes4x({ version, changelog, deprecations: await loadEntries(root),
      commitSubjects, previous, rangeError, moved, downstream,
      advisories: loadAdvisories(join(root, 'docs/security/advisories')) });
  } else {
    const { breakingRegister: brPath } = relPaths(root);
    const breakingRegister = existsSync(brPath) ? JSON.parse(readFileSync(brPath, 'utf8')) : null;
    const changeClassPath = arg('--change-class', join(root, '.artifacts/plat/change-class.json'));
    const changeClass = existsSync(changeClassPath) ? JSON.parse(readFileSync(changeClassPath, 'utf8')) : null;
    // REQ-SURF-182 seam: SURF's ledger verifier writes the "New capability"
    // section (`--report release-notes --version <v> --out`); PLAT reads that
    // file and never the ledger rows. The tag pipeline of this tag requires it.
    const capPath = arg('--new-capability', join(root, NEW_CAPABILITY_REL));
    const newCapability = existsSync(capPath) ? readFileSync(capPath, 'utf8') : null;
    if (newCapability == null) {
      if (tag && env.CI_COMMIT_TAG === tag) {
        console.error(`FAIL release-notes: ${NEW_CAPABILITY_REL} is required for ${tag} (node scripts/surf/verify-capability-ledger.mjs --report release-notes --version ${version} --out)`);
        return 1;
      }
      console.error(`release-notes: ${NEW_CAPABILITY_REL} not found; the New capability section is omitted`);
    }
    const { loadEntries } = await import('./gen-deprecations.mjs');
    text = renderNotes({ version, claims: loadClaims(claimsDir), breakingRegister,
      changesets: loadChangesets(join(root, '.changeset')), commitSubjects, changeClass,
      deprecations: await loadEntries(root),
      visualFixes: loadVisualFixes(join(root, 'docs/release/visual-fixes')), newCapability });
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
