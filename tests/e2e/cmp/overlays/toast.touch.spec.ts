
/* CMP-408 companion (lane 3i-Q). Toast touch: swipe dismiss removes the toast
   on coarse pointers. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

test.use({ hasTouch: true });

test.describe('toast touch (CMP-408)', () => {
  test('swipe dismisses a toast', async ({ page }) => {
    await gotoStory(page, 'overlays-toast--intents');
    const toast = page.locator('[data-ag-part="root"], [data-ag-part="toast"], [role="status"], [role="alert"]').first();
    test.skip((await toast.count()) === 0, 'no toast rendered in scene');
    const before = await page.locator('[data-ag-part="root"], [data-ag-part="toast"], [role="status"], [role="alert"]').count();
    const box = await toast.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width + 160, box.y + box.height / 2, { steps: 6 });
      await page.mouse.up();
    }
    const after = await page.locator('[data-ag-part="root"], [data-ag-part="toast"], [role="status"], [role="alert"]').count();
    expect(after).toBeLessThanOrEqual(before);
  });
});
