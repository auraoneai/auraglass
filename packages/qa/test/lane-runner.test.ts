/* REQ-QUAL-05 lane runner and registry; REQ-QUAL-28 L2/L3/L4 discovery-only (tarball from env and from the pack
   fallback, empty L4 → pending, L4 never path-filtered). Fixture registrations: tests/contract-doubles/fragments/. */
import { afterAll, describe, expect, it, jest } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  EXIT, PENDING_EXIT, branchStream, loadRegistrations, parseArgs, playwrightConfigFor, resolveTarball, selectRows, validateManifest,
  type Registration,
} from '../src/evidence/laneRunner.ts';
import { REPO, cleanupRepos, fakeJest, makeRepo, results, row, runFixture } from './helpers/laneFixture.ts';

afterAll(cleanupRepos);

const MANIFEST_KEYS = ['sha', 'scope', 'runnerTag', 'imageDigest', 'browserVersions', 'subjects', 'cells', 'results',
  'thresholdsSha256', 'scenesSha256', 'inventorySha256', 'durationMs', 'captureRate'];

describe('CLI arguments (LANE_COMMAND)', () => {
  it('parses --lane/--scope/--verdict/--line', () => {
    expect(parseArgs(['--lane', 'L7', '--scope', 'main'])).toEqual({ lane: 'L7', scope: 'main', verdict: null, line: '5x' });
    expect(parseArgs(['--lane', 'all', '--scope', 'release', '--verdict', 'v.json', '--line', '4x'])).toEqual({ lane: 'all', scope: 'release', verdict: 'v.json', line: '4x' });
  });
  it.each([[['--lane', 'L13', '--scope', 'pr']], [['--lane', 'L1', '--scope', 'weekly']], [['--lane', 'L1']], [['--lane', 'L1', '--scope', 'pr', '--x']]])('rejects %j', (argv) => {
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
