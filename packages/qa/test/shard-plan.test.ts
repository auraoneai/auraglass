/* REQ-QUAL-65 (FIN-425): shard planner — parallel computed from the measured capture rate per runner tag and capped at
   GitLab's 200, the child pipeline derived from the effective qual:certify:l6 job, shard collection through the jobs API
   (fail closed on a missing/stale/failing shard or mixed image digests), and the 5-consecutive-overrun budget report. */
import { afterAll, describe, expect, it } from '@jest/globals';
import { mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import yaml from 'yaml';
import {
  GITLAB_PARALLEL_MAX, SHARD_JOB, appendHistory, budgetReport, childPipeline, collectShards, jobNameSlug, measuredRate, planShards,
  resolveJob, runnerTags, shardJobNames, type BudgetRun, type ShardManifest,
} from '../src/matrix/shardPlan.ts';
import { CAPTURES_PER_CELL, SHARD_SECONDS, shardOf } from '../src/matrix/shard.ts';
import * as impl from '../src/matrix/shardPlan.ts';
import { main as shardPlanMain } from '../../../scripts/qual/shard-plan.mjs';
import { REPO } from './helpers/laneFixture.ts';

type CliOpts = { env?: Record<string, string>; fetchImpl?: typeof fetch; now?: () => Date };
const shardPlanCli = (argv: string[], o: CliOpts = {}) => shardPlanMain(argv, { ...o, impl });

const TAG = 'saas-linux-large-amd64';
const docs = [yaml.parse(readFileSync(join(REPO, 'ci/qual.gitlab-ci.yml'), 'utf8')), yaml.parse(readFileSync(join(REPO, '.gitlab-ci.yml'), 'utf8'))];
const rate = (r: number, n = 1) => ({ runnerTag: TAG, rate: r, samples: n, sources: ['fixture'] });
const tmp: string[] = [];
afterAll(() => { for (const d of tmp) rmSync(d, { recursive: true, force: true }); });

describe('measured capture rate per runner tag', () => {
  it('parses CI_RUNNER_TAGS (JSON array or comma list)', () => {
    expect(runnerTags('["saas-linux-large-amd64","x"]')).toEqual(['saas-linux-large-amd64', 'x']);
    expect(runnerTags('b, a')).toEqual(['a', 'b']);
    expect(runnerTags(null)).toEqual([]);
  });

  it('takes the median of the rates measured on the tag and ignores other tags and missing rates', () => {
    const r = measuredRate([
      { source: 'n1', runnerTag: `["${TAG}"]`, captureRate: 1.0 },
      { source: 'n2', runnerTag: `["${TAG}"]`, captureRate: 3.0 },
      { source: 'n3', runnerTag: `["${TAG}"]`, captureRate: 2.0 },
      { source: 'gpu', runnerTag: '["saas-linux-medium-amd64-gpu-standard"]', captureRate: 50 },
      { source: 'none', runnerTag: `["${TAG}"]`, captureRate: null },
    ], TAG);
    expect(r).toEqual({ runnerTag: TAG, rate: 2.0, samples: 3, sources: ['n1', 'n2', 'n3'] });
  });

  it('never assumes a rate: no measurement on the tag throws', () => {
    expect(() => measuredRate([{ source: 'gpu', runnerTag: '["other"]', captureRate: 2 }], TAG)).toThrow(/no measured capture rate for runner tag saas-linux-large-amd64/);
    expect(() => measuredRate([], TAG)).toThrow(/never assumed/);
  });
});

describe('planShards: parallel = ceil(captures ÷ (rate × 3600)), ≤ 200', () => {
  it('computes the shard count from the rate (each shard ≤ 60 min of captures)', () => {
    // 33,000 cells × 3 = 99,000 captures at 1.26 /s → 99,000 / 4,536 = 21.8 → 22 shards
    const p = planShards({ cells: 33_000, rate: rate(1.26), sha: 'abc' });
    expect(p.captures).toBe(33_000 * CAPTURES_PER_CELL);
    expect(p.computed).toBe(Math.ceil((33_000 * 3) / (1.26 * SHARD_SECONDS)));
    expect(p.computed).toBe(22);
    expect(p).toMatchObject({ parallel: 22, capped: false, runnerTag: TAG, sha: 'abc' });
    expect(p.projectedShardMinutes).toBeLessThanOrEqual(60);
    // twice the rate → half the shards
    expect(planShards({ cells: 33_000, rate: rate(2.52), sha: null }).parallel).toBe(11);
  });

  it('caps parallel at 200 (GitLab limit) and flags the cap', () => {
    const p = planShards({ cells: 33_000, rate: rate(0.01), sha: null });
    expect(p.computed).toBeGreaterThan(GITLAB_PARALLEL_MAX);
    expect(p.parallel).toBe(200);
    expect(p.capped).toBe(true);
    expect(p.jobNames).toHaveLength(200);
    expect(p.projectedShardMinutes).toBeGreaterThan(60);
  });

  it('a single shard keeps the bare job name; 0 cells fails', () => {
    const p = planShards({ cells: 10, rate: rate(5), sha: null });
    expect(p.parallel).toBe(1);
    expect(p.jobNames).toEqual([SHARD_JOB]);
    expect(() => planShards({ cells: 0, rate: rate(5), sha: null })).toThrow(/0 cells/);
    expect(() => shardJobNames(201)).toThrow();
    expect(shardJobNames(3)).toEqual([`${SHARD_JOB} 1/3`, `${SHARD_JOB} 2/3`, `${SHARD_JOB} 3/3`]);
  });

  it('CI_JOB_NAME_SLUG of a parallel shard job', () => {
    expect(jobNameSlug('qual:certify:release-shard 3/40')).toBe('qual-certify-release-shard-3-40');
    expect(jobNameSlug('qual:certify:nightly')).toBe('qual-certify-nightly');
  });
});

describe('child pipeline (shards.gitlab-ci.yml)', () => {
  const plan = planShards({ cells: 33_000, rate: rate(1.26), sha: 'f'.repeat(40) });
  const child = childPipeline(plan, docs) as Record<string, Record<string, unknown>>;
  const job = child[SHARD_JOB]!;
  const l6 = resolveJob('qual:certify:l6', docs);

  it('is the effective qual:certify:l6 job with parallel = the plan', () => {
    expect(Object.keys(child)).toEqual(['stages', SHARD_JOB]);
    expect(job.parallel).toBe(22);
    expect(job.script).toEqual(l6.script);
    expect(job.image).toBe('$AG_PLAYWRIGHT_IMAGE');
    expect(job.before_script).toEqual(l6.before_script);
    expect(job.tags).toEqual([TAG]);
  });

  it('runs at release scope on the remote runner, takes its inputs from the parent pipeline, never allows failure', () => {
    expect(job.variables).toMatchObject({ AG_SCOPE: 'release', AG_LINE: '5x', AG_REMOTE_RUNNER: '1', AG_SHARD_PLAN_SHA: 'f'.repeat(40) });
    expect(job.needs).toEqual([
      { pipeline: '$PARENT_PIPELINE_ID', job: 'qual:build:storybook' },
      { pipeline: '$PARENT_PIPELINE_ID', job: 'plat:package:pack' },
    ]);
    for (const k of ['rules', 'allow_failure', 'when', 'trigger', 'dependencies', 'after_script']) expect(job).not.toHaveProperty(k);
    expect(job.artifacts).toMatchObject({ expire_in: '90 days', name: 'evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA', paths: ['.artifacts/qual/$CI_JOB_NAME_SLUG/'] });
  });

  it('omits parallel for a single shard and refuses a lane job that no longer runs the L6 command', () => {
    expect((childPipeline(planShards({ cells: 10, rate: rate(5), sha: null }), docs) as Record<string, Record<string, unknown>>)[SHARD_JOB]).not.toHaveProperty('parallel');
    const broken = [{ ...docs[0], 'qual:certify:l6': { extends: '.qual-browser-lane', script: ['echo nope'] } }, docs[1]];
    expect(() => childPipeline(plan, broken)).toThrow(/no longer runs the L6 lane command/);
  });

  it('shard assignment covers every cell exactly once', () => {
    const ids = Array.from({ length: 2000 }, (_, i) => `story-${i}--default|photo|chromium|light.clear.default.T1.desktop`);
    const counts = new Map<number, number>();
    for (const id of ids) counts.set(shardOf(id, 7), (counts.get(shardOf(id, 7)) ?? 0) + 1);
    expect([...counts.keys()].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect([...counts.values()].reduce((a, b) => a + b, 0)).toBe(2000);
  });
});

describe('collectShards (release job, jobs API)', () => {
  const sha = 'a'.repeat(40);
  const digest = `sha256:${'d'.repeat(64)}`;
  const plan = { ...planShards({ cells: 6, rate: rate(0.002), sha }), };
  const good = (cells: number): ShardManifest => ({ sha, scope: 'release', lane: 'L6', imageDigest: digest, captureRate: 1.2, durationMs: 60_000,
    cells: Array.from({ length: cells }, (_, i) => `c${i}`), results: [{ lane: 'L6', state: 'pass', path: 'certification/lanes/environment-visual.spec.ts' }] });

  it('passes when every planned shard is present, current, passing and on one image digest', async () => {
    expect(plan.parallel).toBe(3);
    const seen: string[] = [];
    const s = await collectShards(plan, sha, async (job, path) => { seen.push(`${job} ${path}`); return good(2); });
    expect(s.ok).toBe(true);
    expect(s.cells).toBe(6);
    expect(s.imageDigest).toBe(digest);
    expect(seen).toEqual([1, 2, 3].map((i) => `${SHARD_JOB} ${i}/3 .artifacts/qual/qual-certify-release-shard-${i}-3/lane-manifest.json`));
  });

  it('fails closed on a missing shard, a stale SHA, a failing row, mixed or missing digests and a cell-count gap', async () => {
    const missing = await collectShards(plan, sha, async (job) => (job.endsWith('2/3') ? null : good(2)));
    expect(missing.ok).toBe(false);
    expect(missing.shards[1]!.state).toBe('missing');
    const stale = await collectShards(plan, sha, async () => ({ ...good(2), sha: 'b'.repeat(40) }));
    expect(stale.problems.join('\n')).toMatch(/stale or foreign artifact/);
    const failing = await collectShards(plan, sha, async (job) => (job.endsWith('3/3') ? { ...good(2), results: [{ lane: 'L6', state: 'fail', path: 'x', reason: 'boom' }] } : good(2)));
    expect(failing.ok).toBe(false);
    expect(failing.problems.join('\n')).toMatch(/1 non-pass row\(s\): x fail \(boom\)/);
    const mixed = await collectShards(plan, sha, async (job) => ({ ...good(2), imageDigest: job.endsWith('1/3') ? `sha256:${'e'.repeat(64)}` : digest }));
    expect(mixed.problems.join('\n')).toMatch(/2 image digests/);
    const noDigest = await collectShards(plan, sha, async () => ({ ...good(2), imageDigest: null }));
    expect(noDigest.problems.join('\n')).toMatch(/no image digest/);
    const gap = await collectShards(plan, sha, async () => good(1));
    expect(gap.problems).toEqual(['shards captured 3 cells, the plan has 6']);
    const thrown = await collectShards(plan, sha, async () => { throw new Error('HTTP 500'); });
    expect(thrown.problems[0]).toMatch(/HTTP 500/);
  });
});

describe('budgets (reported, never failing)', () => {
  const run = (min: number, i: number, scope: BudgetRun['scope'] = 'release'): BudgetRun => ({ sha: null, pipelineId: String(i), job: 'qual:certify:release', scope, durationMs: min * 60_000, at: '' });

  it('reports an overrun on 5 consecutive runs only', () => {
    let h: BudgetRun[] = [];
    for (const [i, m] of [95, 80, 91, 92, 93, 94].entries()) h = appendHistory(h, run(m, i));
    expect(budgetReport(h, 'release')).toMatchObject({ budgetMinutes: 90, overrunStreak: 4, overrun5: false });
    h = appendHistory(h, run(99, 7));
    expect(budgetReport(h, 'release')).toMatchObject({ overrunStreak: 5, overrun5: true, lastDurationsMinutes: [91, 92, 93, 94, 99] });
    expect(budgetReport([run(19, 1, 'pr'), run(21, 2, 'pr')], 'pr')).toMatchObject({ budgetMinutes: 20, overrunStreak: 1, p90Minutes: 21 });
  });

  it('keeps one entry per pipeline/job and at most 50', () => {
    let h: BudgetRun[] = [];
    for (let i = 0; i < 60; i++) h = appendHistory(h, run(10, i));
    expect(h).toHaveLength(50);
    h = appendHistory(h, run(12, 59));
    expect(h.filter((x) => x.pipelineId === '59')).toHaveLength(1);
  });
});

describe('scripts/qual/shard-plan.mjs', () => {
  const dir = () => { const d = mkdtempSync(join(tmpdir(), 'ag-shards-')); tmp.push(d); return d; };
  const writeJson = (p: string, v: unknown) => { mkdirSync(join(p, '..'), { recursive: true }); writeFileSync(p, JSON.stringify(v)); };

  it('plan: writes shards.json and the child YAML from a capture plan and measured manifests', async () => {
    const d = dir();
    writeJson(join(d, 'plan.json'), { scope: 'release', sha: null, cellsTotal: 33_000 });
    writeJson(join(d, 'nightly.json'), { runnerTag: `["${TAG}"]`, captureRate: 1.26, sha: 'x', scope: 'nightly' });
    const code = await shardPlanCli(['plan', '--cells-from', join(d, 'plan.json'), '--rates', join(d, 'nightly.json'), '--out-dir', join(d, 'out')], { env: {} });
    expect(code).toBe(0);
    const plan = JSON.parse(readFileSync(join(d, 'out/shards.json'), 'utf8'));
    expect(plan).toMatchObject({ parallel: 22, runnerTag: TAG, cells: 33_000 });
    const child = yaml.parse(readFileSync(join(d, 'out/shards.gitlab-ci.yml'), 'utf8'));
    expect(child[SHARD_JOB].parallel).toBe(22);
  });

  it('plan: exits 1 without a measured rate on the tag, or for a non-release capture plan; 64 on usage', async () => {
    const d = dir();
    writeJson(join(d, 'plan.json'), { scope: 'release', cellsTotal: 100 });
    writeJson(join(d, 'gpu.json'), { runnerTag: '["gpu"]', captureRate: 3 });
    expect(await shardPlanCli(['plan', '--cells-from', join(d, 'plan.json'), '--rates', join(d, 'gpu.json'), '--out-dir', join(d, 'o')], { env: {} })).toBe(1);
    writeJson(join(d, 'pr.json'), { scope: 'pr', cellsTotal: 100 });
    writeJson(join(d, 'ok.json'), { runnerTag: `["${TAG}"]`, captureRate: 3 });
    expect(await shardPlanCli(['plan', '--cells-from', join(d, 'pr.json'), '--rates', join(d, 'ok.json'), '--out-dir', join(d, 'o')], { env: {} })).toBe(1);
    expect(await shardPlanCli(['plan', '--cells-from', join(d, 'plan.json'), '--out-dir', join(d, 'o')], { env: {} })).toBe(64);
    expect(await shardPlanCli(['bogus'], { env: {} })).toBe(64);
  });

  it('plan --rates-from-job and collect use the jobs API with JOB-TOKEN for this project and ref', async () => {
    const d = dir();
    const sha = 'c'.repeat(40);
    const digest = `sha256:${'d'.repeat(64)}`;
    writeJson(join(d, 'plan.json'), { scope: 'release', sha, cellsTotal: 4 });
    const calls: Array<{ url: string; token: string | undefined }> = [];
    const env = { CI_API_V4_URL: 'https://gitlab.example/api/v4', CI_PROJECT_ID: '87152036', CI_JOB_TOKEN: 'job-token', CI_COMMIT_SHA: sha, CI_COMMIT_REF_NAME: 'v5.0.0-rc.1' };
    const fetchImpl = async (url: string, init?: { headers?: Record<string, string> }) => {
      calls.push({ url, token: init?.headers?.['JOB-TOKEN'] });
      const body = url.includes('qual-certify-nightly')
        ? { runnerTag: `["${TAG}"]`, captureRate: 0.002 }
        : { sha, scope: 'release', lane: 'L6', imageDigest: digest, cells: ['a', 'b'], results: [{ lane: 'L6', state: 'pass', path: 'p' }] };
      return { status: 200, ok: true, text: async () => JSON.stringify(body) } as Response;
    };
    expect(await shardPlanCli(['plan', '--cells-from', join(d, 'plan.json'), '--rates-from-job', 'qual:certify:nightly', '--out-dir', join(d, 'out')], { env, fetchImpl: fetchImpl as typeof fetch })).toBe(0);
    expect(calls[0]).toEqual({ url: 'https://gitlab.example/api/v4/projects/87152036/jobs/artifacts/next/raw/.artifacts/qual/qual-certify-nightly/lane-manifest.json?job=qual%3Acertify%3Anightly', token: 'job-token' });
    const plan = JSON.parse(readFileSync(join(d, 'out/shards.json'), 'utf8'));
    expect(plan.parallel).toBe(2);
    calls.length = 0;
    expect(await shardPlanCli(['collect', '--plan', join(d, 'out/shards.json'), '--out', join(d, 'summary.json')], { env, fetchImpl: fetchImpl as typeof fetch })).toBe(0);
    expect(calls.map((c) => c.url)).toEqual([1, 2].map((i) => `https://gitlab.example/api/v4/projects/87152036/jobs/artifacts/v5.0.0-rc.1/raw/.artifacts/qual/qual-certify-release-shard-${i}-2/lane-manifest.json?job=${encodeURIComponent(`${SHARD_JOB} ${i}/2`)}`));
    expect(JSON.parse(readFileSync(join(d, 'summary.json'), 'utf8'))).toMatchObject({ ok: true, cells: 4, parallel: 2 });
    const notFound = async () => ({ status: 404, ok: false, text: async () => '' }) as Response;
    expect(await shardPlanCli(['collect', '--plan', join(d, 'out/shards.json'), '--out', join(d, 's2.json')], { env, fetchImpl: notFound as typeof fetch })).toBe(1);
    expect(JSON.parse(readFileSync(join(d, 's2.json'), 'utf8')).shards.map((s: { state: string }) => s.state)).toEqual(['missing', 'missing']);
  });

  it('budget: appends this job and reports, exit 0 even when over budget', async () => {
    const d = dir();
    const env = { CI_JOB_NAME: 'qual:certify:release', CI_JOB_NAME_SLUG: 'qual-certify-release', CI_PIPELINE_ID: '9', CI_JOB_STARTED_AT: '2026-10-10T00:00:00Z' };
    const code = await shardPlanCli(['budget', '--scope', 'release', '--out-dir', d], { env, now: () => new Date('2026-10-10T02:00:00Z') });
    expect(code).toBe(0);
    expect(JSON.parse(readFileSync(join(d, 'budget-report.json'), 'utf8'))).toMatchObject({ scope: 'release', budgetMinutes: 90, overrunStreak: 1, overrun5: false, measured: true, historySource: 'none' });
    // pipeline wall time wins over the job start
    const d2 = dir();
    await shardPlanCli(['budget', '--scope', 'pr', '--out-dir', d2], { env: { ...env, CI_PIPELINE_CREATED_AT: '2026-10-10T01:45:00Z' }, now: () => new Date('2026-10-10T02:00:00Z') });
    expect(JSON.parse(readFileSync(join(d2, 'budget-history.json'), 'utf8'))).toEqual([expect.objectContaining({ scope: 'pr', durationMs: 15 * 60_000, pipelineId: '9' })]);
  });
});

describe('ci/qual.gitlab-ci.yml wiring (REQ-QUAL-65)', () => {
  const q = docs[0] as Record<string, Record<string, unknown>>;
  const script = (j: string) => JSON.stringify(resolveJob(j, docs).script);

  it('qual:certify:release-plan plans from the release capture plan and the nightly-measured rate', () => {
    const plan = resolveJob('qual:certify:release-plan', docs);
    expect(plan.tags).toEqual([TAG]);
    expect(script('qual:certify:release-plan')).toContain('--list --project chromium certification/lanes/environment-visual.spec.ts');
    expect(script('qual:certify:release-plan')).toContain('scripts/qual/shard-plan.mjs plan --cells-from .artifacts/qual/$CI_JOB_NAME_SLUG/environment-visual/plan.json --rates-from-job qual:certify:nightly --rates-ref next');
    expect(JSON.stringify(q['qual:certify:release-plan']!.rules)).toContain('$AG_SCOPE == \\"release\\"');
    expect(plan.allow_failure).toBeUndefined();
  });

  it('qual:certify:release needs the plan and the matrix, collects the shards and feeds them to the lane runner', () => {
    const needs = q['qual:certify:release']!.needs as Array<{ job: string }>;
    expect(needs.map((n) => n.job)).toEqual(expect.arrayContaining(['qual:certify:release-plan', 'qual:certify:release-matrix']));
    expect(script('qual:certify:release')).toContain('scripts/qual/shard-plan.mjs collect --plan .artifacts/qual/qual-certify-release-plan/shards.json');
    expect(script('qual:certify:release')).toContain('AG_RELEASE_SHARDS=.artifacts/qual/$CI_JOB_NAME_SLUG/shards-summary.json');
    expect(script('qual:certify:release')).toContain('node certification/run.mjs --lane all --scope release');
    expect(jobNameSlug('qual:certify:release-plan')).toBe('qual-certify-release-plan');
  });

  it('the release matrix fails closed at release scope until its child trigger can land', () => {
    expect(resolveJob('qual:certify:release-matrix', docs).allow_failure).toBeUndefined();
    expect(script('qual:certify:release-matrix')).toMatch(/exit 1/);
  });

  it('budgets are reported after the heaviest PR/main lane and the release job', () => {
    expect(JSON.stringify(q['qual:certify:l6']!.after_script)).toContain('scripts/qual/shard-plan.mjs budget --scope $AG_SCOPE');
    expect(JSON.stringify(q['qual:certify:release']!.after_script)).toContain('scripts/qual/shard-plan.mjs budget --scope release');
  });
});
