/* REQ-QUAL-65 time budgets and sharding (QUAL, FIN-425). Implementation of scripts/qual/shard-plan.mjs.

   The release capture matrix (L6 at release scope) runs as a dynamic child pipeline. The planner
   (`shard-plan.mjs plan`) reads
   - the release capture plan (`plan.json` written by certification/lanes/environment-visual.spec.ts at collection
     time, `cellsTotal`), and
   - the measured capture rate per runner tag from earlier lane manifests (`captureRate` + `runnerTag`, recorded by every
     L6 run; nightly is the usual source). A rate is never assumed: no measurement for the runner tag fails the plan.
   It computes `shards = ceil(captures ÷ (rate × 3,600))` (packages/qa/src/matrix/shard.ts), caps `parallel` at
   GITLAB_PARALLEL_MAX (200), and writes the child pipeline YAML: one `qual:certify:release-shard` job with
   `parallel: <n>` derived from the effective `qual:certify:l6` job (same image, before_script and script), so the child
   never drifts from the lane job. The release job (`shard-plan.mjs collect`) downloads every shard's lane manifest
   through the jobs API with CI_JOB_TOKEN (same project) and the lane runner uses that summary for L6 at release.

   Budgets (`shard-plan.mjs budget`): PR QUAL jobs ≤ 20 min, main ≤ 45, release ≤ 90. Each run appends its duration to
   a carried-forward history; an overrun on 5 consecutive runs is reported (budget-report.json, for the GA dashboard)
   and never fails a release. */
import { CAPTURES_PER_CELL, captureCount, shardCount, SHARD_SECONDS } from './shard.ts';

export const GITLAB_PARALLEL_MAX = 200;
export const SHARD_JOB = 'qual:certify:release-shard';
export const PLAN_FILE = 'shards.json';
export const CHILD_FILE = 'shards.gitlab-ci.yml';
export const BUDGET_MINUTES = { pr: 20, main: 45, release: 90 } as const;
export const OVERRUN_STREAK = 5;
export const HISTORY_MAX = 50;

// ---------------------------------------------------------------- runner tags and measured rates

/** CI_RUNNER_TAGS is a JSON array string (`["saas-linux-large-amd64"]`); older runners give a comma list. */
export function runnerTags(value: string | null | undefined): string[] {
  if (!value) return [];
  const v = value.trim();
  if (v.startsWith('[')) {
    try { return (JSON.parse(v) as unknown[]).map(String).map((s) => s.trim()).filter(Boolean).sort(); } catch { /* fall through */ }
  }
  return v.split(',').map((s) => s.trim()).filter(Boolean).sort();
}

export interface RateSample { source: string; runnerTag: string | null; captureRate: number | null; sha?: string | null; scope?: string | null }
export interface MeasuredRate { runnerTag: string; rate: number; samples: number; sources: string[] }

/** Median of the measured capture rates (captures/s) recorded on `runnerTag`. Throws when none is measured. */
export function measuredRate(samples: readonly RateSample[], runnerTag: string): MeasuredRate {
  const usable = samples.filter((s) => runnerTags(s.runnerTag).includes(runnerTag) && typeof s.captureRate === 'number' && Number.isFinite(s.captureRate) && s.captureRate > 0);
  if (!usable.length) {
    const seen = [...new Set(samples.flatMap((s) => runnerTags(s.runnerTag)))];
    throw new Error(`shard-plan: no measured capture rate for runner tag ${runnerTag} in ${samples.length} lane manifest(s)`
      + ` (tags seen: ${seen.join(', ') || 'none'}). The rate is measured by an L6 run on that tag (qual:certify:nightly); it is never assumed.`);
  }
  const rates = usable.map((s) => s.captureRate as number).sort((a, b) => a - b);
  const mid = Math.floor(rates.length / 2);
  const rate = rates.length % 2 ? rates[mid]! : (rates[mid - 1]! + rates[mid]!) / 2;
  return { runnerTag, rate, samples: usable.length, sources: usable.map((s) => s.source) };
}

// ---------------------------------------------------------------- the plan

export interface ShardPlan {
  version: 1;
  sha: string | null;
  scope: 'release';
  runnerTag: string;
  cells: number;
  capturesPerCell: number;
  captures: number;
  captureRate: number;
  rateSamples: number;
  rateSources: string[];
  /** shards the formula asks for (each ≤ 60 min of captures) */
  computed: number;
  /** min(computed, 200): the child job's `parallel` */
  parallel: number;
  capped: boolean;
  /** captures per shard ÷ rate, minutes */
  projectedShardMinutes: number;
  jobNames: string[];
}

export function planShards(o: { cells: number; rate: MeasuredRate; sha: string | null; capturesPerCell?: number }): ShardPlan {
  const capturesPerCell = o.capturesPerCell ?? CAPTURES_PER_CELL;
  if (o.cells < 1) throw new Error('shard-plan: the release capture plan has 0 cells — a release cannot pass without its matrix');
  const captures = captureCount(o.cells, capturesPerCell);
  const computed = shardCount(captures, o.rate.rate);
  const parallel = Math.min(computed, GITLAB_PARALLEL_MAX);
  const projectedShardMinutes = Math.round((Math.ceil(captures / parallel) / o.rate.rate / 60) * 10) / 10;
  return {
    version: 1, sha: o.sha, scope: 'release', runnerTag: o.rate.runnerTag, cells: o.cells, capturesPerCell, captures,
    captureRate: o.rate.rate, rateSamples: o.rate.samples, rateSources: o.rate.sources,
    computed, parallel, capped: computed > parallel, projectedShardMinutes, jobNames: shardJobNames(parallel),
  };
}

/** GitLab names parallel jobs `<name> <i>/<n>`; a single shard keeps the bare name (`parallel` needs ≥ 2). */
export function shardJobNames(parallel: number): string[] {
  if (!Number.isInteger(parallel) || parallel < 1 || parallel > GITLAB_PARALLEL_MAX) throw new Error(`shard-plan: parallel must be 1..${GITLAB_PARALLEL_MAX} (got ${parallel})`);
  return parallel === 1 ? [SHARD_JOB] : Array.from({ length: parallel }, (_, i) => `${SHARD_JOB} ${i + 1}/${parallel}`);
}

/** GitLab's CI_JOB_NAME_SLUG: lower case, everything but [0-9a-z] → '-', ≤ 63 bytes, no leading/trailing '-'. */
export function jobNameSlug(name: string): string {
  return name.toLowerCase().replace(/[^0-9a-z]/g, '-').slice(0, 63).replace(/^-+|-+$/g, '');
}

// ---------------------------------------------------------------- the child pipeline

type Job = Record<string, unknown>;
type Doc = Record<string, Job>;

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

/** GitLab `extends` semantics: hashes deep-merge, everything else (arrays included) is replaced; parents in order. */
export function resolveJob(name: string, docs: readonly Doc[], seen: ReadonlySet<string> = new Set()): Job {
  if (seen.has(name)) throw new Error(`shard-plan: extends cycle at ${name}`);
  const def = docs.map((d) => d[name]).find((d) => d !== undefined);
  if (!def) throw new Error(`shard-plan: job or template ${name} not found`);
  const parents = ([] as string[]).concat((def.extends as string | string[] | undefined) ?? []);
  let out: Job = {};
  for (const p of parents) out = deepMerge(out, resolveJob(p, docs, new Set([...seen, name])));
  const { extends: _e, ...own } = def;
  return deepMerge(out, own);
}

function deepMerge(a: Job, b: Job): Job {
  const out: Job = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = isObj(v) && isObj(out[k]) ? deepMerge(out[k] as Job, v) : v;
  return out;
}

/** Keys of a resolved lane job that do not belong in the child job (parent-only scheduling, the activation flag and the
    parent's budget report — the release budget is reported once, by qual:certify:release). */
const DROP = ['rules', 'needs', 'dependencies', 'allow_failure', 'when', 'stage', 'parallel', 'trigger', 'only', 'except', 'after_script'];

/** The child pipeline: `qual:certify:release-shard` = the effective `qual:certify:l6` job on the planned runner tag,
    `parallel: <n>`, inputs from the parent pipeline (`needs:pipeline:job`), release-scope variables and 90-day evidence.
    The release scope never allows failure. */
export function childPipeline(plan: ShardPlan, docs: readonly Doc[], laneJob = 'qual:certify:l6'): Doc {
  const base = resolveJob(laneJob, docs);
  const job: Job = Object.fromEntries(Object.entries(base).filter(([k]) => !DROP.includes(k)));
  const script = (job.script ?? []) as unknown[];
  if (!script.some((l) => typeof l === 'string' && /certification\/run\.mjs --lane L6 --scope \$AG_SCOPE/.test(l))) {
    throw new Error(`shard-plan: ${laneJob} no longer runs the L6 lane command; refusing to generate a child pipeline from it`);
  }
  const vars = isObj(job.variables) ? job.variables : {};
  return {
    stages: ['certify'] as unknown as Job,
    [SHARD_JOB]: {
      ...job,
      stage: 'certify',
      tags: [plan.runnerTag],
      ...(plan.parallel > 1 ? { parallel: plan.parallel } : {}),
      needs: [
        { pipeline: '$PARENT_PIPELINE_ID', job: 'qual:build:storybook' },
        { pipeline: '$PARENT_PIPELINE_ID', job: 'plat:package:pack' },
      ],
      variables: { ...vars, AG_SCOPE: 'release', AG_LINE: '5x', AG_REMOTE_RUNNER: '1', AG_SHARD_PLAN_SHA: plan.sha ?? '' },
      // ≤ 60 min of captures per shard (formula) + setup; the 90-minute release budget is measured, not enforced here.
      timeout: '80m',
      artifacts: {
        name: 'evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA', when: 'always', expire_in: '90 days',
        paths: ['.artifacts/qual/$CI_JOB_NAME_SLUG/'],
      },
    },
  };
}

// ---------------------------------------------------------------- collection (release job)

export interface ShardManifest { sha?: string | null; scope?: string; lane?: string; imageDigest?: string | null; runnerTag?: string | null;
  captureRate?: number | null; durationMs?: number; captures?: number; cells?: unknown[]; summary?: Record<string, number>;
  results?: Array<{ lane?: string; state?: string; path?: string; reason?: string }> }

export interface ShardsSummary {
  version: 1; sha: string | null; parallel: number; ok: boolean; problems: string[];
  imageDigest: string | null; cells: number; captures: number; maxShardMs: number | null;
  shards: Array<{ job: string; slug: string; state: 'pass' | 'fail' | 'missing'; captureRate: number | null; durationMs: number | null; cells: number; reason?: string }>;
}

export type FetchManifest = (job: string, path: string) => Promise<ShardManifest | null>;

/** Downloads every planned shard's lane manifest and checks it: present, same SHA as this pipeline, release scope,
    L6, no failing/pending row, one image digest across all shards. Any gap fails the summary (fail closed). */
export async function collectShards(plan: ShardPlan, sha: string, fetchManifest: FetchManifest): Promise<ShardsSummary> {
  const problems: string[] = [];
  const shards: ShardsSummary['shards'] = [];
  const digests = new Set<string | null>();
  for (const job of plan.jobNames) {
    const slug = jobNameSlug(job);
    const path = `.artifacts/qual/${slug}/lane-manifest.json`;
    let m: ShardManifest | null = null;
    let err: string | null = null;
    try { m = await fetchManifest(job, path); } catch (e) { err = (e as Error).message; }
    if (!m) {
      const reason = `no lane manifest for ${job} (${path})${err ? `: ${err}` : ''}`;
      problems.push(reason);
      shards.push({ job, slug, state: 'missing', captureRate: null, durationMs: null, cells: 0, reason });
      continue;
    }
    const why: string[] = [];
    if (m.sha !== sha) why.push(`sha ${m.sha ?? 'null'} ≠ pipeline ${sha} (stale or foreign artifact)`);
    if (m.scope !== 'release') why.push(`scope ${m.scope}`);
    if (m.lane !== 'L6') why.push(`lane ${m.lane}`);
    const bad = (m.results ?? []).filter((r) => r.state !== 'pass');
    if (!(m.results ?? []).length) why.push('no results');
    if (bad.length) why.push(`${bad.length} non-pass row(s): ${bad.slice(0, 3).map((r) => `${r.path} ${r.state}${r.reason ? ` (${r.reason})` : ''}`).join('; ')}`);
    digests.add(m.imageDigest ?? null);
    const cells = Array.isArray(m.cells) ? m.cells.length : 0;
    shards.push({ job, slug, state: why.length ? 'fail' : 'pass', captureRate: m.captureRate ?? null, durationMs: m.durationMs ?? null, cells, ...(why.length ? { reason: why.join('; ') } : {}) });
    if (why.length) problems.push(`${job}: ${why.join('; ')}`);
  }
  const present = [...digests];
  if (present.includes(null)) problems.push('a shard recorded no image digest (REQ-QUAL-66: one image digest per run; pin AG_PLAYWRIGHT_IMAGE by digest)');
  if (present.filter(Boolean).length > 1) problems.push(`shards ran on ${present.filter(Boolean).length} image digests (REQ-QUAL-66: one per run): ${present.filter(Boolean).join(', ')}`);
  const cells = shards.reduce((n, s) => n + s.cells, 0);
  if (!problems.length && cells !== plan.cells) problems.push(`shards captured ${cells} cells, the plan has ${plan.cells}`);
  const durations = shards.map((s) => s.durationMs).filter((d): d is number => typeof d === 'number');
  return {
    version: 1, sha, parallel: plan.parallel, ok: problems.length === 0, problems,
    imageDigest: present.length === 1 ? present[0]! : null, cells, captures: cells * plan.capturesPerCell,
    maxShardMs: durations.length ? Math.max(...durations) : null, shards,
  };
}

// ---------------------------------------------------------------- budgets

export interface BudgetRun { sha: string | null; pipelineId: string | null; job: string; scope: keyof typeof BUDGET_MINUTES; durationMs: number; at: string }
export interface BudgetReport { scope: keyof typeof BUDGET_MINUTES; budgetMinutes: number; runs: number; lastDurationsMinutes: number[]; overrunStreak: number; overrun5: boolean; p90Minutes: number | null }

/** Appends `run` (dropping a repeat of the same pipeline/job) and keeps the newest HISTORY_MAX entries. */
export function appendHistory(history: readonly BudgetRun[], run: BudgetRun): BudgetRun[] {
  const rest = history.filter((h) => !(h.pipelineId && h.pipelineId === run.pipelineId && h.job === run.job));
  return [...rest, run].slice(-HISTORY_MAX);
}

/** Consecutive overruns (newest first) of the job's scope budget; reported, never failing. */
export function budgetReport(history: readonly BudgetRun[], scope: keyof typeof BUDGET_MINUTES): BudgetReport {
  const runs = history.filter((h) => h.scope === scope);
  const budgetMs = BUDGET_MINUTES[scope] * 60_000;
  let streak = 0;
  for (let i = runs.length - 1; i >= 0 && runs[i]!.durationMs > budgetMs; i--) streak++;
  const sorted = runs.map((r) => r.durationMs).sort((a, b) => a - b);
  const p90 = sorted.length ? sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.9) - 1)]! : null;
  return {
    scope, budgetMinutes: BUDGET_MINUTES[scope], runs: runs.length,
    lastDurationsMinutes: runs.slice(-OVERRUN_STREAK).map((r) => Math.round(r.durationMs / 6000) / 10),
    overrunStreak: streak, overrun5: streak >= OVERRUN_STREAK, p90Minutes: p90 === null ? null : Math.round(p90 / 6000) / 10,
  };
}

export { SHARD_SECONDS };
