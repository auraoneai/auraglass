/* CMP-393 + CMP-396 (lane 3i-Q). Remote perf lane only — runs under AG_REMOTE_RUNNER=1 on
   the PRD-PERF harness (tests/perf/harness/run-perf.mjs + grade.mjs). This file
   registers the cases; harness seam lands with PRD-PERF. */
import { test, expect } from '@playwright/test';
import { gotoStory, perf } from '../../../helpers/index';

test.skip(!process.env.AG_REMOTE_RUNNER, 'remote perf lane only (AG_REMOTE_RUNNER=1)');


test.describe('dialog perf (CMP-393/396)', () => {
  const SUBJECTS = ['overlays-dialog--default', 'overlays-dialog--perf-dashboard', 'overlays-dialog--palette-shell'];

  for (const story of SUBJECTS) {
    test(`${story}: <=2 blurred layers; settled frame diff 0`, async ({ page }) => {
      await gotoStory(page, story);
      const blurred = await perf.blurredSurfaces(page);
      expect(blurred).toBeLessThanOrEqual(2);
      const idle = await perf.settledIdle(page, { afterMs: 400 });
      expect(idle.infiniteAnimations).toBe(0);
      const frames = await perf.frames(page, {
        durationMs: 800,
        during: async () => {
          await page.mouse.move(300, 300);
          await page.mouse.wheel(0, 200);
        },
      });
      expect(frames.p95Ms).toBeLessThanOrEqual(33);
    });
  }

  test('CommandPalette subject joins when SURF stories land (REQ-OVL-04/-06)', async ({ page }) => {
    const { listSubjects } = await import('../../../helpers/index');
    const subjects = await listSubjects();
    const cp = subjects.filter((s) => /command-?palette/i.test(s.id));
    test.skip(cp.length === 0, 'SURF CommandPalette stories not in SubjectIndex yet — PENDING');
    await gotoStory(page, cp[0]!.id);
    expect(await perf.blurredSurfaces(page)).toBeLessThanOrEqual(3);
  });
});
