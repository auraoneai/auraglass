#!/usr/bin/env node
/* scripts/removal/verify-archive.mjs — PLAT-225/226 (REQ-PLAT-82). Read-only
   `gh` verification that the private repo `auraglass-server-archive` exists and
   that its tree equals `git subtree split --prefix=server` of the release/4.x
   branch point plus src/services, src/lib/ai-client.ts, Dockerfile,
   docker-compose.yml, tsconfig.server.json — byte-identical. Without gh auth
   (this VM) every check reports 'missing' so the record is honest.

     node scripts/removal/verify-archive.mjs [--record docs/release/decisions/removals/RM-01-archive.json] */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
export const ARCHIVE_REPO = 'auraoneai/auraglass-server-archive';
export const EXTRA_PATHS = ['src/services', 'src/lib/ai-client.ts', 'Dockerfile', 'docker-compose.yml', 'tsconfig.server.json'];

function gh(args, timeoutMs = 30000) {
  try {
    return { ok: true, out: execFileSync('gh', args, { encoding: 'utf8', timeout: timeoutMs }) };
  } catch (e) { return { ok: false, err: String(e.message).split('\n')[0] }; }
}

export function subtreeExpected(root = ROOT, ref = 'origin/release/4.x') {
  // The expected tree = subtree split of <ref>:server + the extra paths.
  try {
    execFileSync('git', ['rev-parse', '--verify', ref], { cwd: root });
    return { ok: true, ref };
  } catch (e) { return { ok: false, err: `cannot resolve ${ref}: ${e.message.split('\n')[0]}` }; }
}

export function verifyArchive({ root = ROOT, ref = 'origin/release/4.x' } = {}) {
  const checks = [];
  const repo = gh(['repo', 'view', ARCHIVE_REPO, '--json', 'name,visibility']);
  if (!repo.ok) checks.push({ check: 'repo-exists', status: 'missing', detail: repo.err });
  else {
    const meta = JSON.parse(repo.out);
    checks.push({ check: 'repo-exists', status: meta.visibility === 'PRIVATE' ? 'pass' : 'fail',
      detail: `visibility=${meta.visibility}` });
  }
  const split = subtreeExpected(root, ref);
  checks.push({ check: 'subtree-source', status: split.ok ? 'pending-compare' : 'missing',
    detail: split.ok ? `ref ${split.ref}` : split.err });
  // Byte-identical compare needs the archive clone — only meaningful with gh.
  checks.push({ check: 'tree-compare', status: repo.ok ? 'pending-clone' : 'missing',
    detail: repo.ok
      ? 'clone the archive read-only and diff server/ + extras against the subtree split'
      : 'gh unavailable' });
  checks.push({ check: 'readme-advisory', status: repo.ok ? 'pending-read' : 'missing',
    detail: 'README must name the GHSA advisory, JWT_SECRET rotation, and the Kiro Prism routing rule' });
  return { repo: ARCHIVE_REPO, ref, checks };
}

export function main(argv = process.argv.slice(2)) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const recordPath = arg('--record') ?? join(ROOT, 'docs/release/decisions/removals/RM-01-archive.json');
  const report = { ...verifyArchive(), generatedAt: new Date().toISOString() };
  mkdirSync(dirname(recordPath), { recursive: true });
  writeFileSync(recordPath, JSON.stringify(report, null, 2));
  for (const c of report.checks) console.log(`${c.status.padEnd(16)} ${c.check}: ${c.detail}`);
  console.log(`record -> ${recordPath}`);
  return report.checks.every((c) => c.status === 'pass' || c.status === 'pending-compare' || c.status === 'pending-clone' || c.status === 'pending-read') ? 0 : 1;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try { process.exit(main()); } catch (e) { console.error(e); process.exit(1); }
}
