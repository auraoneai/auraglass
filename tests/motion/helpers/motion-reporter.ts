/* MAT-244 / REQ-MAT-43 (D.3-25): Playwright reporter that turns the L9 motion
 * specs' measurements into motion-report.json. Remote only — the L9 job
 * (ci/mat.gitlab-ci.yml mat:test:motion-l9) passes it next to the line reporter:
 *
 *   npx playwright test … --reporter=line,./tests/motion/helpers/motion-reporter.ts
 *
 * Specs publish a partial row as a `motion` annotation
 * ({ type: 'motion', description: JSON.stringify({ id, mode, framesChanged }) });
 * engine, viewport and preference default to the project's `use` and may be
 * overridden by the annotation (a describe-level test.use the reporter cannot
 * see). Annotations that are not JSON objects with an `id` are ignored. The
 * report is written once, at onEnd, to AG_MOTION_REPORT_PATH. */
import type { FullConfig, Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { motionReportPath, writeMotionReport, type MotionSubjectRow } from './report';

type ProjectUse = {
  browserName?: string;
  defaultBrowserType?: string;
  viewport?: { width: number; height: number } | null;
  reducedMotion?: 'reduce' | 'no-preference' | null;
};

const EMPTY_MEASURES = {
  framesChanged: null, settlePass: null, idleRafCount: null, vtOpticsPass: null,
  p95FrameMs: null, longTasks: null, mountAnimations: null,
} as const;

/** One row per `motion` JSON annotation of a finished test (pure; unit-tested). */
export const rowsFromTest = (test: TestCase, result: TestResult): MotionSubjectRow[] => {
  const use = (test.parent.project()?.use ?? {}) as ProjectUse;
  const engine = use.browserName ?? use.defaultBrowserType ?? test.parent.project()?.name ?? 'unknown';
  const viewport = use.viewport ? `${use.viewport.width}x${use.viewport.height}` : 'default';
  const preference = use.reducedMotion === 'reduce' ? 'reduce' : 'no-preference';
  const rows: MotionSubjectRow[] = [];
  for (const ann of result.annotations) {
    if (ann.type !== 'motion' || !ann.description) continue;
    let partial: unknown;
    try { partial = JSON.parse(ann.description); } catch { continue; }
    if (!partial || typeof partial !== 'object' || typeof (partial as { id?: unknown }).id !== 'string') continue;
    rows.push({ engine, viewport, preference, mode: 'full', ...EMPTY_MEASURES, ...(partial as Partial<MotionSubjectRow>) } as MotionSubjectRow);
  }
  return rows;
};

export default class MotionReportReporter implements Reporter {
  private rows: MotionSubjectRow[] = [];

  onBegin(_config: FullConfig): void { this.rows = []; }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.rows.push(...rowsFromTest(test, result));
  }

  onEnd(): void {
    const abs = writeMotionReport(this.rows, { path: motionReportPath() });
    process.stdout.write(`[motion-report] ${this.rows.length} measurement(s) -> ${abs}\n`);
  }

  printsToStdio(): boolean { return false; }
}
