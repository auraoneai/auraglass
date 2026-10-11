/* MAT-244 (REQ-MOT-78): motion-report.json writer. The report is a CI artifact
 * keyed to the tested SHA — .artifacts/mat/motion-report.json — never under
 * reports/ (that dir is the audited-evidence tree). verify-visual-evidence.js
 * (QUAL-owned) requires this file for the flagship release; the motion lane is
 * a required check for PRs touching src/motion/**, flagship CSS or
 * tokens/sys/motion.tokens.json. */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { TestResult } from '@playwright/test/reporter';

export const MOTION_REPORT_PATH = '.artifacts/mat/motion-report.json';

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
}

export interface MotionReport {
  sha: string;
  subjects: MotionSubjectRow[];
}

export const currentSha = (): string => {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return process.env.CI_COMMIT_SHA ?? 'unknown';
  }
};

/** Merge-mode writer: rows for the same (id, engine, viewport, preference,
 *  mode) key are replaced; other runs' rows survive per-engine invocations. */
export const writeMotionReport = (
  rows: MotionSubjectRow[],
  { sha = currentSha(), path = MOTION_REPORT_PATH }: { sha?: string; path?: string } = {},
): string => {
  const abs = join(process.cwd(), path);
  let existing: MotionReport = { sha, subjects: [] };
  if (existsSync(abs)) {
    try { existing = JSON.parse(readFileSync(abs, 'utf8')) as MotionReport; } catch { /* replace */ }
  }
  const key = (r: MotionSubjectRow) => `${r.id}|${r.engine}|${r.viewport}|${r.preference}|${r.mode}`;
  const byKey = new Map(existing.subjects.map((r) => [key(r), r] as const));
  for (const r of rows) byKey.set(key(r), r);
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
