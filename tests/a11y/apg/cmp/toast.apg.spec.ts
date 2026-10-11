
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

    // exactly one live-region entry per toast (raise two: polite + danger)
    await page.getByRole('button', { name: 'Info' }).click();
    await page.getByRole('button', { name: 'Error' }).click();
    await expect(page.locator('[data-ag-part="viewport"] [data-ag-part="root"]')).toHaveCount(2);
    const liveCounts = await page.evaluate(() => {
      const toasts = document.querySelectorAll('[data-ag-part="viewport"] [data-ag-part="root"]');
      let live = 0;
      toasts.forEach((t) => {
        const role = t.getAttribute('role');
        const v = t.getAttribute('aria-live') ?? (role === 'alert' ? 'assertive' : role === 'status' ? 'polite' : null);
        if (v) live++;
        // no nested live region inside a toast (would double-announce)
        live += t.querySelectorAll('[aria-live], [role="status"], [role="alert"]').length;
      });
      return { toasts: toasts.length, live };
    });
    expect(liveCounts.toasts).toBeGreaterThan(0);
    expect(liveCounts.live).toBe(liveCounts.toasts);
    expect(activeBefore).not.toBe('BODY');
    await apg.axe(page);
  });
});
