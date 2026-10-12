/* CMP-385 + CMP-387 (lane 3i-Q). Remote perf lane only — runs under AG_REMOTE_RUNNER=1 on
   the PRD-PERF harness (tests/perf/harness/run-perf.mjs + grade.mjs). This file
   registers the cases; harness seam lands with PRD-PERF. */
import { test, expect } from '@playwright/test';
import { gotoStory, perf } from '../../../helpers/index';

// Remote-only (machine policy): a local run fails loudly instead of skipping (PRD §18).
if (process.env.AG_REMOTE_RUNNER !== '1') throw new Error('remote perf lane only: run on the remote runner (AG_REMOTE_RUNNER=1)');


import { listSubjects } from '../../../helpers/index';

test.describe('glass modal 4.x pixel parity (CMP-385/387)', () => {
  const VIEWPORTS = [{ width: 1440, height: 900 }, { width: 390, height: 844 }];
  /* The 4.x story ids (glass-modal/glass-dialog/glass-drawer) are not in the
     5.x Storybook; the 4.x names ship as compat wrappers over their 5.0
     successors (GlassModal/GlassDialog -> Dialog, GlassDrawer -> Sheet,
     src/compat/cmp/overlays/*). Each case runs against its successor's
     registered subject; a missing subject fails the case, never skips it. */
  const STORIES: Array<[legacy: string, successor: string]> = [
    ['glass-modal--default', 'overlays-dialog--default'],
    ['glass-dialog--default', 'overlays-dialog--default'],
    ['glass-drawer--default', 'overlays-sheet--right-panel'],
  ];

  for (const vp of VIEWPORTS) {
    for (const [story, successor] of STORIES) {
      test(`${story} @ ${vp.width}x${vp.height}: screenshot vs pre-change SHA`, async ({ page }) => {
        await page.setViewportSize(vp);
        const subjects = await listSubjects();
        const id = subjects.find((s) => s.id === successor)?.id;
        expect(id, `5.0 successor ${successor} of ${story} not in the subject index`).toBeTruthy();
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

  /* REQ-CMP-84: 4.x-vs-5.0 forced-colors. 4.x GlassModal over the dashboard
     perf fixture kept 10 visible backdrop-filters under forced colours; the 5.0
     successor (Dialog over the six-surface perf dashboard, CMP-223) must keep 0.
     Runs unconditionally against the real Storybook id; visibility uses client
     rects, not offsetParent (null for position:fixed scrims and popups). */
  test('modal perf story forced-colors: 0 visible backdrop-filters (4.x: 10)', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await gotoStory(page, 'cmp-fixtures-dialog-perf--dialog-over-dashboard', { forcedColors: true });
    await expect(page.locator('[data-ag-part="popup"]').first()).toBeVisible();
    const blurred = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('*')].filter((el) => {
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || el.getClientRects().length === 0) return false;
        const before = getComputedStyle(el, '::before');
        const own = cs.backdropFilter !== 'none' && cs.backdropFilter !== '';
        const pseudo = before.content !== 'none' && before.backdropFilter !== 'none' && before.backdropFilter !== '';
        return own || pseudo;
      }).length,
    );
    expect(blurred).toBe(0);
  });
});
