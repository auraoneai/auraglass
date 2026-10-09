/* CMP-406 + REQ-CMP-96. Remote perf lane only — runs under AG_REMOTE_RUNNER=1 on
   the PRD-PERF harness (tests/perf/harness/run-perf.mjs + grade.mjs).
   Two profiles: desktop-120hz (p95 <= 16.7ms) and mid-mobile (p95 <= 33ms).
   Commit counts come from the real React.Profiler in the story. */
import { test, expect } from '@playwright/test';
import { gotoStory, perf } from '../../../helpers/index';

test.skip(!process.env.AG_REMOTE_RUNNER, 'remote perf lane only (AG_REMOTE_RUNNER=1)');

const PROFILES: Array<{ name: string; viewport: { width: number; height: number }; cpuRate: number; p95Ms: number }> = [
  { name: 'desktop-120hz', viewport: { width: 1280, height: 800 }, cpuRate: 1, p95Ms: 16.7 },
  { name: 'mid-mobile', viewport: { width: 390, height: 844 }, cpuRate: 4, p95Ms: 33 },
];

test.describe('sheet perf (CMP-406 / REQ-CMP-96)', () => {
  for (const profile of PROFILES) {
    test(`${profile.name}: 60-move handle drag — 0 React commits mid-drag; p95 <= ${profile.p95Ms}ms`, async ({ page, context }) => {
      await page.setViewportSize(profile.viewport);
      if (profile.cpuRate > 1) {
        const session = await context.newCDPSession(page).catch(() => null);
        await session?.send('Emulation.setCPUThrottlingRate', { rate: profile.cpuRate }).catch(() => undefined);
      }
      await gotoStory(page, 'overlays-sheet--bottom-detents');
      const handle = page.locator('[data-ag-part="handle"]').first();
      await expect(handle).toBeVisible();
      const box = (await handle.boundingBox())!;

      // REQ-CMP-96: real React.Profiler commit counter in the story —
      // opening must commit (counter > 0); the pointermove drag must not.
      const openCommits = await page.evaluate(
        () => (window as unknown as { __agCommits?: number }).__agCommits ?? 0,
      );
      expect(openCommits, 'open must produce React commits').toBeGreaterThan(0);
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
      expect(frames.p95Ms, `${profile.name} p95`).toBeLessThanOrEqual(profile.p95Ms);
      const commits = await page.evaluate(
        () => (window as unknown as { __agCommits: number }).__agCommits,
      );
      expect(commits, 'no React commits during pointermove drag').toBe(0);
    });
  }
});
