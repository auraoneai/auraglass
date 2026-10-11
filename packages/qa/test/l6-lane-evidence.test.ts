/* G-12 / REQ-QUAL-04, -06, -12 (FIN-429): the lane runner's Playwright report classification (pending-only failures are
   `pending` below release) and the L6 capture evidence merged into the lane manifest (cells, tarball sha256, rate). */
import { describe, expect, test } from '@jest/globals';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { classifyPlaywrightReport, loadRegistrations, readCaptureEvidence, selectRows, uncoveredSpecs } from '../src/evidence/laneRunner.ts';

const t = (title: string, status: string, message?: string) => ({
  title, tests: [{ status, results: [message ? { status: 'failed', error: { message } } : { status: 'passed' }] }],
});
const report = (...specs: Array<ReturnType<typeof t>>): Parameters<typeof classifyPlaywrightReport>[0] => ({ suites: [{ specs: [], suites: [{ specs }] }] });

describe('classifyPlaywrightReport', () => {
  test('pending-only failures', () => {
    const c = classifyPlaywrightReport(report(t('a', 'expected'), t('b', 'unexpected', 'pending: no index.json (producer: G-08)\n  at x')));
    expect(c).toEqual({ total: 2, failed: 1, pendingOnly: true, pendingReasons: ['pending: no index.json (producer: G-08)'] });
  });

  test('a real failure next to a pending one is not pending', () => {
    const c = classifyPlaywrightReport(report(t('a', 'unexpected', 'Error: pending: x'), t('b', 'unexpected', 'expect(received).toEqual(expected)')));
    expect(c.pendingOnly).toBe(false);
    expect(c.failed).toBe(2);
  });

  test('no failures and no tests', () => {
    expect(classifyPlaywrightReport(report(t('a', 'expected')))).toMatchObject({ total: 1, failed: 0, pendingOnly: false });
    expect(classifyPlaywrightReport({ suites: [] })).toMatchObject({ total: 0, pendingOnly: false });
  });
});

describe('uncoveredSpecs', () => {
  test('specs outside certification/lanes and every cert project dir are reported', () => {
    const root = '/repo';
    const files = ['certification/lanes/environment-visual.spec.ts', 'tests/motion/a.spec.ts', 'tests/e2e/mat/axe.spec.ts', 'tests/motion-extra/b.spec.ts'];
    expect(uncoveredSpecs(files, root, ['/repo/tests/motion'])).toEqual(['tests/e2e/mat/axe.spec.ts', 'tests/motion-extra/b.spec.ts']);
  });
});

describe('readCaptureEvidence', () => {
  test('merges the plan and per-worker capture rows', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ag-l6-'));
    try {
      expect(readCaptureEvidence(dir)).toBeNull();
      mkdirSync(join(dir, 'environment-visual'));
      const plan = { cells: ['a|photo|chromium|light.glass.default.standard.1440'], subjects: ['Button'], tarball: { path: 'x.tgz', sha256: 'f'.repeat(64) } };
      writeFileSync(join(dir, 'environment-visual/plan.json'), JSON.stringify(plan));
      writeFileSync(join(dir, 'environment-visual/captures-1.jsonl'), `${JSON.stringify({ captures: 2, durationMs: 1000 })}\n`);
      writeFileSync(join(dir, 'environment-visual/captures-2.jsonl'), `${JSON.stringify({ captures: 2, durationMs: 3000 })}\n`);
      expect(readCaptureEvidence(dir)).toEqual({ plan, captures: 4, captureRate: 1 });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

test('L6 environment-visual is registered once at pr, so it runs at every scope, remote and fail-closed', async () => {
  const root = join(__dirname, '../../..');
  const { rows } = await loadRegistrations(root);
  for (const scope of ['pr', 'main', 'nightly', 'release'] as const) {
    const l6 = selectRows(rows, 'L6', scope).filter((r) => r.stream === 'qual');
    expect(l6).toHaveLength(1);
    expect(l6[0]).toMatchObject({ lane: 'L6', kind: 'playwright', path: 'certification/lanes/environment-visual.spec.ts', scope: 'pr', remote: true, failClosed: true });
  }
});
