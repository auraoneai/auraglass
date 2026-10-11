#!/usr/bin/env node
/* scripts/qual/shard-plan.mjs — REQ-QUAL-65 release-matrix shard planner, shard collector and budget report (QUAL, FIN-425).
   Implementation: packages/qa/src/matrix/shardPlan.ts (unit-tested in packages/qa/test/shard-plan.test.ts); this CLI
   compiles it with esbuild like certification/run.mjs.

   node scripts/qual/shard-plan.mjs plan --cells-from <plan.json> --out-dir <dir>
       [--rates <lane-manifest.json> ...] [--rates-from-job <job> [--rates-ref <ref>]] [--runner-tag <tag>]
     Writes <dir>/shards.json and <dir>/shards.gitlab-ci.yml (`parallel` ≤ 200 from the measured capture rate on the
     runner tag of qual:certify:l6). Exit 1 when the plan has no cells or no rate was measured on that tag.
   node scripts/qual/shard-plan.mjs collect --plan <shards.json> --out <shards-summary.json>
     Downloads every shard's lane manifest through the jobs API with CI_JOB_TOKEN (same project, this ref) and checks
     SHA/scope/lane/results/image digest. Exit 1 on any gap.
   node scripts/qual/shard-plan.mjs budget --scope <pr|main|release> --out-dir <dir>
     Appends the pipeline's wall time so far (CI_PIPELINE_CREATED_AT → now; job start as fallback) to the carried-forward history (previous successful run of the same job on this ref)
     and writes budget-report.json; an overrun on 5 consecutive runs is reported. Always exit 0 (never fails a release)
     except on usage errors (64).

   Jobs API (CI_JOB_TOKEN): GET $CI_API_V4_URL/projects/$CI_PROJECT_ID/jobs/artifacts/<ref>/raw/<path>?job=<name>. */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const EXIT = { ok: 0, fail: 1, usage: 64 };

async function loadImpl() {
  const { build } = await import('esbuild');
  const res = await build({
    entryPoints: [join(ROOT, 'packages/qa/src/matrix/shardPlan.ts')],
    bundle: true, write: false, format: 'esm', platform: 'node', packages: 'external', logLevel: 'silent',
  });
  const out = join(ROOT, 'node_modules/.cache/auraglass-qa/shard-plan.mjs');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, res.outputFiles[0].text);
  return import(`${pathToFileURL(out).href}?t=${Date.now()}`);
}

export function parseArgv(argv) {
  const [mode, ...rest] = argv;
  if (!['plan', 'collect', 'budget'].includes(mode)) throw new Error(`mode must be plan|collect|budget (got ${mode ?? 'none'})`);
  const o = { mode, rates: [] };
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    const v = rest[i + 1];
    if (!a.startsWith('--') || v === undefined || v.startsWith('--')) throw new Error(`bad argument ${a}`);
    const key = a.slice(2);
    if (key === 'rates') o.rates.push(v);
    else if (['cells-from', 'out-dir', 'out', 'plan', 'rates-from-job', 'rates-ref', 'runner-tag', 'scope'].includes(key)) o[key] = v;
    else throw new Error(`unknown argument ${a}`);
    i++;
  }
  const need = { plan: ['cells-from', 'out-dir'], collect: ['plan', 'out'], budget: ['scope', 'out-dir'] }[mode];
  for (const k of need) if (!o[k]) throw new Error(`${mode} needs --${k}`);
  if (mode === 'plan' && !o.rates.length && !o['rates-from-job']) throw new Error('plan needs --rates <manifest> and/or --rates-from-job <job>');
  if (mode === 'budget' && !['pr', 'main', 'release'].includes(o.scope)) throw new Error(`--scope must be pr|main|release (got ${o.scope})`);
  return o;
}

/** Jobs API raw-artifact download with CI_JOB_TOKEN; null on 404 (no successful job / no such file). */
export async function fetchArtifactJson(env, ref, job, path, fetchImpl = fetch) {
  for (const k of ['CI_API_V4_URL', 'CI_PROJECT_ID', 'CI_JOB_TOKEN']) if (!env[k]) throw new Error(`${k} is unset (jobs API needs a GitLab job)`);
  const url = `${env.CI_API_V4_URL}/projects/${encodeURIComponent(env.CI_PROJECT_ID)}/jobs/artifacts/${encodeURIComponent(ref)}/raw/${path.split('/').map(encodeURIComponent).join('/')}?job=${encodeURIComponent(job)}`;
  const res = await fetchImpl(url, { headers: { 'JOB-TOKEN': env.CI_JOB_TOKEN } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET jobs/artifacts/${ref}/raw/${path}?job=${job}: HTTP ${res.status}`);
  return JSON.parse(await res.text());
}

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const writeJson = (p, v) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, `${JSON.stringify(v, null, 2)}\n`); };

async function ciDocs() {
  const { default: yaml } = await import('yaml');
  return [yaml.parse(readFileSync(join(ROOT, 'ci/qual.gitlab-ci.yml'), 'utf8')), yaml.parse(readFileSync(join(ROOT, '.gitlab-ci.yml'), 'utf8'))];
}

/** `impl` lets the unit tests pass the TypeScript module directly (jest.qual.config.js); the CLI compiles it. */
export async function main(argv, { env = process.env, fetchImpl = fetch, now = () => new Date(), impl: given } = {}) {
  let o;
  try { o = parseArgv(argv); } catch (e) { console.error(`shard-plan: ${e.message}`); return EXIT.usage; }
  const impl = given ?? await loadImpl();
  const sha = env.CI_COMMIT_SHA ?? null;
  const ref = env.CI_COMMIT_REF_NAME;

  if (o.mode === 'plan') {
    const planFile = resolve(o['cells-from']);
    if (!existsSync(planFile)) { console.error(`shard-plan: ${o['cells-from']} not found — the release capture plan (environment-visual.spec.ts --list) was not written`); return EXIT.fail; }
    const capturePlan = readJson(planFile);
    if (capturePlan.scope !== 'release') { console.error(`shard-plan: ${o['cells-from']} is a ${capturePlan.scope} plan, not release`); return EXIT.fail; }
    if (sha && capturePlan.sha && capturePlan.sha !== sha) { console.error(`shard-plan: capture plan sha ${capturePlan.sha} ≠ ${sha}`); return EXIT.fail; }
    const samples = o.rates.map((f) => { const m = readJson(f); return { source: f, runnerTag: m.runnerTag ?? null, captureRate: m.captureRate ?? null, sha: m.sha, scope: m.scope }; });
    if (o['rates-from-job']) {
      const job = o['rates-from-job'];
      const rref = o['rates-ref'] ?? 'next';
      const path = `.artifacts/qual/${impl.jobNameSlug(job)}/lane-manifest.json`;
      try {
        const m = await fetchArtifactJson(env, rref, job, path, fetchImpl);
        if (m) samples.push({ source: `${job}@${rref}:${path}`, runnerTag: m.runnerTag ?? null, captureRate: m.captureRate ?? null, sha: m.sha, scope: m.scope });
        else console.error(`shard-plan: no successful ${job} artifact on ${rref} (${path})`);
      } catch (e) { console.error(`shard-plan: ${e.message}`); }
    }
    const docs = await ciDocs();
    const tag = o['runner-tag'] ?? [].concat(impl.resolveJob('qual:certify:l6', docs).tags ?? [])[0];
    if (!tag) { console.error('shard-plan: qual:certify:l6 resolves to no runner tag'); return EXIT.fail; }
    let plan;
    let child;
    try {
      const rate = impl.measuredRate(samples, tag);
      plan = impl.planShards({ cells: Number(capturePlan.cellsTotal), rate, sha });
      child = impl.childPipeline(plan, docs);
    } catch (e) { console.error(e.message); return EXIT.fail; }
    const { default: yaml } = await import('yaml');
    const outDir = resolve(o['out-dir']);
    writeJson(join(outDir, impl.PLAN_FILE), plan);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, impl.CHILD_FILE), `# generated by scripts/qual/shard-plan.mjs (REQ-QUAL-65) for ${sha ?? 'local'}; do not edit\n${yaml.stringify(child)}`);
    console.log(`shard-plan: ${plan.cells} cells × ${plan.capturesPerCell} = ${plan.captures} captures at ${plan.captureRate.toFixed(3)}/s on ${plan.runnerTag}`
      + ` (${plan.rateSamples} sample(s)) → ${plan.computed} shard(s), parallel ${plan.parallel}${plan.capped ? ' (capped at 200)' : ''}, ~${plan.projectedShardMinutes} min/shard`);
    if (plan.capped) console.error(`shard-plan: budget warning — ${plan.computed} shards needed for ≤60 min each; capped at 200 gives ~${plan.projectedShardMinutes} min per shard`);
    return EXIT.ok;
  }

  if (o.mode === 'collect') {
    const plan = readJson(resolve(o.plan));
    if (!sha || !ref) { console.error('shard-plan: collect needs CI_COMMIT_SHA and CI_COMMIT_REF_NAME'); return EXIT.fail; }
    if (plan.sha && plan.sha !== sha) { console.error(`shard-plan: plan sha ${plan.sha} ≠ ${sha}`); return EXIT.fail; }
    const summary = await impl.collectShards(plan, sha, (job, path) => fetchArtifactJson(env, ref, job, path, fetchImpl));
    writeJson(resolve(o.out), summary);
    console.log(`shard-plan: ${summary.shards.filter((s) => s.state === 'pass').length}/${summary.parallel} shard(s) pass, ${summary.cells} cells`);
    if (!summary.ok) { console.error(`shard-plan: release matrix incomplete:\n  ${summary.problems.join('\n  ')}`); return EXIT.fail; }
    return EXIT.ok;
  }

  // budget — reported, never failing (REQ-QUAL-65)
  const job = env.CI_JOB_NAME ?? 'local';
  const slug = env.CI_JOB_NAME_SLUG ?? impl.jobNameSlug(job);
  const outDir = resolve(o['out-dir']);
  const histPath = `.artifacts/qual/${slug}/budget-history.json`;
  let history = [];
  let historySource = 'none';
  if (ref && env.CI_JOB_TOKEN) {
    try {
      const prev = await fetchArtifactJson(env, ref, job, histPath, fetchImpl);
      if (Array.isArray(prev)) { history = prev; historySource = `${job}@${ref}`; }
    } catch (e) { historySource = `unavailable: ${e.message}`; }
  }
  // Budgets are pipeline budgets: wall time from pipeline creation to the end of this job (job start as fallback).
  const startedAt = env.CI_PIPELINE_CREATED_AT || env.CI_JOB_STARTED_AT;
  const started = startedAt ? Date.parse(startedAt) : NaN;
  const t = now();
  if (Number.isFinite(started)) {
    history = impl.appendHistory(history, { sha, pipelineId: env.CI_PIPELINE_ID ?? null, job, scope: o.scope, durationMs: t.getTime() - started, at: t.toISOString() });
  }
  const report = { ...impl.budgetReport(history, o.scope), job, historySource, measured: Number.isFinite(started) };
  writeJson(join(outDir, 'budget-history.json'), history);
  writeJson(join(outDir, 'budget-report.json'), report);
  console.log(`shard-plan budget: ${o.scope} budget ${report.budgetMinutes} min; last ${report.lastDurationsMinutes.join(', ') || '—'} min; overrun streak ${report.overrunStreak}${report.overrun5 ? ' — OVERRUN on 5 consecutive runs (GA dashboard)' : ''}`);
  return EXIT.ok;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main(process.argv.slice(2)).then((code) => process.exit(code), (e) => { console.error(`shard-plan: crashed: ${e?.stack ?? e}`); process.exit(1); });
}
