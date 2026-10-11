/* CMP-398 + REQ-CMP-101. Tooltip touch contract, unconditional legs:
   a plain tap never opens; a 550ms long-press opens; outside tap closes.
   Remote e2e lane only (AG_REMOTE_RUNNER=1) — hasTouch device required. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

test.skip(!process.env.AG_REMOTE_RUNNER, 'remote e2e lane only (AG_REMOTE_RUNNER=1)');
test.use({ hasTouch: true });

test.describe('tooltip touch (CMP-398 / REQ-CMP-101)', () => {
  test('plain tap does not open; 550ms long-press opens; outside tap closes', async ({ page }) => {
    await gotoStory(page, 'overlays-tooltip--coarse-long-press');
    const trigger = page.locator('[data-ag-part="trigger"]').first();
    await expect(trigger).toBeVisible();
    const popup = page.locator('[data-ag-part="popup"], [role="tooltip"]').first();
    const box = (await trigger.boundingBox())!;
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;

    // (1) plain tap -> nothing opens
    await page.touchscreen.tap(cx, cy);
    await expect(popup).toHaveCount(0);

    // (2) touch pointerdown held 550ms -> popup appears (500ms long-press)
    await page.dispatchEvent('[data-ag-part="trigger"]', 'pointerdown', { pointerType: 'touch', pointerId: 9, isPrimary: true });
    await page.waitForTimeout(550);
    await page.dispatchEvent('[data-ag-part="trigger"]', 'pointerup', { pointerType: 'touch', pointerId: 9, isPrimary: true });
    await expect(popup).toBeVisible();

    // (3) tap outside -> closes
    await page.touchscreen.tap(4, 4);
    await expect(popup).toHaveCount(0);
  });
});
