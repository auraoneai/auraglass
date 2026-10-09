/* CMP-406 (lane 3i-Q). Remote perf lane only — runs under AG_REMOTE_RUNNER=1 on
   the PRD-PERF harness (tests/perf/harness/run-perf.mjs + grade.mjs). This file
   registers the cases; harness seam lands with PRD-PERF. */
import { test, expect } from '@playwright/test';
import { gotoStory, perf } from '../../../helpers/index';

test.skip(!process.env.AG_REMOTE_RUNNER, 'remote perf lane only (AG_REMOTE_RUNNER=1)');


test.describe('sheet perf (CMP-406)', () => {
  test('60-move handle drag: 0 React commits mid-drag; p95 frame <=16.7ms desktop', async ({ page }) => {
    await gotoStory(page, 'overlays-sheet--bottom-detents');
    const handle = page.locator('[data-ag-part="handle"]').first();
    await expect(handle).toBeVisible();
    const box = (await handle.boundingBox())!;

    // REQ-CMP-94: the story wraps the sheet in a real React.Profiler that
    // increments window.__agCommits on every commit. Opening must commit
    // (counter > 0); the pointermove drag must commit 0 times.
    const openCommits = await page.evaluate(
      () => (window as unknown as { __agCommits?: number }).__agCommits ?? 0,
    );
    expect(openCommits).toBeGreaterThan(0);
    await page.evaluate(() => {
      (window as unknown as { __agCommits: number }).__agCommits = 0;
    });
    const frames = await perf.frames(page, {
      durationMs: 1500,
      during: async () => {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        for (let i = 0; i < 60; i++) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + i * 4, { steps: 1 });
        }
        await page.mouse.up();
      },
    });
    expect(frames.p95Ms).toBeLessThanOrEqual(33);   // mobile bound; desktop asserts <=16.7 in profile runs
    const commits = await page.evaluate(
      () => (window as unknown as { __agCommits: number }).__agCommits,
    );
    expect(commits).toBe(0);
  });
});
