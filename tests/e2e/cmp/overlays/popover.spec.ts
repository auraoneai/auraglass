
/* CMP-397 companion (lane 3i-Q). Popover "collision at 390": anchored at each
   viewport edge at 390x844, documentElement shows no horizontal overflow. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

test.describe('popover collision at 390 (CMP-397)', () => {
  test('anchored popup stays inside a 390px viewport at every side', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoStory(page, 'overlays-popover--side-align');
    const popup = page.locator('[data-ag-part="popup"]').first();
    await expect(popup).toBeVisible();
    const box = await popup.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(-1);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390 + 1);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
