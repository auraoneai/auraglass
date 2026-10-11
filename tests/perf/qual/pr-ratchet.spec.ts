/* tests/perf/qual/pr-ratchet.spec.ts — REQ-QUAL-40 PR frame-time ratchet (QUAL; runs in qual:certify:l10-gpu on PRs touching
   src/**, project qual:l10-ratchet, after run-perf.mjs --profile a measured this shard's affected flagships).

   Head: this job's perf-results.json (AG_PERF_HEAD_RESULTS), graded with packages/qa/src/perf/grade.ts into PerfReport rows.
   Base: the latest main-scope `.artifacts/qual/perf-report.json` of `next` (job qual:certify:perf-grade), downloaded with
   CI_JOB_TOKEN; it is used only when its sha is the PR's merge base or an ancestor of it (the latest main-scope report of
   the merge base). Rules (packages/qa/src/perf/ratchet.ts): p95 frame time may not regress by more than max(10 %, 1 ms),
   like windows only; blurred-surface count and BCI may not increase; every affected subject must be measured at head.
   No usable base report yet (first main run not done, or the PR is behind the report) → `pending:` (lane-runner convention).
   Locally (no AG_REMOTE_RUNNER=1) the file throws the remote-only message. */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { expect, test } from '@playwright/test';
import { ROOT, REMOTE_ONLY_MESSAGE } from '../harness/run-perf.mjs';
import { expandInputs, fetchRefArtifact, git, isAncestor } from '../../../scripts/qual/perf/lib.mjs';
import { parsePerfThresholds } from '../../../packages/qa/src/perf/budgets';
import { gradeResults, type PerfResultsLike } from '../../../packages/qa/src/perf/grade';
import { compareRatchet } from '../../../packages/qa/src/perf/ratchet';
import type { PerfReport } from '../../../src/contracts/testing';

if (process.env.AG_REMOTE_RUNNER !== '1') throw new Error(REMOTE_ONLY_MESSAGE);

const t = parsePerfThresholds(JSON.parse(readFileSync(join(ROOT, 'certification/thresholds.json'), 'utf8')));
const BASE_REF = process.env.AG_BASE_REF ?? 'next';

test('ratchet rule self-check: a head 15 % slower than the base fails, a like-for-like head passes', () => {
  const base: PerfReport = { version: 1, sha: 'base', subjects: [{ subject: 'Dialog', profile: 'desktop-120hz', grade: 'B', metrics: { frameP95Ms: 10, blurredSurfaces: 2, bci: 1 } }] };
  const slow: PerfReport = { ...base, sha: 'head', subjects: [{ ...base.subjects[0]!, metrics: { frameP95Ms: 11.5, blurredSurfaces: 2, bci: 1 } }] };
  expect(compareRatchet(base, slow, ['Dialog'], t.ratchet).regressions.map((r) => r.metric)).toEqual(['frameP95Ms']);
  expect(compareRatchet(base, base, ['Dialog'], t.ratchet).regressions).toEqual([]);
});

test('PR head vs merge-base main perf-report.json', async () => {
  const headFiles = await expandInputs(process.env.AG_PERF_HEAD_RESULTS ?? '');
  expect(headFiles.length, 'AG_PERF_HEAD_RESULTS matched no perf-results.json (run-perf.mjs --profile a did not run)').toBeGreaterThan(0);
  const docs = headFiles.map((f: string) => JSON.parse(readFileSync(f, 'utf8')) as PerfResultsLike);
  const affectedFile = join(dirname(headFiles[0]!), 'affected.json');
  expect(existsSync(affectedFile), `${affectedFile} missing (scripts/qual/perf/affected.mjs)`).toBe(true);
  const affected: string[] = JSON.parse(readFileSync(affectedFile, 'utf8')).shardSubjects;
  const budgetsFile = join(ROOT, 'certification/budgets.json');
  const budgets = existsSync(budgetsFile) ? JSON.parse(readFileSync(budgetsFile, 'utf8')) : null;
  expect(budgets, 'certification/budgets.json missing: run scripts/qual/perf/resolve-budgets.mjs first').not.toBeNull();
  const { report: head } = gradeResults({ results: docs, sources: headFiles, tiers: new Map(), required: [], budgets, thresholds: t, thresholdsSha256: null });

  const got = await fetchRefArtifact({ ref: BASE_REF, job: 'qual:certify:perf-grade', path: '.artifacts/qual/perf-report.json' });
  if (!got.ok) throw new Error(`pending: no main-scope perf-report.json on ${BASE_REF} yet (${got.reason}) (producer: qual:certify:perf-grade main run)`);
  const base = JSON.parse(got.body as string) as PerfReport;
  const mergeBase = git(['merge-base', `origin/${BASE_REF}`, 'HEAD']);
  if (base.sha !== mergeBase && !isAncestor(base.sha, mergeBase)) {
    throw new Error(`pending: the latest ${BASE_REF} perf-report.json is from ${base.sha.slice(0, 12)}, newer than this PR's merge base ${mergeBase.slice(0, 12)} — rebase the PR`);
  }
  const r = compareRatchet(base, head, affected, t.ratchet);
  writeFileSync(resolve(dirname(headFiles[0]!), 'pr-ratchet.json'), `${JSON.stringify({ version: 1, base: base.sha, mergeBase, head: head.sha, affected, ...r }, null, 2)}\n`);
  expect(r.missingInHead, `affected subjects not measured at head: ${r.missingInHead.join(', ')}`).toEqual([]);
  expect(r.regressions.map((x) => `${x.subject} ${x.metric}: ${x.detail}`)).toEqual([]);
});
