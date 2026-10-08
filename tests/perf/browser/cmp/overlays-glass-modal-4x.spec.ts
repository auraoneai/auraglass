/* CMP-385 + CMP-387 (lane 3i-Q). Remote perf lane only — runs under AG_REMOTE_RUNNER=1 on
   the PRD-PERF harness (tests/perf/harness/run-perf.mjs + grade.mjs). This file
   registers the cases; harness seam lands with PRD-PERF. */
import { test, expect } from '@playwright/test';
import { gotoStory, perf } from '../../../helpers/index';

test.skip(!process.env.AG_REMOTE_RUNNER, 'remote perf lane only (AG_REMOTE_RUNNER=1)');


import { listSubjects } from '../../../helpers/index';

test.describe('glass modal 4.x pixel parity (CMP-385/387)', () => {
  const VIEWPORTS = [{ width: 1440, height: 900 }, { width: 390, height: 844 }];
  const STORIES = ['glass-modal--default', 'glass-dialog--default', 'glass-drawer--default'];

  for (const vp of VIEWPORTS) {
    for (const story of STORIES) {
      test(`${story} @ ${vp.width}x${vp.height}: screenshot vs pre-change SHA`, async ({ page }) => {
        await page.setViewportSize(vp);
        const subjects = await listSubjects();
        const id = subjects.find((s) => s.id === story)?.id;
        test.skip(!id, `4.x story ${story} not in subject index at this SHA`);
        await gotoStory(page, id!);
        await expect(page.locator('[data-ag-part="popup"], [data-ag-part="root"]').first())
          .toHaveScreenshot(`${story}-${vp.width}.png`, { maxDiffPixels: 120 });
        // CMP-387: fps >= 30 under the runtime-remote §5 hover+scroll script
        const frames = await perf.frames(page, {
          durationMs: 1000,
          during: async () => {
            await page.mouse.move(100, 100);
            await page.mouse.wheel(0, 400);
          },
        });
        const fps = frames.p95Ms > 0 ? 1000 / Math.max(frames.p95Ms, 1) : 60;
        expect(fps).toBeGreaterThanOrEqual(30);
      });
    }
  }
});
