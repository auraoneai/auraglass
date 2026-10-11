/* REQ-CMP-96: at 390px the side sheet covers the full overlay container and
   its drag handle is hidden (container query @container ag-overlay <=640px).
   Remote lane only (AG_REMOTE_RUNNER=1). */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

test.skip(!process.env.AG_REMOTE_RUNNER, 'remote e2e lane only (AG_REMOTE_RUNNER=1)');

test.describe('sheet @390px (REQ-CMP-96)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('left sheet is full-width with no handle; right sheet same', async ({ page }) => {
    for (const id of ['overlays-sheet--left-panel-rtl', 'overlays-sheet--right-panel']) {
      await gotoStory(page, id);
      const popup = page.locator('[data-ag-part="popup"]').first();
      await expect(popup).toBeVisible();
      const box = (await popup.boundingBox())!;
      expect(box.width, `${id} popup covers the container`).toBe(390);
      expect(box.x).toBe(0);
      // handle is display:none on side sheets at <=640px
      await expect(popup.locator('[data-ag-part="handle"]')).toBeHidden();
    }
  });

  test('bottom sheet keeps its handle at 390px (detent drag surface)', async ({ page }) => {
    await gotoStory(page, 'overlays-sheet--bottom-detents');
    const popup = page.locator('[data-ag-part="popup"]').first();
    await expect(popup).toBeVisible();
    await expect(popup.locator('[data-ag-part="handle"]')).toBeVisible();
  });
});
