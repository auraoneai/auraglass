/* REQ-QUAL-66 (FIN-425): certification/quarantine.json — ≤ 7-day entries, expired entries fail, a quarantined cell is
   reported `quarantined` (never `pass`) and is `fail` at release, where any active entry fails the run; nightly L7 runs
   twice and records the agreement ratio (≥ 99.9 %); the manifest lists fonts and the image digest. */
import { afterAll, describe, expect, it } from '@jest/globals';
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { delimiter, dirname, join } from 'node:path';
import {
  DETERMINISM_MIN_AGREEMENT, QUARANTINE_MAX_DAYS, agreementOf, cellOfTitle, partitionQuarantined, playwrightOutcomes, validateQuarantine,
  type Outcome,
} from '../src/evidence/quarantine.ts';
import { DOUBLE_RUN_IDX, EXIT, imageDigestOf, shardedL6Result } from '../src/evidence/laneRunner.ts';
import { isLoopbackUrl } from '../../../certification/lanes/_fixtures/offline.ts';
import { REPO, cleanupRepos, fakePlaywright, fakeTool, makeRepo, results, row, runFixture } from './helpers/laneFixture.ts';

afterAll(cleanupRepos);

const CELL = 'button--playground|photo|chromium|light.glass.default.standard.1440';
const CELL2 = 'dialog--open|dense-text|webkit|dark.tinted.default.standard.390';
const NOW = new Date('2026-10-10T12:00:00Z');
const day = (n: number, from = new Date()) => new Date(from.getTime() + n * 86_400_000).toISOString().slice(0, 10);
const entry = (o: Record<string, unknown> = {}) => ({ cell: CELL, issue: 'https://github.com/auraoneai/auraglass/issues/900', expires: '2026-10-14', ...o });

describe('quarantine.json validation', () => {
  it('the committed certification/quarantine.json is a valid, empty list', () => {
    const value = JSON.parse(readFileSync(join(REPO, 'certification/quarantine.json'), 'utf8'));
    expect(value).toEqual([]);
    expect(validateQuarantine(value, new Date())).toEqual([]);
  });

  it('accepts a cell/issue/expires entry at most 7 days out', () => {
    expect(validateQuarantine([entry()], NOW)).toEqual([]);
    expect(validateQuarantine([entry({ expires: '2026-10-16' })], NOW)).toEqual([]);
    expect(validateQuarantine([entry({ issue: '#123' })], NOW)).toEqual([]);
  });

  it('rejects an expired entry and one more than 7 days out', () => {
    expect(validateQuarantine([entry({ expires: '2026-10-09' })], NOW).map((p) => p.code)).toEqual(['expired']);
    expect(validateQuarantine([entry({ expires: '2026-10-18' })], NOW).map((p) => p.code)).toEqual(['too-long']);
    // a date-only value means the end of that day (UTC): 2026-10-17T23:59:59Z is 7 d 12 h after NOW
    expect(validateQuarantine([entry({ expires: '2026-10-17' })], NOW).map((p) => p.code)).toEqual(['too-long']);
    expect(validateQuarantine([entry({ expires: '2026-10-17T12:00:01Z' })], NOW).map((p) => p.code)).toEqual(['too-long']);
    expect(validateQuarantine([entry({ expires: '2026-10-17T12:00:00Z' })], NOW)).toEqual([]);
    expect(QUARANTINE_MAX_DAYS).toBe(7);
  });

  it('rejects malformed entries: shape, unknown keys, bad cell id, bad issue, bad date, duplicates', () => {
    expect(validateQuarantine({}, NOW).map((p) => p.code)).toEqual(['shape']);
    expect(validateQuarantine([null], NOW).map((p) => p.code)).toEqual(['shape']);
    expect(validateQuarantine([entry({ owner: 'x' })], NOW).map((p) => p.code)).toEqual(['shape']);
    expect(validateQuarantine([entry({ cell: 'button--playground' })], NOW).map((p) => p.code)).toEqual(['cell']);
    expect(validateQuarantine([entry({ cell: 'button--playground|photo|gecko|light.glass.default.standard.1440' })], NOW).map((p) => p.code)).toEqual(['cell']);
    expect(validateQuarantine([entry({ issue: 'flaky' })], NOW).map((p) => p.code)).toEqual(['issue']);
    expect(validateQuarantine([entry({ expires: 'next week' })], NOW).map((p) => p.code)).toEqual(['expires-format']);
    expect(validateQuarantine([entry(), entry()], NOW).map((p) => p.code)).toEqual(['duplicate']);
  });

  it('maps test titles to cells and partitions failures', () => {
    expect(cellOfTitle(`${CELL} @engine-chromium`)).toBe(CELL);
    expect(cellOfTitle('capture plan has no problems @engine-chromium')).toBeNull();
    const f = [{ title: `${CELL} @engine-chromium` }, { title: `${CELL2} @engine-webkit` }];
    expect(partitionQuarantined(f, [entry()])).toEqual({ quarantined: [f[0]], other: [f[1]] });
  });
});

// ---- lane runner integration --------------------------------------------------------------------------------------
const SPEC = 'certification/lanes/x.spec.ts';
const report = (tests: Array<{ title: string; status: 'expected' | 'unexpected'; project?: string }>) => ({
  stats: { expected: tests.filter((t) => t.status === 'expected').length, unexpected: tests.filter((t) => t.status === 'unexpected').length, flaky: 0, skipped: 0 },
  suites: [{ file: 'lanes/x.spec.ts', specs: tests.map((t) => ({ title: t.title, file: 'lanes/x.spec.ts', tests: [{ projectName: t.project ?? 'chromium', status: t.status,
    results: [{ error: t.status === 'unexpected' ? { message: 'pixel diff 0.4 %' } : undefined }] }] })) }],
});
const repoWith = (lane: string, quarantine: unknown[] | null) => makeRepo({
  builtins: `[${row({ lane, kind: 'playwright', path: SPEC, remote: true })}]`,
  files: { [SPEC]: '', ...(quarantine ? { 'certification/quarantine.json': JSON.stringify(quarantine) } : {}) },
});

describe('lane runner: quarantined cells', () => {
  const failingQuarantined = report([{ title: `${CELL} @engine-chromium`, status: 'unexpected' }, { title: `${CELL2} @engine-webkit`, status: 'expected', project: 'webkit' }]);

  it('a failing quarantined cell is `quarantined` (not pass, not blocking) below release', async () => {
    const root = repoWith('L6', [entry({ expires: day(3) })]);
    const r = await runFixture(root, { lane: 'L6', scope: 'main', tools: { playwrightCli: fakePlaywright(root, failingQuarantined, 1) } });
    expect(r.code).toBe(EXIT.ok);
    expect(results(r)[0]).toMatchObject({ state: 'quarantined', quarantined: [CELL] });
    expect(r.manifest).toMatchObject({ summary: { quarantined: 1, pass: 0 }, quarantine: { file: 'certification/quarantine.json', entries: 1, cells: [CELL], quarantined: [CELL] } });
  });

  it('a non-quarantined failure next to a quarantined one still fails', async () => {
    const root = repoWith('L6', [entry({ expires: day(3) })]);
    const both = report([{ title: `${CELL} @engine-chromium`, status: 'unexpected' }, { title: `${CELL2} @engine-webkit`, status: 'unexpected', project: 'webkit' }]);
    const r = await runFixture(root, { lane: 'L6', scope: 'main', tools: { playwrightCli: fakePlaywright(root, both, 1) } });
    expect(r.code).toBe(EXIT.fail);
    expect(results(r)[0]).toMatchObject({ state: 'fail' });
  });

  it('at release scope a quarantined cell is not pass, and any active entry fails the run', async () => {
    const root = repoWith('L6', [entry({ expires: day(3) })]);
    const r = await runFixture(root, { lane: 'L6', scope: 'release', tools: { playwrightCli: fakePlaywright(root, failingQuarantined, 1) } });
    expect(r.code).toBe(EXIT.fail);
    const rows = results(r);
    expect(rows.find((x) => x.path === SPEC)).toMatchObject({ state: 'fail', reason: '1 quarantined cell(s) failed at release scope (quarantined is not pass)' });
    expect(rows.find((x) => x.path === 'certification/quarantine.json')).toMatchObject({ state: 'fail', reason: expect.stringContaining('a release SHA carries no quarantined cell') });
    // even when every test passes, the active entry blocks the release
    const green = repoWith('L6', [entry({ expires: day(3) })]);
    const g = await runFixture(green, { lane: 'L6', scope: 'release', tools: { playwrightCli: fakePlaywright(green, report([{ title: `${CELL} @engine-chromium`, status: 'expected' }]), 0) } });
    expect(g.code).toBe(EXIT.fail);
  });

  it('an expired entry (or one > 7 days out) fails every run until removed', async () => {
    const pass = report([{ title: `${CELL} @engine-chromium`, status: 'expected' }]);
    for (const expires of [day(-1), day(9)]) {
      const root = repoWith('L6', [entry({ expires })]);
      const r = await runFixture(root, { lane: 'L6', scope: 'pr', tools: { playwrightCli: fakePlaywright(root, pass, 0) } });
      expect(r.code).toBe(EXIT.fail);
      expect(results(r).find((x) => x.path === 'certification/quarantine.json')).toMatchObject({ state: 'fail' });
    }
  });
});

describe('nightly L7 double run (≥ 99.9 % agreement)', () => {
  it('agreementOf counts agreeing tests over the union; 0 tests is not ok', () => {
    const a = new Map<string, Outcome>(Array.from({ length: 1000 }, (_, i) => [`t${i}`, 'passed']));
    const b = new Map(a);
    expect(agreementOf(a, b)).toMatchObject({ cells: 1000, agreeing: 1000, ratio: 1, ok: true });
    b.set('t1', 'failed');
    expect(agreementOf(a, b)).toMatchObject({ agreeing: 999, ratio: 0.999, ok: true });
    b.set('t2', 'failed');
    expect(agreementOf(a, b)).toMatchObject({ agreeing: 998, ok: false });
    b.delete('t3');
    expect(agreementOf(a, b).disagreements.find((d) => d.id === 't3')).toEqual({ id: 't3', first: 'passed', second: 'missing' });
    expect(agreementOf(new Map(), new Map()).ok).toBe(false);
    expect(DETERMINISM_MIN_AGREEMENT).toBe(0.999);
  });

  it('playwrightOutcomes keys tests by project/file/title; a flaky retry is a failure', () => {
    const o = playwrightOutcomes({ suites: [{ file: 'f', specs: [{ title: 'a', tests: [{ projectName: 'webkit', status: 'flaky' }, { projectName: 'chromium', status: 'expected' }] }] }] });
    expect([...o]).toEqual([['webkit|f|a', 'failed'], ['chromium|f|a', 'passed']]);
  });

  /** fake Playwright returning reports[n] on its n-th invocation */
  const sequence = (root: string, reports: unknown[]) => fakeTool(root, 'playwright-seq', `const fs = require('node:fs');
const c = ${JSON.stringify(join(root, '.tools/count'))};
const n = fs.existsSync(c) ? Number(fs.readFileSync(c, 'utf8')) : 0;
fs.writeFileSync(c, String(n + 1));
const r = ${JSON.stringify(reports)}[n];
fs.writeFileSync(process.env.PLAYWRIGHT_JSON_OUTPUT_NAME, JSON.stringify(r));
process.exit(r.stats.unexpected ? 1 : 0);\n`);
  const many = (n: number, failing: number[] = []) => report(Array.from({ length: n }, (_, i) => ({ title: `t${i}`, status: failing.includes(i) ? 'unexpected' : 'expected' })));

  it('runs L7 twice at nightly scope and records the agreement ratio in the manifest', async () => {
    const root = repoWith('L7', null);
    const r = await runFixture(root, { lane: 'L7', scope: 'nightly', tools: { playwrightCli: sequence(root, [many(1000), many(1000)]) } });
    expect(r.code).toBe(EXIT.ok);
    expect(results(r)[0]).toMatchObject({ state: 'pass', determinism: { runs: 2, cells: 1000, agreeing: 1000, ratio: 1, ok: true } });
    expect(r.manifest!.determinism).toEqual([expect.objectContaining({ lane: 'L7', path: SPEC, ratio: 1, ok: true, runs: 2 })]);
    expect(readFileSync(join(root, `.artifacts/qual/fixture/playwright-${DOUBLE_RUN_IDX}.json`), 'utf8')).toContain('t999');
  });

  it('fails the row when the two runs agree on < 99.9 % of cells, or the second run fails', async () => {
    const low = repoWith('L7', null);
    const r = await runFixture(low, { lane: 'L7', scope: 'nightly', tools: { playwrightCli: sequence(low, [many(1000), many(1000, [1, 2])]) } });
    expect(r.code).toBe(EXIT.fail);
    expect(results(r)[0]).toMatchObject({ state: 'fail', reason: expect.stringMatching(/^nightly L7 double run: 99\.800 % of 1000 cells agree \(< 99\.9 %\)/) });
    const second = repoWith('L7', null);
    const s = await runFixture(second, { lane: 'L7', scope: 'nightly', tools: { playwrightCli: sequence(second, [many(2000), many(2000, [5])]) } });
    expect(s.code).toBe(EXIT.fail);
    expect(results(s)[0]).toMatchObject({ state: 'fail', determinism: { ok: true } });
  });

  it('runs L7 once below nightly', async () => {
    const root = repoWith('L7', null);
    const r = await runFixture(root, { lane: 'L7', scope: 'main', tools: { playwrightCli: sequence(root, [many(10), many(10, [0])]) } });
    expect(r.code).toBe(EXIT.ok);
    expect(results(r)[0]).not.toHaveProperty('determinism');
  });
});

describe('manifest: fonts and one image digest', () => {
  it('records the job image, its digest (only when pinned by digest) and the fontconfig font list', async () => {
    const root = makeRepo({ builtins: `[${row({ lane: 'L1', kind: 'node-script', path: 'ok.mjs' })}]`, files: { 'ok.mjs': '' } });
    // a stand-in fc-list on PATH prints two fonts (one twice) in the format the runner asks for
    const bin = join(root, '.bin');
    mkdirSync(bin, { recursive: true });
    writeFileSync(join(bin, 'fc-list'), `#!/bin/sh\n[ "$1" = "--format" ] || exit 3\nprintf 'Noto Sans\\t/usr/share/fonts/noto/NotoSans-Regular.ttf\\nDejaVu Sans\\t/usr/share/fonts/dejavu/DejaVuSans.ttf\\nNoto Sans\\t/usr/share/fonts/noto/NotoSans-Regular.ttf\\n'\n`);
    chmodSync(join(bin, 'fc-list'), 0o755);
    const image = `mcr.microsoft.com/playwright:v1.63.0-noble@sha256:${'a'.repeat(64)}`;
    const r = await runFixture(root, { env: { CI_JOB_IMAGE: image, PATH: `${bin}${delimiter}${process.env.PATH}` } });
    expect(r.manifest).toMatchObject({ image, imageDigest: `sha256:${'a'.repeat(64)}` });
    expect(r.manifest!.fonts).toEqual([
      { family: 'DejaVu Sans', file: '/usr/share/fonts/dejavu/DejaVuSans.ttf' },
      { family: 'Noto Sans', file: '/usr/share/fonts/noto/NotoSans-Regular.ttf' },
    ]);
    // no fontconfig on the runner → fonts: null (recorded, not invented)
    const bare = await runFixture(root, { env: { CI_JOB_IMAGE: 'mcr.microsoft.com/playwright:v1.63.0-noble', PATH: dirname(process.execPath) } });
    expect(bare.manifest).toMatchObject({ fonts: null, imageDigest: null, image: 'mcr.microsoft.com/playwright:v1.63.0-noble' });
    expect(imageDigestOf('mcr.microsoft.com/playwright:v1.63.0-noble')).toBeNull();
  });
});

describe('release L6 from the sharded child pipeline (REQ-QUAL-65)', () => {
  it('evaluates L6 from AG_RELEASE_SHARDS instead of re-running it', async () => {
    const sha = 'e'.repeat(40);
    const ok = { ok: true, sha, parallel: 22, cells: 33_000, problems: [], maxShardMs: 3_000_000 };
    const root = makeRepo({ builtins: `[${row({ lane: 'L6', kind: 'playwright', path: SPEC, remote: true })}]`, files: { [SPEC]: '', 'shards.json': JSON.stringify(ok) } });
    const never = fakeTool(root, 'never', 'process.exit(99);\n');
    const r = await runFixture(root, { lane: 'L6', scope: 'release', env: { AG_RELEASE_SHARDS: 'shards.json', CI_COMMIT_SHA: sha }, tools: { playwrightCli: never } });
    expect(results(r)[0]).toMatchObject({ state: 'pass', reason: '22 shard(s), 33000 cells (child pipeline)' });
    expect(r.manifest).toMatchObject({ shards: { file: 'shards.json', parallel: 22, cells: 33_000, ok: true } });
    expect(shardedL6Result({ ...ok, ok: false, problems: ['qual:certify:release-shard 2/22: no lane manifest'] }, sha, 'f')).toMatchObject({ state: 'fail' });
    expect(shardedL6Result({ ...ok, sha: 'f'.repeat(40) }, sha, 'f')).toMatchObject({ state: 'fail' });
    expect(shardedL6Result(null, sha, 'f')).toMatchObject({ state: 'fail', reason: 'AG_RELEASE_SHARDS=f not found (scripts/qual/shard-plan.mjs collect)' });
  });
});

describe('offline worker routing (REQ-QUAL-67)', () => {
  it('only 127.0.0.1 and local schemes stay on the worker', () => {
    expect(isLoopbackUrl('http://127.0.0.1:6006/iframe.html?id=x')).toBe(true);
    expect(isLoopbackUrl('data:image/png;base64,AA==')).toBe(true);
    expect(isLoopbackUrl('http://localhost:6006/')).toBe(false);
    expect(isLoopbackUrl('https://fonts.googleapis.com/css')).toBe(false);
    expect(isLoopbackUrl('http://169.254.169.254/latest/meta-data')).toBe(false);
    expect(isLoopbackUrl('not a url')).toBe(false);
  });
});
