/* @jest-environment node */
/* tests/removal/verify-archive.test.mjs — REQ-PLAT-82 / REQ-FIN-39. Exercises
   scripts/removal/verify-archive.mjs against two real temporary git repos: a
   source repo whose `origin/release/4.x` branch point carries the server
   surface, and an archive repo built from it. The `gh` runner answers the
   read-only REST calls the script makes from the archive repo's real git
   objects, so blob ids are computed by git, not hand-written. */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterAll, describe, expect, it } from '@jest/globals';
import { checkReadmeText, compareTrees, main, parseLsTree, verifyArchive } from '../../scripts/removal/verify-archive.mjs';

const GHSA = 'GHSA-2c4m-x7vq-9fhw';
const README = `# auraglass-server-archive\n\nArchived 4.x server. Security advisory ${GHSA}.\nDeployers must rotate JWT_SECRET.\nFuture generation features route through Kiro Prism in the consuming app, never in the library.\n`;

const tmp = [];
afterAll(() => { for (const d of tmp) rmSync(d, { recursive: true, force: true }); });

function git(cwd, args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@x', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@x' } });
}
function write(dir, files) {
  for (const [p, c] of Object.entries(files)) { mkdirSync(dirname(join(dir, p)), { recursive: true }); writeFileSync(join(dir, p), c); }
}
function repo(files) {
  const dir = mkdtempSync(join(tmpdir(), 'verify-archive-'));
  tmp.push(dir);
  git(dir, ['init', '-q', '-b', 'main']);
  write(dir, files);
  git(dir, ['add', '-A']);
  git(dir, ['commit', '-qm', 'init']);
  return dir;
}

const SERVER = {
  'server/index.ts': 'export const port = 3000;\n',
  'server/api-server.js': 'module.exports = {};\n',
  'server/README.md': '# server\n',
  'src/services/ai/client.ts': 'export {};\n',
  'src/lib/ai-client.ts': 'export const ai = 1;\n',
  Dockerfile: 'FROM node:20\n',
  'docker-compose.yml': 'services: {}\n',
  'tsconfig.server.json': '{}\n',
};

/** Source repo: branch point has the server surface; HEAD (the 5.x line) removed it. */
function sourceRepo() {
  const dir = repo({ ...SERVER, 'src/index.ts': 'export {};\n', 'docs/release/decisions/removals/.keep': '' });
  const bp = git(dir, ['rev-parse', 'HEAD']).trim();
  git(dir, ['update-ref', 'refs/remotes/origin/release/4.x', bp]);
  git(dir, ['rm', '-rq', 'server', 'src/services', 'src/lib', 'Dockerfile', 'docker-compose.yml', 'tsconfig.server.json']);
  git(dir, ['commit', '-qm', 'RM-01']);
  return { dir, bp };
}
function recordGhsa(dir, id) {
  write(dir, { 'docs/release/decisions/removals/RM-01.json': JSON.stringify({ family: 'RM-01', gate: { ghsa: { id } } }) });
}

/** gh double answering only the endpoints the script calls, from a real repo. */
function ghFor({ archiveDir, isPrivate = true, advisoryState = 'published', exists = true }) {
  const calls = [];
  const gh = (args) => {
    calls.push(args.join(' '));
    const ep = args[1];
    if (ep.startsWith('repos/auraoneai/auraglass/security-advisories/')) return JSON.stringify({ state: advisoryState, html_url: 'https://github.com/x' });
    if (!exists) { const e = new Error('HTTP 404: Not Found'); throw e; }
    if (ep === 'repos/auraoneai/auraglass-server-archive') return JSON.stringify({ private: isPrivate, visibility: isPrivate ? 'private' : 'public', default_branch: 'main' });
    if (ep.startsWith('repos/auraoneai/auraglass-server-archive/git/trees/main')) {
      const files = parseLsTree(git(archiveDir, ['ls-tree', '-r', 'HEAD']));
      return JSON.stringify({ sha: git(archiveDir, ['rev-parse', 'HEAD^{tree}']).trim(), truncated: false,
        tree: [...files].map(([path, f]) => ({ path, mode: f.mode, type: 'blob', sha: f.sha })) });
    }
    if (ep.startsWith('repos/auraoneai/auraglass-server-archive/contents/README.md')) {
      try { return Buffer.from(git(archiveDir, ['show', 'HEAD:README.md'])).toString('base64'); }
      catch { throw new Error('HTTP 404: Not Found'); }
    }
    throw new Error(`unexpected gh call ${args.join(' ')}`);
  };
  return { gh, calls };
}
const runners = (srcDir, gh) => ({ git: (args) => git(srcDir, args), gh });

describe('verify-archive (REQ-PLAT-82)', () => {
  it('passes only when GHSA published, repo private, tree byte-identical and README complete', () => {
    const { dir, bp } = sourceRepo();
    recordGhsa(dir, GHSA);
    const archive = repo({ ...SERVER, 'README.md': README });
    const { gh, calls } = ghFor({ archiveDir: archive });
    const r = verifyArchive({ root: dir, runners: runners(dir, gh) });
    expect(r.checks.branchPoint).toEqual({ status: 'ok', sha: bp });
    expect(r.checks.tree).toMatchObject({ status: 'pass', compared: 8, missing: [], mismatched: [], extra: [] });
    expect(r.checks.readme.status).toBe('pass');
    expect(r.checks.ghsa).toMatchObject({ status: 'pass', id: GHSA });
    expect(r.status).toBe('ok');
    expect(calls.every((c) => c.startsWith('api '))).toBe(true);
    expect(main(['--verify'], { root: dir, runners: runners(dir, gh) })).toBe(0);
  });

  it('fails on a single changed byte and names the file', () => {
    const { dir } = sourceRepo();
    recordGhsa(dir, GHSA);
    const archive = repo({ ...SERVER, 'server/index.ts': 'export const port = 3001;\n', 'README.md': README });
    const r = verifyArchive({ root: dir, runners: runners(dir, ghFor({ archiveDir: archive }).gh) });
    expect(r.checks.tree.status).toBe('fail');
    expect(r.checks.tree.mismatched).toEqual(['server/index.ts']);
    expect(r.status).toBe('missing');
    expect(main(['--verify'], { root: dir, runners: runners(dir, ghFor({ archiveDir: archive }).gh) })).toBe(1);
  });

  it('fails on missing and extra archive files', () => {
    const { dir } = sourceRepo();
    recordGhsa(dir, GHSA);
    const { Dockerfile: _drop, ...rest } = SERVER;
    const archive = repo({ ...rest, 'notes.txt': 'x\n', 'README.md': README });
    const r = verifyArchive({ root: dir, runners: runners(dir, ghFor({ archiveDir: archive }).gh) });
    expect(r.checks.tree).toMatchObject({ status: 'fail', missing: ['Dockerfile'], extra: ['notes.txt'] });
  });

  it('reports missing, never pass, when no GHSA id is recorded and the repo does not exist', () => {
    const { dir } = sourceRepo();
    const r = verifyArchive({ root: dir, runners: runners(dir, ghFor({ archiveDir: dir, exists: false }).gh) });
    expect(r.checks.ghsa.status).toBe('missing');
    expect(r.checks.repo.status).toBe('missing');
    expect(r.checks.tree.status).toBe('missing');
    expect(r.checks.readme.status).toBe('missing');
    expect(r.status).toBe('missing');
    expect(main([], { root: dir, runners: runners(dir, ghFor({ archiveDir: dir, exists: false }).gh) })).toBe(0);
    expect(main(['--verify'], { root: dir, runners: runners(dir, ghFor({ archiveDir: dir, exists: false }).gh) })).toBe(1);
  });

  it('fails a public archive repo and an unpublished advisory', () => {
    const { dir } = sourceRepo();
    recordGhsa(dir, GHSA);
    const archive = repo({ ...SERVER, 'README.md': README });
    const r = verifyArchive({ root: dir, runners: runners(dir, ghFor({ archiveDir: archive, isPrivate: false, advisoryState: 'draft' }).gh) });
    expect(r.checks.repo.status).toBe('fail');
    expect(r.checks.ghsa).toMatchObject({ status: 'fail', reason: 'advisory state draft != published' });
    expect(r.status).toBe('missing');
  });

  it('reports missing when the 4.x line is not fetched', () => {
    const dir = repo({ 'src/index.ts': 'export {};\n' });
    const r = verifyArchive({ root: dir, runners: runners(dir, ghFor({ archiveDir: dir }).gh) });
    expect(r.checks.branchPoint.status).toBe('missing');
    expect(r.checks.tree.status).toBe('missing');
  });
});

describe('verify-archive pure checks', () => {
  it('README must name the GHSA id, JWT_SECRET rotation and Kiro Prism', () => {
    expect(checkReadmeText(README, GHSA).status).toBe('pass');
    expect(checkReadmeText(README.replace(GHSA, 'an advisory'), GHSA).reason).toMatch(`does not name ${GHSA}`);
    expect(checkReadmeText(README.replace('rotate ', 'keep '), GHSA).reason).toMatch('JWT_SECRET');
    expect(checkReadmeText(README.replace('Kiro Prism', 'a provider'), GHSA).reason).toMatch('Kiro Prism');
    expect(checkReadmeText(null, GHSA).status).toBe('fail');
  });
  it('an empty expected tree never passes', () => {
    expect(compareTrees(new Map(), new Map()).status).toBe('fail');
  });
  it('a mode change is a mismatch', () => {
    const exp = new Map([['Dockerfile', { mode: '100644', sha: 'a' }]]);
    const act = new Map([['Dockerfile', { mode: '100755', sha: 'a' }]]);
    expect(compareTrees(exp, act).mismatched).toEqual(['Dockerfile']);
  });
});
