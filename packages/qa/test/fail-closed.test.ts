/* REQ-QUAL-06 Fail closed, without waiting: the five failure modes with their exit codes, empty lanes (pending before
   release, fail at release), the sentinel set on affected-subject PR lanes, and registration validation. */
import { afterAll, describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { EXIT } from '../src/evidence/laneRunner.ts';
import { REPO, cleanupRepos, fakeJest, fakePlaywright, makeRepo, results, row, runFixture } from './helpers/laneFixture.ts';

afterAll(cleanupRepos);

const jestRow = row({ lane: 'L1', kind: 'jest', path: 'tests/a.test.ts', config: 'qa.config.js' });

describe('the five failure modes', () => {
  it('1. a crashing registration fails (exit 1): killed by a signal', async () => {
    const root = makeRepo({ builtins: `[${row({ lane: 'L1', kind: 'node-script', path: 'die.mjs' })}]`, files: { 'die.mjs': "process.kill(process.pid, 'SIGKILL');\n" } });
    const r = await runFixture(root);
    expect(r.code).toBe(EXIT.fail);
    expect(results(r)[0]).toMatchObject({ state: 'fail', reason: 'crashed: SIGKILL' });
  });

  it('1b. a crashing registry (lanes.config.ts throws) fails (exit 1) without a manifest', async () => {
    const root = makeRepo({ builtins: "(() => { throw new Error('broken registry'); })()" });
    const r = await runFixture(root);
    expect(r).toEqual({ code: EXIT.fail, manifestPath: null, manifest: null });
  });

  it('2. a tool that writes no report ("missing manifest") fails (exit 1): jest and playwright', async () => {
    const root = makeRepo({ builtins: `[${jestRow}]`, files: { 'tests/a.test.ts': '' } });
    const r = await runFixture(root, { tools: { jestBin: fakeJest(root, null, 0) } });
    expect(r.code).toBe(EXIT.fail);
    expect(results(r)[0]).toMatchObject({ state: 'fail', reason: 'jest wrote no report (exit 0)' });

    const pw = makeRepo({ builtins: `[${row({ lane: 'L5', kind: 'playwright', path: 'tests/e2e/qual/a.spec.ts', remote: true })}]`, files: { 'tests/e2e/qual/a.spec.ts': '' } });
    const p = await runFixture(pw, { lane: 'L5', tools: { playwrightCli: fakePlaywright(pw, null, 0) } });
    expect(p.code).toBe(EXIT.fail);
    expect(results(p).find((x) => x.path === 'tests/e2e/qual/a.spec.ts')).toMatchObject({ state: 'fail', reason: 'playwright wrote no report (exit 0)' });
  });

  it('3. a report with 0 tests while the row has ≥1 subject file fails (exit 1)', async () => {
    const root = makeRepo({ builtins: `[${jestRow}]`, files: { 'tests/a.test.ts': '' } });
    const r = await runFixture(root, { tools: { jestBin: fakeJest(root, { success: true, numTotalTests: 0, testResults: [] }, 0) } });
    expect(r.code).toBe(EXIT.fail);
    expect(results(r)[0]).toMatchObject({ state: 'fail', reason: '0 tests for 1 subject file(s)', tests: 0 });

    const pw = makeRepo({ builtins: `[${row({ lane: 'L8', kind: 'playwright', path: 'tests/e2e/qual/*.spec.ts', remote: true })}]`, files: { 'tests/e2e/qual/a.spec.ts': '' } });
    const p = await runFixture(pw, { lane: 'L8', tools: { playwrightCli: fakePlaywright(pw, { stats: { expected: 0, unexpected: 0, flaky: 0, skipped: 3 }, suites: [] }, 0) } });
    expect(p.code).toBe(EXIT.fail);
    expect(results(p)[0]).toMatchObject({ state: 'fail', reason: '0 tests ran for 1 spec file(s)' });
  });

  it('4. a registered path that does not exist fails (exit 1): node-script, jest, playwright', async () => {
    const root = makeRepo({
      builtins: `[${row({ lane: 'L1', kind: 'node-script', path: 'scripts/missing.mjs --flag' })}, ${row({ lane: 'L1', kind: 'jest', path: 'tests/missing/**/*.test.ts' })}, ${row({ lane: 'L1', kind: 'playwright', path: 'tests/e2e/missing/*.spec.ts', remote: true })}]`,
    });
    const r = await runFixture(root);
    expect(r.code).toBe(EXIT.fail);
    expect(results(r).map((x) => x.reason)).toEqual([
      'registered path missing: scripts/missing.mjs',
      'registered path matches nothing: tests/missing/**/*.test.ts',
      'registered path matches no spec: tests/e2e/missing/*.spec.ts',
    ]);
  });

  it('5. a lane with 0 subjects is pending at pr/main/nightly (exit 0) and fails at release (exit 1)', async () => {
    const root = makeRepo();
    for (const scope of ['pr', 'main', 'nightly']) {
      const r = await runFixture(root, { lane: 'L3', scope });
      expect([scope, r.code, results(r)[0]!.state]).toEqual([scope, EXIT.ok, 'pending']);
    }
    const rel = await runFixture(root, { lane: 'L3', scope: 'release' });
    expect(rel.code).toBe(EXIT.fail);
    expect(results(rel)[0]).toMatchObject({ lane: 'L3', state: 'fail', reason: expect.stringContaining('0 subjects registered') });
  });

  it('a release run fails closed on every empty lane of --lane all', async () => {
    const rel = await runFixture(makeRepo(), { lane: 'all', scope: 'release' });
    expect(rel.code).toBe(EXIT.fail);
    expect(results(rel).filter((x) => x.state === 'fail')).toHaveLength(12);
  });
});

describe('registration validation', () => {
  it('rejects remote:false for browser kinds and registrations without failClosed: true', async () => {
    const root = makeRepo({
      builtins: `[${row({ lane: 'L6', kind: 'playwright', path: 'a.spec.ts', remote: false })}, ${row({ lane: 'L6', kind: 'story-subjects', path: 'a.stories.tsx', remote: false })}, ${row({ lane: 'L6', kind: 'node-script', path: 'a.mjs', failClosed: false })}]`,
      files: { 'a.spec.ts': '', 'a.stories.tsx': '', 'a.mjs': '' },
    });
    const r = await runFixture(root, { lane: 'L6', scope: 'main' });
    expect(r.code).toBe(EXIT.fail);
    expect(results(r).map((x) => x.reason)).toEqual([
      'remote:false is not allowed for browser kind playwright',
      'remote:false is not allowed for browser kind story-subjects',
      'registration must set failClosed: true (S-43)',
    ]);
  });

  it('--verdict is a usage error outside `--lane all --scope release` (the verdict reads every lane, G-16)', async () => {
    const root = makeRepo({ builtins: `[${row({ lane: 'L1', kind: 'node-script', path: 'ok.mjs' })}]`, files: { 'ok.mjs': '' } });
    expect((await runFixture(root, { extraArgs: ['--verdict', 'v.json'] })).code).toBe(EXIT.usage);
    expect((await runFixture(root, { lane: 'all', scope: 'nightly', extraArgs: ['--verdict', 'v.json'] })).code).toBe(EXIT.usage);
  });
});

describe('sentinel set (certification/matrix.config.ts)', () => {
  const matrix = readFileSync(join(REPO, 'certification/matrix.config.ts'), 'utf8');
  it('is Surface regular/regular, Button Playground, Dialog open on L5–L9', () => {
    expect(matrix).toContain("{ subject: 'Surface', story: 'playground' }");
    expect(matrix).toContain("{ subject: 'Button', story: 'playground' }");
    expect(matrix).toContain("{ subject: 'Dialog', state: 'open' }");
    expect(matrix).toContain("['L5', 'L6', 'L7', 'L8', 'L9']");
  });

  it('is added to every affected-subject PR lane; a seed member (or one without a ComponentMeta) is pending', async () => {
    const root = makeRepo({
      matrix: true,
      files: {
        'src/components/button/Button.meta.ts': "export default defineMeta({ name: 'Button', owner: 'CMP' });\n",
        'src/components/button/Button.tsx': "/* @ag-contract-seed */ export const Button = () => null;\n",
        'src/components/dialog/Dialog.meta.ts': "export default defineMeta({ name: 'Dialog', owner: 'CMP' });\n",
        'src/components/dialog/Dialog.tsx': 'export const Dialog = () => null;\n',
      },
    });
    for (const lane of ['L5', 'L6', 'L7', 'L8', 'L9']) {
      const r = await runFixture(root, { lane });
      expect(results(r).map((x) => [x.path, x.state, x.reason])).toEqual([
        ['sentinel:Surface:playground', 'pending', 'sentinel Surface has no ComponentMeta yet (seed)'],
        ['sentinel:Button:playground', 'pending', 'sentinel Button is still a contract seed (src/components/button)'],
        ['sentinel:Dialog:open', 'pending', 'capture driver certification/lanes/environment-visual.spec.ts (G-12) not merged'],
      ]);
      expect(r.manifest!.subjects).toEqual(['Surface', 'Button', 'Dialog']);
    }
    const l4 = await runFixture(root, { lane: 'L4' });
    expect(results(l4).some((x) => String(x.path).startsWith('sentinel:'))).toBe(false);
    const main = await runFixture(root, { lane: 'L5', scope: 'main' });
    expect(results(main).some((x) => String(x.path).startsWith('sentinel:'))).toBe(false);
  });

  it('a non-seed sentinel runs through the capture driver once it exists', async () => {
    const root = makeRepo({
      matrix: true,
      files: {
        'src/components/dialog/Dialog.meta.ts': "export default defineMeta({ name: 'Dialog', owner: 'CMP' });\n",
        'src/components/dialog/Dialog.tsx': 'export const Dialog = () => null;\n',
        'certification/lanes/environment-visual.spec.ts': '',
      },
    });
    const pw = fakePlaywright(root, { stats: { expected: 4, unexpected: 1, flaky: 0, skipped: 0 }, suites: [{ file: 'certification/lanes/environment-visual.spec.ts', specs: [{ tests: [{ status: 'unexpected', results: [{ error: { message: 'Dialog open: material absent' } }] }] }] }] }, 1);
    const r = await runFixture(root, { lane: 'L7', tools: { playwrightCli: pw } });
    expect(results(r).find((x) => x.path === 'sentinel:Dialog:open')).toMatchObject({ state: 'fail', tests: 5, failed: 1 });
    expect(r.code).toBe(EXIT.fail);
  });
});
