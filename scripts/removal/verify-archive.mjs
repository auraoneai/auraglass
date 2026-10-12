#!/usr/bin/env node
/* scripts/removal/verify-archive.mjs — REQ-PLAT-82 (PLAT-225/226), REQ-FIN-39.
   Read-only verification of the server extraction (OD-21):

   1. GHSA: `docs/release/decisions/removals/RM-01.json` `gate.ghsa.id` is set
      (owner commit) and `gh api repos/auraoneai/auraglass/security-advisories/<id>`
      reports `state: "published"`.
   2. Archive repo: `auraoneai/auraglass-server-archive` exists and is private.
   3. Byte-identical: every file under the archived paths at the release/4.x
      branch point has the same git blob id (= same bytes) at the same path in
      the archive's default branch; no archived file is missing and no file
      other than the archive README.md is extra.
   4. README.md in the archive names the advisory (the GHSA id when known),
      tells deployers to rotate JWT_SECRET, and says future generation features
      route through Kiro Prism in the consuming app, never in the library.

   Archive layout (paths identical to the 4.x branch point, so blob ids compare
   directly; history of server/ is preserved by subtree):
     server/**                       git subtree split --prefix=server <branch point> -b rm01-server
                                     then, in the archive repo: git subtree add --prefix=server <auraglass> rm01-server
     src/services/**, src/lib/ai-client.ts, Dockerfile, docker-compose.yml, tsconfig.server.json
                                     tree copy from the branch point (git archive <bp> -- <paths> | tar -x)
     README.md                       archive README (advisory, JWT_SECRET rotation, Kiro Prism routing)

   The branch point is `git merge-base origin/release/4.x HEAD` (override with
   `--ref <commit>`); CI needs full history of both lines.

     node scripts/removal/verify-archive.mjs            # print the report, exit 0
     node scripts/removal/verify-archive.mjs --verify   # gate: exit 1 unless every check passes or is owner-pending
     node scripts/removal/verify-archive.mjs --verify --strict   # release scope (also AG_SCOPE=release): owner-pending blocks
     node scripts/removal/verify-archive.mjs --write    # operator: also write RM-01-archive.json

   Only read-only `gh api` / `git` calls are made. Any check that cannot be
   performed (no gh auth, repo 404, shallow clone) is reported as `missing`,
   never as a pass. While RM-01.json records no gate.ghsa.id, the `missing`
   GHSA/repo/tree/readme checks are owner-pending (OD-21 default: the RM-01
   record stays `missing`): reported, not failed, outside release scope. */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
export const SOURCE_REPO = 'auraoneai/auraglass';
export const ARCHIVE_REPO = 'auraoneai/auraglass-server-archive';
export const BASE_LINE = 'origin/release/4.x';
export const ARCHIVED_PATHS = ['server', 'src/services', 'src/lib/ai-client.ts', 'Dockerfile', 'docker-compose.yml', 'tsconfig.server.json'];
export const ARCHIVE_README = 'README.md';
const RM01 = 'docs/release/decisions/removals/RM-01.json';
const RECORD = 'docs/release/decisions/removals/RM-01-archive.json';

const firstLine = (e) => String(e?.stderr || e?.message || e).trim().split('\n')[0];

export function defaultRunners(root = ROOT) {
  return {
    git: (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }),
    gh: (args) => execFileSync('gh', args, { encoding: 'utf8', timeout: 60000, maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }),
  };
}

/** Parse `git ls-tree -r` output into Map(path -> {mode, sha}) for blobs. */
export function parseLsTree(out) {
  const files = new Map();
  for (const line of out.split('\n')) {
    if (!line) continue;
    const tab = line.indexOf('\t');
    const [mode, type, sha] = line.slice(0, tab).split(' ');
    if (type === 'blob') files.set(line.slice(tab + 1), { mode, sha });
  }
  return files;
}

export function resolveBranchPoint({ git }, ref = null) {
  try {
    const sha = ref
      ? git(['rev-parse', '--verify', `${ref}^{commit}`]).trim()
      : git(['merge-base', BASE_LINE, 'HEAD']).trim();
    return sha ? { status: 'ok', sha } : { status: 'missing', reason: 'empty branch point' };
  } catch (e) {
    return { status: 'missing', reason: `cannot resolve ${ref ?? `merge-base ${BASE_LINE} HEAD`} (fetch both lines with full history): ${firstLine(e)}` };
  }
}

export function expectedFiles({ git }, sha) {
  return parseLsTree(git(['ls-tree', '-r', '--full-tree', sha, '--', ...ARCHIVED_PATHS]));
}

export function checkGhsa({ gh }, id) {
  if (!id) return { status: 'missing', reason: `no GHSA id recorded in ${RM01} gate.ghsa.id (owner: publish the advisory, then record its id)` };
  if (!/^GHSA(-[23456789cfghjmpqrvwx]{4}){3}$/.test(id)) return { status: 'fail', id, reason: `malformed GHSA id ${id}` };
  try {
    const adv = JSON.parse(gh(['api', `repos/${SOURCE_REPO}/security-advisories/${id}`]));
    return adv.state === 'published'
      ? { status: 'pass', id, url: adv.html_url ?? null, publishedAt: adv.published_at ?? null }
      : { status: 'fail', id, reason: `advisory state ${adv.state} != published` };
  } catch (e) {
    return { status: 'missing', id, reason: `gh api failed: ${firstLine(e)}` };
  }
}

export function checkRepo({ gh }) {
  try {
    const meta = JSON.parse(gh(['api', `repos/${ARCHIVE_REPO}`]));
    if (meta.private !== true) return { status: 'fail', reason: `${ARCHIVE_REPO} is not private (visibility=${meta.visibility})` };
    return { status: 'pass', defaultBranch: meta.default_branch, url: meta.html_url ?? null };
  } catch (e) {
    return { status: 'missing', reason: `gh api repos/${ARCHIVE_REPO} failed: ${firstLine(e)}` };
  }
}

export function archiveTree({ gh }, branch) {
  const t = JSON.parse(gh(['api', `repos/${ARCHIVE_REPO}/git/trees/${encodeURIComponent(branch)}?recursive=1`]));
  if (t.truncated) throw new Error('archive tree listing truncated by the API');
  const files = new Map();
  for (const e of t.tree ?? []) if (e.type === 'blob') files.set(e.path, { mode: e.mode, sha: e.sha });
  return { sha: t.sha, files };
}

/** Pure comparison: every expected path present with the same blob id and
    mode; nothing extra except the archive README. */
export function compareTrees(expected, actual) {
  const missing = [], mismatched = [], extra = [];
  for (const [path, exp] of expected) {
    const got = actual.get(path);
    if (!got) missing.push(path);
    else if (got.sha !== exp.sha || got.mode !== exp.mode) mismatched.push(path);
  }
  for (const path of actual.keys()) if (!expected.has(path) && path !== ARCHIVE_README) extra.push(path);
  const ok = expected.size > 0 && !missing.length && !mismatched.length && !extra.length;
  return {
    status: ok ? 'pass' : 'fail',
    compared: expected.size,
    missing, mismatched, extra,
    ...(expected.size === 0 ? { reason: 'no archived files found at the branch point' } : {}),
  };
}

/** README must state the advisory, JWT_SECRET rotation and Kiro Prism routing. */
export function checkReadmeText(text, ghsaId) {
  if (text == null) return { status: 'fail', reason: `${ARCHIVE_README} missing from the archive` };
  const problems = [];
  if (ghsaId ? !text.includes(ghsaId) : !/\bGHSA-|security advisory/i.test(text)) problems.push(ghsaId ? `does not name ${ghsaId}` : 'does not name the security advisory');
  if (!/JWT_SECRET/.test(text) || !/rotat/i.test(text)) problems.push('does not tell deployers to rotate JWT_SECRET');
  if (!/Kiro Prism/.test(text)) problems.push('does not state that generation routes through Kiro Prism in the consuming app');
  return problems.length ? { status: 'fail', reason: problems.join('; ') } : { status: 'pass' };
}

function readmeFromArchive({ gh }, branch) {
  try {
    const out = gh(['api', `repos/${ARCHIVE_REPO}/contents/${ARCHIVE_README}?ref=${encodeURIComponent(branch)}`, '--jq', '.content']);
    return Buffer.from(out.trim(), 'base64').toString('utf8');
  } catch { return null; }
}

export function verifyArchive({ root = ROOT, runners = defaultRunners(root), ref = null } = {}) {
  const rm01Path = join(root, RM01);
  const rm01 = existsSync(rm01Path) ? JSON.parse(readFileSync(rm01Path, 'utf8')) : {};
  const ghsaId = rm01.gate?.ghsa?.id ?? null;

  const checks = {};
  checks.ghsa = checkGhsa(runners, ghsaId);
  const bp = resolveBranchPoint(runners, ref);
  checks.branchPoint = bp;
  checks.repo = checkRepo(runners);

  if (bp.status !== 'ok') checks.tree = { status: 'missing', reason: 'branch point unresolved' };
  else if (checks.repo.status === 'missing') checks.tree = { status: 'missing', reason: 'archive repo unreachable' };
  else {
    try {
      const expected = expectedFiles(runners, bp.sha);
      const branch = checks.repo.defaultBranch ?? 'main';
      const actual = archiveTree(runners, branch);
      checks.tree = { ...compareTrees(expected, actual.files), archiveTreeSha: actual.sha };
      checks.readme = checkReadmeText(readmeFromArchive(runners, branch), ghsaId);
    } catch (e) {
      checks.tree = { status: 'missing', reason: firstLine(e) };
    }
  }
  if (!checks.readme) checks.readme = { status: 'missing', reason: 'archive repo unreachable' };

  /* OD-21 (PRD-F §5.9): publishing the GHSA and creating the private archive
     are owner-only acts, recorded by the owner in RM-01.json gate.ghsa.id.
     Until that id is recorded, the checks that depend on those acts and could
     not be performed are owner-pending — the PRD default "RM-01 record stays
     `missing`". A `fail` (mismatch, public repo, unpublished advisory) and an
     unresolved branch point are never owner-pending. */
  const ownerPending = !ghsaId;
  if (ownerPending) {
    for (const name of OWNER_CHECKS) if (checks[name].status === 'missing') checks[name].ownerPending = 'OD-21';
  }

  const pass = (c) => c.status === 'pass' || c.status === 'ok';
  return {
    family: 'RM-01',
    sourceRepo: SOURCE_REPO,
    archiveRepo: ARCHIVE_REPO,
    archivedPaths: ARCHIVED_PATHS,
    checks,
    status: Object.values(checks).every(pass) ? 'ok' : 'missing',
    ...(ownerPending ? { ownerPending: { decision: 'OD-21', default: 'RM-01 record stays missing', record: RM01 } } : {}),
  };
}

/** Checks blocked by the OD-21 owner acts (GHSA publication, archive repo). */
export const OWNER_CHECKS = ['ghsa', 'repo', 'tree', 'readme'];

/* CI clones fetch only the pipeline ref, so origin/release/4.x is absent and
   the branch point cannot resolve. Fetch that one line (a read of the remote;
   only the local remote-tracking ref is written). A failure leaves the
   branchPoint check `missing`, which blocks. */
function ensureBaseLine(root) {
  const git = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  try { git(['rev-parse', '--verify', `${BASE_LINE}^{commit}`]); return; } catch { /* fetch below */ }
  try {
    if (git(['rev-parse', '--is-shallow-repository']).trim() === 'true') git(['fetch', '--unshallow', '--no-tags', 'origin']);
    git(['fetch', '--no-tags', 'origin', `+refs/heads/release/4.x:refs/remotes/${BASE_LINE}`]);
  } catch (e) {
    console.error(`verify-archive: could not fetch ${BASE_LINE}: ${firstLine(e)}`);
  }
}

/** GA/release scope asserts the owner acts too (AC-PLAT-32). */
const strictScope = (argv, env) => argv.includes('--strict') || env.AG_SCOPE === 'release';

export function main(argv = process.argv.slice(2), { root = ROOT, runners, env = process.env } = {}) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  if (!runners && !arg('--ref')) ensureBaseLine(root);
  const report = { ...verifyArchive({ root, runners: runners ?? defaultRunners(root), ref: arg('--ref') }), verifiedAt: new Date().toISOString() };
  console.log(JSON.stringify(report, null, 2));
  if (argv.includes('--write')) {
    writeFileSync(join(root, RECORD), JSON.stringify(report, null, 2) + '\n');
    console.error(`verify-archive: wrote ${RECORD} status=${report.status}`);
  }
  if (argv.includes('--verify') && report.status !== 'ok') {
    const strict = strictScope(argv, env);
    const bad = Object.entries(report.checks).filter(([, c]) => c.status !== 'pass' && c.status !== 'ok');
    const pending = strict ? [] : bad.filter(([, c]) => c.ownerPending);
    const blocking = bad.filter((b) => !pending.includes(b));
    for (const [name, c] of pending) console.error(`verify-archive: ${name} owner-pending (${c.ownerPending}: owner publishes the GHSA, creates the private archive and records gate.ghsa.id; default: RM-01 record stays missing): ${c.reason ?? c.status}`);
    for (const [name, c] of blocking) console.error(`verify-archive: ${name} ${c.status}${c.ownerPending ? ` (${c.ownerPending} owner action outstanding at release scope)` : ''}${c.reason ? `: ${c.reason}` : ''}`);
    if (blocking.length) return 1;
    console.error(`verify-archive: owner-pending — ${pending.length} check(s) await OD-21; asserted at release scope (AG_SCOPE=release or --strict)`);
  }
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try { process.exit(main()); } catch (e) { console.error(e); process.exit(1); }
}
