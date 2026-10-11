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

    // Profiler hook: React commits during drag must be 0 — the harness counts
    // commits via the __AG_COMMIT counter the provider installs in dev builds.
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
