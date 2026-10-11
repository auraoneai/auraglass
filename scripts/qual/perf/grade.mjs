#!/usr/bin/env node
/* scripts/qual/perf/grade.mjs — REQ-QUAL-37 (QUAL). Grades L10 perf-results.json (tests/perf/harness/run-perf.mjs, G-20)
   with packages/qa/src/perf/grade.ts and writes
     .artifacts/qual/perf-report.json            PerfReport (S-55 REPORTS.perf; read by PLAT docs-claims)
     .artifacts/qual/<job-slug>/perf-grades.json  per-column letters, reasons, runner tag, unmeasured subjects
   on every main, nightly and release run. At release scope it also applies the release gate (T1 < C, T2 < D, or a ≥1-letter
   drop vs the previous release's perf-grades.json on the same runner tag) and exits 1 on any failure.

   Usage: node scripts/qual/perf/grade.mjs --results <file|glob>[,…] [--budgets certification/budgets.json]
            [--scope main|nightly|release] [--previous <perf-grades.json>|auto] [--out-dir .artifacts/qual]
   Inputs must contain profile (a) at 120 Hz and profile (b) results; a missing profile is a failure (fail closed).
   `--previous auto` (release default) downloads the previous v5 tag's perf-grades.json from its qual:certify:perf-grade job
   with CI_JOB_TOKEN; when a previous tag exists but its artifact cannot be read the gate fails (pass it with --previous). */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { ROOT, expandInputs, fetchRefArtifact, git, loadQa, readJson, readMetas, rel } from './lib.mjs';

export const GRADE_JOB = 'qual:certify:perf-grade';
export const GRADE_JOB_SLUG = 'qual-certify-perf-grade';

export function parseArgs(argv) {
  const o = { results: null, budgets: join(ROOT, 'certification/budgets.json'), scope: process.env.AG_SCOPE ?? 'main', previous: null,
    outDir: resolve(process.env.AURAGLASS_EVIDENCE_DIR ?? '.artifacts', 'qual'), slug: process.env.CI_JOB_NAME_SLUG ?? GRADE_JOB_SLUG, root: ROOT };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]; const v = argv[++i];
    if (v === undefined) throw new Error(`${a} needs a value`);
    if (a === '--results') o.results = v;
    else if (a === '--budgets') o.budgets = resolve(v);
    else if (a === '--scope') o.scope = v;
    else if (a === '--previous') o.previous = v;
    else if (a === '--out-dir') o.outDir = resolve(v);
    else if (a === '--root') o.root = resolve(v);
    else throw new Error(`unknown argument ${a}`);
  }
  if (!o.results) throw new Error('--results is required');
  if (!['pr', 'main', 'nightly', 'release'].includes(o.scope)) throw new Error(`--scope must be pr|main|nightly|release (got ${o.scope})`);
  if (o.scope === 'release' && o.previous === null) o.previous = 'auto';
  return o;
}

/** Previous v5 release tag before `current` (version-sorted), or null. */
export function previousTag(current, tags) {
  const v5 = tags.filter((t) => /^v5\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(t));
  const cmp = (a, b) => a.localeCompare(b, 'en', { numeric: true });
  const sorted = [...new Set(v5)].sort(cmp);
  const before = current ? sorted.filter((t) => cmp(t, current) < 0) : sorted;
  return before.at(-1) ?? null;
}

async function loadPrevious(o, log) {
  if (!o.previous) return { prev: null, failure: null };
  if (o.previous !== 'auto') return { prev: readJson(resolve(o.previous)), failure: null };
  let tags = [];
  try { tags = git(['tag', '--list', 'v5.*'], o.root).split('\n').filter(Boolean); } catch (e) { return { prev: null, failure: `cannot list tags: ${e.message}` }; }
  const tag = previousTag(process.env.CI_COMMIT_TAG ?? null, tags);
  if (!tag) { log('grade: no previous v5 release tag — letter-drop check not applicable'); return { prev: null, failure: null }; }
  const got = await fetchRefArtifact({ ref: tag, job: GRADE_JOB, path: `.artifacts/qual/${GRADE_JOB_SLUG}/perf-grades.json` });
  if (!got.ok) return { prev: null, failure: `previous release ${tag}: perf-grades.json not readable (${got.reason}); pass it with --previous <file>` };
  return { prev: JSON.parse(got.body), failure: null };
}

export async function gradeCli(argv = process.argv.slice(2), log = (s) => process.stdout.write(`${s}\n`)) {
  let o;
  try { o = parseArgs(argv); } catch (e) { log(String(e.message)); return 64; }
  const budgetsMod = await loadQa('budgets', ROOT);
  const gradeMod = await loadQa('grade', ROOT);
  const { perf, sha256 } = budgetsMod.loadPerfThresholds(o.root);
  const failures = [];
  const files = await expandInputs(o.results);
  if (!files.length) { log(`grade: --results ${o.results} matched no file (L10 did not produce perf-results.json)`); return 1; }
  const docs = files.map((f) => readJson(f));
  if (!existsSync(o.budgets)) { log(`grade: ${o.budgets} missing — run scripts/qual/perf/resolve-budgets.mjs first`); return 1; }
  const budgets = readJson(o.budgets);
  const profilesSeen = new Set(docs.flatMap((d) => d.results.map((r) => gradeMod.perfProfileOf(r)).filter(Boolean)));
  for (const p of ['desktop-120hz', 'mid-mobile']) if (!profilesSeen.has(p)) failures.push(`perf-grade-input: no ${p} cells in ${files.map((f) => rel(process.cwd(), f)).join(', ')}`);
  const metas = await readMetas(o.root);
  const tiers = new Map(metas.map((m) => [m.name, m.tier]));
  const required = metas.filter((m) => typeof m.flagship === 'number' || m.tier === 'T2').map((m) => ({ subject: m.name, tier: m.tier }));
  const { report, grades } = gradeMod.gradeResults({ results: docs, sources: files.map((f) => rel(process.cwd(), f)), tiers, required, budgets,
    thresholds: perf, thresholdsSha256: sha256 });
  const reportErrors = gradeMod.validatePerfReport(report);
  if (reportErrors.length) failures.push(`perf-report.json does not match PerfReport: ${reportErrors.slice(0, 10).join('; ')}`);

  mkdirSync(join(o.outDir, o.slug), { recursive: true });
  const reportFile = join(o.outDir, 'perf-report.json');
  const gradesFile = join(o.outDir, o.slug, 'perf-grades.json');
  writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`);
  let gate = null;
  if (o.scope === 'release') {
    const { prev, failure } = await loadPrevious(o, log);
    if (failure) failures.push(failure);
    gate = gradeMod.releaseGate(grades, prev, perf);
    failures.push(...gate.failures);
  }
  writeFileSync(gradesFile, `${JSON.stringify({ ...grades, gate, failures }, null, 2)}\n`);
  const dist = Object.fromEntries(['A', 'B', 'C', 'D', 'F'].map((l) => [l, grades.subjects.filter((s) => s.grade === l).length]));
  log(`grade: ${grades.subjects.length} subject×profile grade(s) ${JSON.stringify(dist)}, ${grades.unmeasured.length} unmeasured → ${rel(process.cwd(), reportFile)}, ${rel(process.cwd(), gradesFile)}`);
  for (const s of grades.subjects.filter((x) => x.grade !== 'A').slice(0, 60)) log(`  ${s.grade} ${s.subject} ${s.profile}: ${s.reasons.join('; ')}`);
  for (const n of gate?.notes ?? []) log(`  note ${n}`);
  for (const f of failures) log(`  FAIL ${f}`);
  return failures.length ? 1 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  gradeCli().then((c) => { process.exitCode = c; }, (e) => { process.stderr.write(`${e?.stack ?? e}\n`); process.exitCode = 1; });
}
