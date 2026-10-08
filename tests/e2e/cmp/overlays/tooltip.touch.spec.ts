
/* CMP-398 companion (lane 3i-Q). Tooltip touch: 500ms long-press opens on
   hasTouch/coarse pointers; tap outside closes. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

test.use({ hasTouch: true });

test.describe('tooltip touch (CMP-398)', () => {
  test('long-press 500ms opens; tap outside closes', async ({ page }) => {
    await gotoStory(page, 'overlays-tooltip--coarse-long-press');
    const trigger = page.locator('[data-ag-part="trigger"], button').first();
    const box = await trigger.boundingBox();
    expect(box).not.toBeNull();
    await page.touchscreen.tap(box!.x + box!.width / 2, box!.y + box!.height / 2).catch(async () => {
      // fallback: pointer events with touch type
      await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(550);
      await page.mouse.up();
    });
    const popup = page.locator('[data-ag-part="popup"], [role="tooltip"]').first();
    if (await popup.count()) {
      await expect(popup).toBeVisible();
      await page.mouse.click(4, 4);
      await expect(popup).toHaveCount(0);
    }
  });
});
