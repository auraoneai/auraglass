/* @jest-environment node */
/* REQ-MAT-43 / MAT-244 (D.3-25): motion-report.json plumbing for the L9 run.
 * The reporter maps each spec's `motion` annotation onto a row keyed by the
 * project's engine/viewport/preference, and the writer merges the rows of
 * different specs field by field into .artifacts/mat/<job>/motion-report.json. */
import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { TestCase, TestResult } from '@playwright/test/reporter';
import MotionReportReporter, { rowsFromTest } from './helpers/motion-reporter';
import { motionReportPath, writeMotionReport, MOTION_REPORT_PATH, type MotionReport } from './helpers/report';

const fakeTest = (name: string, use: Record<string, unknown>) =>
  ({ parent: { project: () => ({ name, use }) } }) as unknown as TestCase;
const fakeResult = (annotations: Array<{ type: string; description?: string }>) =>
  ({ annotations }) as unknown as TestResult;

const chromium1440 = fakeTest('mat:cert-motion-chromium', {
  browserName: 'chromium', viewport: { width: 1440, height: 900 },
});

describe('motion-report reporter (REQ-MAT-43)', () => {
  let dir: string;
  const prevEnv = process.env.AG_MOTION_REPORT_PATH;
  beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'ag-motion-report-')); });
  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
    if (prevEnv === undefined) delete process.env.AG_MOTION_REPORT_PATH;
    else process.env.AG_MOTION_REPORT_PATH = prevEnv;
  });

  it('fills engine/viewport/preference from the project and keeps the measurement', () => {
    const rows = rowsFromTest(chromium1440, fakeResult([
      { type: 'motion', description: JSON.stringify({ id: 'layout-stack--primary', mode: 'full', mountAnimations: 0 }) },
    ]));
    expect(rows).toEqual([{
      id: 'layout-stack--primary', engine: 'chromium', viewport: '1440x900', preference: 'no-preference', mode: 'full',
      framesChanged: null, settlePass: null, idleRafCount: null, vtOpticsPass: null,
      p95FrameMs: null, longTasks: null, mountAnimations: 0,
    }]);
  });

  it('lets the annotation override the project preference (describe-level test.use)', () => {
    const rows = rowsFromTest(
      fakeTest('mat:motion-webkit-mobile-reduce', { defaultBrowserType: 'webkit', viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' }),
      fakeResult([{ type: 'motion', description: JSON.stringify({ id: 'x--primary', framesChanged: 4, preference: 'no-preference' }) }]),
    );
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ engine: 'webkit', viewport: '390x844', preference: 'no-preference', framesChanged: 4 });
  });

  it('ignores non-JSON, id-less and non-motion annotations', () => {
    expect(rowsFromTest(chromium1440, fakeResult([
      { type: 'motion', description: 'subject Stack absent' },
      { type: 'motion', description: JSON.stringify({ mountAnimations: 0 }) },
      { type: 'issue', description: JSON.stringify({ id: 'a' }) },
      { type: 'motion' },
    ]))).toEqual([]);
  });

  it('writes to AG_MOTION_REPORT_PATH and merges rows of different specs field by field', () => {
    const path = join(dir, 'mat-test-motion-l9', 'motion-report.json');
    process.env.AG_MOTION_REPORT_PATH = path;
    expect(motionReportPath()).toBe(path);

    const reporter = new MotionReportReporter();
    reporter.onBegin({} as never);
    reporter.onTestEnd(chromium1440, fakeResult([
      { type: 'motion', description: JSON.stringify({ id: 'overlays-dialog--primary', framesChanged: 5 }) },
    ]));
    reporter.onTestEnd(chromium1440, fakeResult([
      { type: 'motion', description: JSON.stringify({ id: 'overlays-dialog--primary', settlePass: true }) },
    ]));
    const out = process.stdout.write;
    const logged: string[] = [];
    process.stdout.write = ((s: string) => { logged.push(s); return true; }) as typeof process.stdout.write;
    try { reporter.onEnd(); } finally { process.stdout.write = out; }

    const report = JSON.parse(readFileSync(path, 'utf8')) as MotionReport;
    expect(report.sha).toMatch(/\S/);
    expect(report.subjects).toHaveLength(1);
    expect(report.subjects[0]).toMatchObject({ id: 'overlays-dialog--primary', framesChanged: 5, settlePass: true, mountAnimations: null });
    expect(logged.join('')).toContain('[motion-report] 2 measurement(s)');

    // a later per-engine invocation keeps the measured fields it does not re-measure
    writeMotionReport([{
      id: 'overlays-dialog--primary', engine: 'chromium', viewport: '1440x900', preference: 'no-preference', mode: 'full',
      framesChanged: null, settlePass: false, idleRafCount: null, vtOpticsPass: null, p95FrameMs: null, longTasks: null, mountAnimations: null,
    }], { path, sha: 'abc' });
    const merged = JSON.parse(readFileSync(path, 'utf8')) as MotionReport;
    expect(merged.sha).toBe('abc');
    expect(merged.subjects[0]).toMatchObject({ framesChanged: 5, settlePass: false });
  });

  it('defaults to the .artifacts/mat tree, never reports/', () => {
    delete process.env.AG_MOTION_REPORT_PATH;
    expect(motionReportPath()).toBe(MOTION_REPORT_PATH);
    expect(MOTION_REPORT_PATH.startsWith('.artifacts/mat/')).toBe(true);
  });
});
