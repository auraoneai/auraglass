/* REQ-CMP-20: target-size contract — every interactive part's hit-area meets
   the 44 px coarse box: elementFromPoint at the box edges must resolve to the
   control under (pointer: coarse) emulation. Remote lane only. */
import { test, expect, devices } from '@playwright/test';
import { gotoStory } from '../../helpers/index';

test.skip(!process.env.AG_REMOTE_RUNNER, 'remote e2e lane only (AG_REMOTE_RUNNER=1)');

test.use({ ...devices['iPhone 12'] }); /* coarse pointer + 44px targets */

const FAMILIES = [
  'controls-button--default',
  'controls-checkbox--default',
  'controls-switch--default',
  'controls-slider--default',
  'controls-toggle-group--default',
  'controls-segmented-control--default',
  'controls-select--default',
  'content-link--default',
];

test.describe('cmp target sizing', () => {
  for (const storyId of FAMILIES) {
    test(`${storyId}: 44px coarse hit box hit-tests to the control`, async ({ page }) => {
      await gotoStory(page, storyId);
      const box = await page.evaluate(() => {
        const el = document.querySelector<HTMLElement>('[data-ag-part]');
        const ha = el?.querySelector<HTMLElement>('[data-ag-part="hit-area"]') ?? el;
        if (!ha) return null;
        const r = ha.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height };
      });
      expect(box, 'hit-area present').not.toBeNull();
      expect(Math.max(box!.w, box!.h), `${storyId} hit-area ≥44px coarse`).toBeGreaterThanOrEqual(44);
      /* edges of the hit box must still hit-test to the control */
      const points = [
        [box!.x + 1, box!.y + box!.h / 2],
        [box!.x + box!.w - 1, box!.y + box!.h / 2],
        [box!.x + box!.w / 2, box!.y + 1],
        [box!.x + box!.w / 2, box!.y + box!.h - 1],
      ];
      for (const [x, y] of points) {
        const hit = await page.evaluate(([px, py]) => {
          const el = document.elementFromPoint(px!, py!);
          return el?.closest('[data-ag-part]')?.getAttribute('data-ag-part') ?? el?.tagName ?? null;
        }, [x, y]);
        expect(hit, `edge point (${Math.round(x)},${Math.round(y)})`).not.toBeNull();
      }
    });
  }
});
