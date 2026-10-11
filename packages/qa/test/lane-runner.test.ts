/* REQ-QUAL-05 lane runner and registry; REQ-QUAL-28 L2/L3/L4 discovery-only (tarball from env and from the pack
   fallback, empty L4 → pending, L4 never path-filtered); REQ-QUAL-33 `--line 4x` resolution for both 4.x tarball
   sources (published dist-tag, release/4.x head). Fixture registrations: tests/contract-doubles/fragments/. */
import { afterAll, describe, expect, it, jest } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  EXIT, PENDING_EXIT, branchStream, loadRegistrations, parseArgs, playwrightConfigFor, resolveHeadV4Tarball, resolvePublishedV4Tarball,
  resolveTarball, selectRows, validateManifest,
  type Registration,
} from '../src/evidence/laneRunner.ts';
import { REPO, cleanupRepos, fakeJest, makeRepo, results, row, runFixture } from './helpers/laneFixture.ts';

afterAll(cleanupRepos);

const MANIFEST_KEYS = ['sha', 'scope', 'runnerTag', 'imageDigest', 'browserVersions', 'subjects', 'cells', 'results',
  'thresholdsSha256', 'scenesSha256', 'inventorySha256', 'durationMs', 'captureRate'];

describe('CLI arguments (LANE_COMMAND)', () => {
  it('parses --lane/--scope/--verdict/--line', () => {
    expect(parseArgs(['--lane', 'L7', '--scope', 'main'])).toEqual({ lane: 'L7', scope: 'main', verdict: null, line: '5x' });
    expect(parseArgs(['--lane', 'all', '--scope', 'release', '--verdict', 'v.json'])).toEqual({ lane: 'all', scope: 'release', verdict: 'v.json', line: '5x' });
    expect(parseArgs(['--lane', 'all', '--scope', 'nightly', '--line', '4x'])).toEqual({ lane: 'all', scope: 'nightly', verdict: null, line: '4x' });
    expect(parseArgs(['--lane', 'L11', '--scope', 'main', '--line', '4x'])).toEqual({ lane: 'L11', scope: 'main', verdict: null, line: '4x' });
  });
  it.each([[['--lane', 'L13', '--scope', 'pr']], [['--lane', 'L1', '--scope', 'weekly']], [['--lane', 'L1']], [['--lane', 'L1', '--scope', 'pr', '--x']],
    // REQ-QUAL-33: 4.x runs only L2/L3/L11 at main/nightly and never writes a verdict
    [['--lane', 'L1', '--scope', 'main', '--line', '4x']], [['--lane', 'L2', '--scope', 'pr', '--line', '4x']],
    [['--lane', 'all', '--scope', 'release', '--line', '4x']], [['--lane', 'L3', '--scope', 'nightly', '--line', '4x', '--verdict', 'v.json']],
    [['--lane', 'L2', '--scope', 'main', '--line', '6x']]])('rejects %j', (argv) => {
    expect(() => parseArgs(argv)).toThrow();
  });
  it('exits 64 on a usage error and 2 (printing the remote command) outside CI / the remote runner', async () => {
    const root = makeRepo();
    expect((await runFixture(root, { lane: 'L99' })).code).toBe(EXIT.usage);
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { runLanes } = await import('../src/evidence/laneRunner.ts');
    const r = await runLanes(['--lane', 'L1', '--scope', 'pr'], { root, env: { PATH: process.env.PATH } });
    expect(r.code).toBe(EXIT.local);
    expect(err.mock.calls.flat().join('\n')).toContain('Remote command: node certification/run.mjs --lane L1 --scope pr');
    err.mockRestore();
  });
});

describe('registry = built-ins + loadFragments(lanes)', () => {
  it('tags built-ins and the contract-double fragment with their stream and source', async () => {
    const double = readFileSync(join(REPO, 'tests/contract-doubles/fragments/lanes.ts'), 'utf8');
    const root = makeRepo({ builtins: `[${row({ lane: 'L1', kind: 'node-script', path: 'gate.mjs' })}]`, files: { 'fragments/lanes/plat.ts': double } });
    const regs = await loadRegistrations(root);
    expect(regs.rows.map((r) => [r.stream, r.source, r.path])).toEqual([
      ['qual', 'certification/lanes.config.ts', 'gate.mjs'],
      ['plat', 'fragments/lanes/plat.ts', 'scripts/ci/lint-literals.mjs'],
    ]);
  });

  it('fragment rows cannot use the built-in-only keys (config/coverage)', async () => {
    const root = makeRepo({ fragments: { mat: `[${row({ lane: 'L12', kind: 'jest', path: 'x.test.ts', coverage: true, config: 'evil.js' })}]` } });
    const [r] = (await loadRegistrations(root)).rows;
    expect(r).not.toHaveProperty('coverage');
    expect(r).not.toHaveProperty('config');
  });

  it('scope is the narrowest scope a row runs at (pr ⊂ main ⊂ nightly ⊂ release) and identical rows run once', () => {
    const mk = (path: string, scope: Registration['scope']): Registration => ({ lane: 'L1', kind: 'node-script', path, scope, remote: false, failClosed: true, stream: 'qual', source: 's' });
    const rows = [mk('a', 'pr'), mk('b', 'main'), mk('c', 'nightly'), mk('d', 'release'), mk('a', 'release')];
    expect(selectRows(rows, 'L1', 'pr').map((r) => r.path)).toEqual(['a']);
    expect(selectRows(rows, 'L1', 'main').map((r) => r.path)).toEqual(['a', 'b']);
    expect(selectRows(rows, 'L1', 'nightly').map((r) => r.path)).toEqual(['a', 'b', 'c']);
    expect(selectRows(rows, 'L1', 'release').map((r) => r.path)).toEqual(['a', 'b', 'c', 'd']);
    expect(selectRows(rows, 'L2', 'release')).toEqual([]);
  });

  it('maps PR branch prefixes to streams for pre-existing attribution (null outside pr scope)', () => {
    expect(branchStream('next-mat/x', 'pr')).toBe('mat');
    expect(branchStream('4x11-surf/x', 'pr')).toBe('surf');
    expect(branchStream('next-fin/g-lane-runner', 'pr')).toBe('qual');
    expect(branchStream('next-fin/e-x', 'pr')).toBe('cmp');
    expect(branchStream('next-fin/h-x', 'pr')).toBeNull();
    expect(branchStream('next', 'main')).toBeNull();
    expect(branchStream('next-fin/g-x', 'release')).toBeNull();
  });

  it('runs stream specs under the root playwright config and certification specs under the cert config', () => {
    expect(playwrightConfigFor(['tests/e2e/mat/a.spec.ts'])).toBe('playwright.config.ts');
    expect(playwrightConfigFor(['certification/lanes/engine.spec.ts'])).toBe('certification/playwright.cert.config.ts');
    expect(playwrightConfigFor(['certification/lanes/a.spec.ts', 'tests/e2e/mat/a.spec.ts'])).toBeNull();
  });
});

describe('lane manifest', () => {
  it('writes .artifacts/qual/<job-slug>/lane-manifest.json with every listed key, validating against the schema', async () => {
    const root = makeRepo({ builtins: `[${row({ lane: 'L1', kind: 'node-script', path: 'ok.mjs' })}]`, files: { 'ok.mjs': 'process.exit(0)\n' } });
    const r = await runFixture(root, { env: { CI_COMMIT_SHA: 'abc123', CI_RUNNER_TAGS: 'saas-linux-medium-amd64' } });
    expect(r.code).toBe(EXIT.ok);
    expect(r.manifestPath).toBe(join(root, '.artifacts/qual/fixture/lane-manifest.json'));
    const m = JSON.parse(readFileSync(r.manifestPath!, 'utf8'));
    for (const k of MANIFEST_KEYS) expect(m).toHaveProperty(k);
    expect(m).toMatchObject({ lane: 'L1', scope: 'pr', sha: 'abc123', runnerTag: 'saas-linux-medium-amd64', summary: { pass: 1 } });
    const schema = JSON.parse(readFileSync(join(REPO, 'certification/schemas/lane-manifest.schema.json'), 'utf8'));
    expect(validateManifest(m, schema)).toEqual([]);
    expect(validateManifest({ ...m, scope: 'weekly' }, schema)).toEqual(['$.scope: "weekly" not in enum']);
    const { results: _r, ...noResults } = m;
    expect(validateManifest(noResults, schema)).toEqual(['$.results: required']);
  });

  it('node-script rows report pending with exit 75; that pending is a failure at release scope', async () => {
    const root = makeRepo({ builtins: `[${row({ lane: 'L1', kind: 'node-script', path: 'p.mjs' })}]`, files: { 'p.mjs': `process.exit(${PENDING_EXIT})\n` } });
    const pr = await runFixture(root);
    expect(pr.code).toBe(EXIT.ok);
    expect(results(pr)[0]).toMatchObject({ state: 'pending' });
    const rel = await runFixture(root, { scope: 'release' });
    expect(rel.code).toBe(EXIT.fail);
    expect(results(rel)[0]).toMatchObject({ state: 'fail', reason: expect.stringMatching(/^pending at release scope/) });
  });

  it('a jest row whose every failure is a pending-producer error is pending, any other failure is fail', async () => {
    const report = (msg: string) => ({ success: false, numTotalTests: 1, numFailedTests: 1, testResults: [{ name: 'x.test.ts', status: 'failed', assertionResults: [{ status: 'failed', failureMessages: [msg] }] }] });
    const reg = `[${row({ lane: 'L1', kind: 'jest', path: 'tests/x.test.ts', config: 'qa.config.js' })}]`;
    const root = makeRepo({ builtins: reg, files: { 'tests/x.test.ts': '' } });
    const pending = await runFixture(root, { tools: { jestBin: fakeJest(root, report('AgPendingProducer: pending: no flagships (producer: CMP)'), 1) } });
    expect(results(pending)[0]).toMatchObject({ state: 'pending', tests: 1 });
    const failing = await runFixture(root, { tools: { jestBin: fakeJest(root, report('Error: expect(received).toBe(expected)'), 1) } });
    expect(results(failing)[0]).toMatchObject({ state: 'fail', tests: 1 });
    expect(failing.code).toBe(EXIT.fail);
  });

  it('attributes a failure outside the PR stream as pre-existing (contracts/ownership.json owners)', async () => {
    const report = { success: false, numTotalTests: 2, numFailedTests: 1, testResults: [{ name: 'tests/tokens/x.test.ts', status: 'failed', assertionResults: [{ status: 'failed', failureMessages: ['boom'] }] }] };
    const root = makeRepo({ fragments: { mat: `[${row({ lane: 'L4', kind: 'jest', path: 'tests/tokens/x.test.ts' })}]` }, files: { 'tests/tokens/x.test.ts': '', 'package.json': '{"name":"f","files":[]}' } });
    const tools = { jestBin: fakeJest(root, report, 1) };
    const env = { AURAGLASS_TARBALL: 'package.json' }; // any existing file; this test is about attribution
    const qualPr = await runFixture(root, { lane: 'L4', branch: 'next-fin/g-topic', env, tools });
    expect(results(qualPr)[0]).toMatchObject({ state: 'pre-existing', stream: 'mat' });
    expect(qualPr.code).toBe(EXIT.ok);
    const matPr = await runFixture(root, { lane: 'L4', branch: 'next-mat/topic', env, tools });
    expect(results(matPr)[0]).toMatchObject({ state: 'fail' });
    expect(matPr.code).toBe(EXIT.fail);
    const main = await runFixture(root, { lane: 'L4', scope: 'main', branch: 'next', env, tools });
    expect(main.code).toBe(EXIT.fail);
  });

  it('drops a pending built-in once its producer registers the gate; fails when the gate exists unregistered', async () => {
    const pending = `[{ lane: 'L1', path: 'scripts/qual/gate.mjs', producer: 'G-99' }]`;
    const absent = makeRepo({ pending });
    expect((await loadRegistrations(absent)).pending).toHaveLength(1);
    const registered = makeRepo({ pending, fragments: { qual: `[${row({ lane: 'L1', kind: 'node-script', path: 'scripts/qual/gate.mjs' })}]` }, files: { 'scripts/qual/gate.mjs': '' } });
    expect(await loadRegistrations(registered)).toMatchObject({ pending: [], problems: [] });
    const unwired = makeRepo({ pending, files: { 'scripts/qual/gate.mjs': '' } });
    const r = await runFixture(unwired);
    expect(r.code).toBe(EXIT.fail);
    expect(results(r)[0]).toMatchObject({ state: 'fail', reason: expect.stringContaining('exists (producer G-99 landed) but is not registered') });
  });
});

describe('L2/L3/L4 tarball (REQ-QUAL-28)', () => {
  it('takes the tarball from AURAGLASS_TARBALL (plat:package:pack dotenv) and passes it to every row', async () => {
    const root = makeRepo({
      fragments: { plat: `[${row({ lane: 'L2', kind: 'node-script', path: 'check.mjs' })}]` },
      files: { 'pack/aura-glass-5.0.0.tgz': 'tgz', 'check.mjs': "process.exit(process.env.AURAGLASS_TARBALL.endsWith('pack/aura-glass-5.0.0.tgz') && process.env.AG_LANE === 'L2' ? 0 : 1)\n" },
    });
    const r = await runFixture(root, { lane: 'L2', env: { AURAGLASS_TARBALL: 'pack/aura-glass-5.0.0.tgz' } });
    expect(r.code).toBe(EXIT.ok);
    expect(r.manifest!.tarball).toMatchObject({ source: 'env', file: 'pack/aura-glass-5.0.0.tgz', sha256: expect.stringMatching(/^[0-9a-f]{64}$/) });
    // the L2 manifest lists the PLAT rows with per-row state
    expect(results(r)).toEqual([expect.objectContaining({ lane: 'L2', stream: 'plat', path: 'check.mjs', state: 'pass' })]);
  });

  it('fails closed when AURAGLASS_TARBALL points at a missing file', async () => {
    const root = makeRepo({ fragments: { plat: `[${row({ lane: 'L3', kind: 'node-script', path: 'check.mjs' })}]` }, files: { 'check.mjs': '' } });
    const r = await runFixture(root, { lane: 'L3', env: { AURAGLASS_TARBALL: 'nope.tgz' } });
    expect(r.code).toBe(EXIT.fail);
    expect(results(r)[0]).toMatchObject({ state: 'fail', reason: 'tarball: AURAGLASS_TARBALL=nope.tgz does not exist' });
  });

  it('falls back to `npm pack --pack-destination .artifacts/pack` of the built dist/', () => {
    const root = makeRepo({ files: { 'package.json': JSON.stringify({ name: 'ag-fixture-pkg', version: '1.2.3', files: ['dist'] }), 'dist/index.js': 'export {};\n' } });
    const t = resolveTarball(root, {});
    expect(t).toEqual({ source: 'pack', path: join(root, '.artifacts/pack/ag-fixture-pkg-1.2.3.tgz') });
    expect(existsSync(t.path)).toBe(true);
    const listing = execFileSync('tar', ['-tzf', t.path], { encoding: 'utf8' });
    expect(listing).toContain('package/dist/index.js');
  });

  it('refuses the pack fallback without a built dist/ (never tests an empty package)', () => {
    const root = makeRepo({ files: { 'package.json': JSON.stringify({ name: 'ag-fixture-pkg', version: '1.2.3', files: ['dist'] }) } });
    expect(() => resolveTarball(root, {})).toThrow('dist/ missing');
  });

  it('an empty L4 registry is pending; every L4 row runs (L4 is never path-filtered)', async () => {
    const empty = await runFixture(makeRepo(), { lane: 'L4' });
    expect(empty.code).toBe(EXIT.ok);
    expect(results(empty)).toEqual([expect.objectContaining({ lane: 'L4', state: 'pending', reason: '0 subjects registered for this lane at this scope' })]);
    const root = makeRepo({
      fragments: { mat: `[${row({ lane: 'L4', kind: 'node-script', path: 'a.mjs' })}, ${row({ lane: 'L4', kind: 'node-script', path: 'b.mjs' })}]` },
      files: { 'a.mjs': '', 'b.mjs': '', 't.tgz': 'x' },
    });
    const r = await runFixture(root, { lane: 'L4', env: { AURAGLASS_TARBALL: 't.tgz', AG_CHANGED_FILES: 'src/components/button/Button.tsx' } });
    expect(results(r).map((x) => [x.path, x.state])).toEqual([['a.mjs', 'pass'], ['b.mjs', 'pass']]);
  });
});

describe('--line 4x (REQ-QUAL-33): published and release/4.x-head tarballs', () => {
  const GIT_ID = ['-c', 'user.name=fixture', '-c', 'user.email=fixture@example.invalid', '-c', 'commit.gpgsign=false'];
  const git = (cwd: string, ...args: string[]) => execFileSync('git', [...GIT_ID, ...args], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

  /** A 4.x source repository (the project's `origin`) with a `release/4.x` branch whose build script writes dist/. */
  function v4Origin(version = '4.1.1', withBranch = true): string {
    const dir = mkdtempSync(join(tmpdir(), 'ag-4x-origin-'));
    const files: Record<string, string> = {
      'package.json': `${JSON.stringify({ name: 'aura-glass', version, files: ['dist', 'deprecations.json'], scripts: { build: 'node build.cjs' } }, null, 2)}\n`,
      'package-lock.json': `${JSON.stringify({ name: 'aura-glass', version, lockfileVersion: 3, requires: true, packages: { '': { name: 'aura-glass', version } } }, null, 2)}\n`,
      'build.cjs': "require('node:fs').mkdirSync('dist', { recursive: true }); require('node:fs').writeFileSync('dist/index.js', 'export const line = \"4x\";\\n');\n",
      'deprecations.json': '[]\n',
    };
    for (const [f, t] of Object.entries(files)) writeFileSync(join(dir, f), t);
    git(dir, 'init', '-q', '-b', withBranch ? 'release/4.x' : 'main');
    git(dir, 'add', '.');
    git(dir, 'commit', '-q', '-m', 'v4');
    return dir;
  }
  /** The project checkout: a fixture repo (lanes config, fragments) whose `origin` is `originDir`. */
  function project(spec: Parameters<typeof makeRepo>[0], originDir: string): string {
    const root = makeRepo(spec);
    git(root, 'init', '-q', '-b', 'next');
    git(root, 'add', '.');
    git(root, 'commit', '-q', '-m', 'next');
    git(root, 'remote', 'add', 'origin', originDir);
    return root;
  }
  /** Fake npm for the registry step only (unit tests never reach the network): `npm pack <spec>` writes the
      tarball the registry would return for the dist-tag, printing its name like npm does. */
  function fakeRegistryNpm(root: string, version: string): string {
    const p = join(root, '.tools/npm');
    mkdirSync(join(root, '.tools'), { recursive: true });
    writeFileSync(p, `#!/usr/bin/env node
const [cmd, spec, flag, dest] = process.argv.slice(2);
if (cmd !== 'pack' || flag !== '--pack-destination' || spec !== 'aura-glass@' + process.env.AG_V4_DIST_TAG) { console.error('unexpected npm ' + process.argv.slice(2).join(' ')); process.exit(9); }
const name = 'aura-glass-${version}.tgz';
require('node:fs').writeFileSync(require('node:path').join(dest, name), 'published ${version}');
console.log(name);
`);
    chmodSync(p, 0o755);
    return p;
  }

  it('published: packs aura-glass@$AG_V4_DIST_TAG into .artifacts/pack-4x/published and requires a 4.x version', () => {
    const root = makeRepo();
    const ok = resolvePublishedV4Tarball(root, { PATH: process.env.PATH, AG_V4_DIST_TAG: 'latest' }, { npm: fakeRegistryNpm(root, '4.3.0') });
    expect(ok).toEqual({ source: 'published', state: 'ready', spec: 'aura-glass@latest', version: '4.3.0', path: join(root, '.artifacts/pack-4x/published/aura-glass-4.3.0.tgz') });
    expect(readFileSync(ok.path!, 'utf8')).toBe('published 4.3.0');
    const five = resolvePublishedV4Tarball(root, { PATH: process.env.PATH, AG_V4_DIST_TAG: 'latest' }, { npm: fakeRegistryNpm(root, '5.0.0') });
    expect(five).toMatchObject({ state: 'fail', reason: expect.stringContaining('resolved aura-glass 5.0.0, not a 4.x release') });
    expect(resolvePublishedV4Tarball(root, { PATH: process.env.PATH }, { npm: 'npm' })).toMatchObject({ state: 'fail', reason: expect.stringContaining('AG_V4_DIST_TAG is unset') });
  });

  it('head: fetches origin release/4.x, runs npm ci + the 4.x build + npm pack in a scratch worktree, then removes it', () => {
    const origin = v4Origin('4.1.1');
    const root = project({}, origin);
    const head = git(origin, 'rev-parse', 'HEAD').trim();
    const t = resolveHeadV4Tarball(root, { PATH: process.env.PATH, HOME: process.env.HOME }, { npm: 'npm', git: 'git' });
    expect(t).toEqual({ source: 'head', state: 'ready', spec: 'origin/release/4.x', commit: head, version: '4.1.1', path: join(root, '.artifacts/pack-4x/head/aura-glass-4.1.1.tgz') });
    const listing = execFileSync('tar', ['-tzf', t.path!], { encoding: 'utf8' });
    expect(listing).toContain('package/dist/index.js'); // built by the 4.x build script inside the worktree
    expect(listing).toContain('package/deprecations.json');
    expect(git(root, 'worktree', 'list').trim().split('\n')).toHaveLength(1); // scratch worktree removed
    expect(existsSync(join(root, 'dist'))).toBe(false); // the next checkout is untouched
  });

  it('head: pending while release/4.x is not on the remote (REQ-FIN-20); other git failures fail', () => {
    const root = project({}, v4Origin('4.1.1', false));
    expect(resolveHeadV4Tarball(root, { PATH: process.env.PATH }, { npm: 'npm', git: 'git' }))
      .toMatchObject({ source: 'head', state: 'pending', reason: expect.stringContaining('REQ-FIN-20') });
    const broken = project({}, join(tmpdir(), 'ag-no-such-origin-dir'));
    expect(resolveHeadV4Tarball(broken, { PATH: process.env.PATH }, { npm: 'npm', git: 'git' }))
      .toMatchObject({ source: 'head', state: 'fail', reason: expect.stringContaining('git fetch origin release/4.x failed') });
  });

  it('runs L2/L3/L11 rows once per 4.x tarball with line 4x rows; failures are recorded and never block', async () => {
    const origin = v4Origin('4.1.1');
    const check = `import { existsSync } from 'node:fs';
const t = process.env.AURAGLASS_TARBALL;
const ok = process.env.AG_CERT_LINE === '4x' && /aura-glass-4\\.\\d+\\.\\d+\\.tgz$/.test(t) && existsSync(t)
  && t.includes('/pack-4x/' + process.env.AG_TARBALL_SOURCE + '/') && process.env.AG_V4_VERSION.startsWith('4.');
process.exit(ok ? 0 : 1);\n`;
    const root = project({
      fragments: {
        plat: `[${row({ lane: 'L2', kind: 'node-script', path: 'check-4x.mjs', scope: 'main' })}, ${row({ lane: 'L4', kind: 'node-script', path: 'l4.mjs' })}]`,
        mat: `[${row({ lane: 'L3', kind: 'node-script', path: 'deprecations-4x.mjs' })}]`,
      },
      files: { 'check-4x.mjs': check, 'l4.mjs': 'process.exit(1)\n', 'deprecations-4x.mjs': 'process.exit(1)\n' },
    }, origin);
    const env = { AG_V4_DIST_TAG: 'latest', CI_COMMIT_SHA: 'abc123' };
    // registry `npm pack aura-glass@latest` is faked (no network in unit tests); the head build uses the real npm
    const tools = { npm: fakeHybridNpm(root) };
    const r2 = await runFixture(root, { lane: 'all', scope: 'nightly', env, tools, extraArgs: ['--line', '4x'] });
    expect(r2.code).toBe(EXIT.ok); // L3 failures are 4.x results: recorded, never blocking
    expect(r2.manifestPath).toBe(join(root, '.artifacts/qual/fixture/line-4x/lane-manifest.json'));
    const m = JSON.parse(readFileSync(r2.manifestPath!, 'utf8'));
    expect(m).toMatchObject({ line: '4x', lane: 'all', scope: 'nightly', tarball: null });
    expect(m.tarballs.map((t: { source: string; state: string; version: string }) => [t.source, t.state, t.version])).toEqual([['published', 'ready', '4.3.0'], ['head', 'ready', '4.1.1']]);
    for (const t of m.tarballs) expect(t.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(results(r2).map((x) => [x.tarballSource, x.lane, x.path, x.state])).toEqual([
      ['published', 'L2', 'check-4x.mjs', 'pass'], ['published', 'L3', 'deprecations-4x.mjs', 'fail'], ['published', 'L11', '(no registrations)', 'pending'],
      ['head', 'L2', 'check-4x.mjs', 'pass'], ['head', 'L3', 'deprecations-4x.mjs', 'fail'], ['head', 'L11', '(no registrations)', 'pending'],
    ]); // L4 is not a 4.x lane
    for (const x of results(r2)) expect(x).toMatchObject({ line: '4x', blocking: false });
    const schema = JSON.parse(readFileSync(join(REPO, 'certification/schemas/lane-manifest.schema.json'), 'utf8'));
    expect(validateManifest(m, schema)).toEqual([]);
  });

  it('every row of a source that is not ready carries that source state and reason', async () => {
    const root = project({ fragments: { plat: `[${row({ lane: 'L2', kind: 'node-script', path: 'ok.mjs' })}]` }, files: { 'ok.mjs': '' } }, v4Origin('4.1.1', false));
    const r = await runFixture(root, { lane: 'L2', scope: 'main', env: { AG_V4_DIST_TAG: 'latest' }, tools: { npm: fakeRegistryNpm(root, '4.3.0') }, extraArgs: ['--line', '4x'] });
    expect(r.code).toBe(EXIT.ok);
    expect(results(r).map((x) => [x.tarballSource, x.state])).toEqual([['published', 'pass'], ['head', 'pending']]);
    expect(results(r)[1]).toMatchObject({ line: '4x', reason: expect.stringMatching(/^4\.x head tarball: release\/4\.x is not on this project's remote yet \(REQ-FIN-20/) });
  });

  /** npm that answers the registry `pack <spec>` from fakeRegistryNpm and runs every other command with the real npm. */
  function fakeHybridNpm(root: string): string {
    const registry = fakeRegistryNpm(root, '4.3.0');
    const p = join(root, '.tools/npm-hybrid');
    writeFileSync(p, `#!/bin/sh
case "$1 $2" in "pack aura-glass@"*) exec "${registry}" "$@";; esac
exec npm "$@"
`);
    chmodSync(p, 0o755);
    return p;
  }
});
