/* G-12 / REQ-QUAL-04, -06, -12 (FIN-429): the lane runner's uncovered-spec report and the L6 capture evidence merged
   into the lane manifest (cells, tarball sha256, rate). Pending-only Playwright failures (below release) are covered
   by fail-closed.test.ts. */
import { describe, expect, test } from '@jest/globals';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SCOPES, loadRegistrations, readCaptureEvidence, selectRows, uncoveredSpecs } from '../src/evidence/laneRunner.ts';

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

test('L6 environment-visual, preference-modes and console run at every scope, remote and fail-closed', async () => {
  // A registration's scope is the narrowest it runs at (pr ⊂ main ⊂ nightly ⊂ release).
  const { rows } = await loadRegistrations(join(__dirname, '../../..'));
  // G-13 adds preference-modes (REQ-QUAL-16) and console (REQ-QUAL-17) next to the capture driver
  for (const spec of ['environment-visual', 'preference-modes', 'console']) {
    for (const scope of SCOPES) {
      const l6 = selectRows(rows, 'L6', scope).filter((r) => r.stream === 'qual' && r.path === `certification/lanes/${spec}.spec.ts`);
      expect([spec, scope, l6.length]).toEqual([spec, scope, 1]);
      expect(l6[0]).toMatchObject({ lane: 'L6', kind: 'playwright', remote: true, failClosed: true });
    }
  }
});
