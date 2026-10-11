/* MAT-244 (REQ-MOT-78): motion-report.json writer. The report is a CI artifact
 * keyed to the tested SHA — .artifacts/mat/<job>/motion-report.json (the job
 * sets AG_MOTION_REPORT_PATH; the default below is for ad-hoc remote runs) —
 * never under reports/ (that dir is the audited-evidence tree). verify-visual-evidence.js
 * (QUAL-owned) requires this file for the flagship release; the motion lane is
 * a required check for PRs touching src/motion/**, flagship CSS or
 * tokens/sys/motion.tokens.json. */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { TestResult } from '@playwright/test/reporter';

export const MOTION_REPORT_PATH = '.artifacts/mat/motion-report.json';

/** Report path for this run: AG_MOTION_REPORT_PATH (CI: .artifacts/mat/$CI_JOB_NAME_SLUG/motion-report.json). */
export const motionReportPath = (): string => process.env.AG_MOTION_REPORT_PATH || MOTION_REPORT_PATH;

export interface MotionSubjectRow {
  /** story/spec id this row certifies. */
  id: string;
  engine: string;
  viewport: string;
  preference: 'no-preference' | 'reduce';
  mode: 'full' | 'calm' | 'none';
  framesChanged: number | null;
  settlePass: boolean | null;
  idleRafCount: number | null;
  vtOpticsPass: boolean | null;
  p95FrameMs: number | null;
  longTasks: number | null;
  /** REQ-MAT-43: running/pending document.getAnimations() 50 ms after mount (rest-state subjects). */
  mountAnimations: number | null;
}

/** Measurement fields; a null field means "not measured by this test". */
const MEASURES = ['framesChanged', 'settlePass', 'idleRafCount', 'vtOpticsPass', 'p95FrameMs', 'longTasks', 'mountAnimations'] as const;

export interface MotionReport {
  sha: string;
  subjects: MotionSubjectRow[];
}

export const currentSha = (): string => {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return process.env.GITHUB_SHA ?? process.env.CI_COMMIT_SHA ?? 'unknown';
  }
};

/** Merge-mode writer: rows for the same (id, engine, viewport, preference,
 *  mode) key are merged field by field — a measured (non-null) field replaces
 *  the stored one, a null field keeps it — so the specs of one L9 run (frame
 *  strip, no-mount, settle, …) combine into one row; other runs' rows survive
 *  per-engine invocations. */
export const writeMotionReport = (
  rows: MotionSubjectRow[],
  { sha = currentSha(), path = motionReportPath() }: { sha?: string; path?: string } = {},
): string => {
  const abs = resolve(process.cwd(), path);
  let existing: MotionReport = { sha, subjects: [] };
  if (existsSync(abs)) {
    try { existing = JSON.parse(readFileSync(abs, 'utf8')) as MotionReport; } catch { /* replace */ }
  }
  const key = (r: MotionSubjectRow) => `${r.id}|${r.engine}|${r.viewport}|${r.preference}|${r.mode}`;
  const byKey = new Map(existing.subjects.map((r) => [key(r), r] as const));
  for (const r of rows) {
    const prev = byKey.get(key(r));
    if (!prev) { byKey.set(key(r), { ...r }); continue; }
    const next: MotionSubjectRow = { ...prev };
    for (const m of MEASURES) {
      if (r[m] !== null && r[m] !== undefined) (next as unknown as Record<string, unknown>)[m] = r[m];
    }
    byKey.set(key(r), next);
  }
  const report: MotionReport = { sha, subjects: [...byKey.values()].sort((a, b) => key(a).localeCompare(key(b))) };
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, `${JSON.stringify(report, null, 2)}\n`);
  return abs;
};

/** Reporter-shape consumer: call from a spec's teardown or a custom reporter
 *  so each finished test contributes its measurements. Measurements ride on
 *  test annotations ({type: 'motion', description: JSON.stringify(row)}). */
export const collectRow = (result: TestResult): MotionSubjectRow | null => {
  const ann = result.annotations.find((a) => a.type === 'motion');
  if (!ann?.description) return null;
  try { return JSON.parse(ann.description) as MotionSubjectRow; } catch { return null; }
};
