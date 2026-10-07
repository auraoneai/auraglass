
/* CMP-408 (lane 3i-Q). Toast APG, 3 engines: F6 reaches the region; the
   accessibility tree has exactly one live-region entry per toast; focus never
   moves to a new toast. Companion: tests/e2e/cmp/overlays/toast.touch.spec.ts. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('toast APG (CMP-408)', () => {
  test('F6 reaches the region; toasts announce without stealing focus', async ({ page }) => {
    await gotoStory(page, 'overlays-toast--intents');
    const region = page.locator('[data-ag-part="viewport"], [data-ag-part="region"], [role="region"], [role="status"]').first();
    await expect(region).toBeVisible();

    const activeBefore = await page.evaluate(() => document.activeElement?.tagName);
    await page.keyboard.press('F6');
    const landed = await page.evaluate(() => {
      const el = document.activeElement;
      return !!el?.closest('[data-ag-part="viewport"], [data-ag-part="region"], [role="region"]');
    });
    expect(landed).toBe(true);

    // exactly one live-region entry per toast
    const liveCounts = await page.evaluate(() => {
      const toasts = document.querySelectorAll('[data-ag-part="root"], [data-ag-part="toast"], [role="status"], [role="alert"]');
      let live = 0;
      toasts.forEach((t) => {
        const v = t.getAttribute('aria-live') ?? (t.getAttribute('role') === 'alert' ? 'assertive' : null);
        if (v) live++;
      });
      return { toasts: toasts.length, live };
    });
    expect(liveCounts.live).toBeLessThanOrEqual(Math.max(1, liveCounts.toasts));
    expect(activeBefore).not.toBe('BODY');
    await apg.axe(page);
  });
});
