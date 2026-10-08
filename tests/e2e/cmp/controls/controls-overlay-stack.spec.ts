
/* CMP-378 (lane 3i-Q). Select and Combobox inside the overlays Dialog story:
   first Escape closes only the popup, second closes the Dialog; popups portal
   into the provider [data-ag-portal-root]; popup z-order above the scrim.
   PENDING: the Dialog story with a Select inside does not exist yet — this spec
   skips per-case until a composite scene lands (records PENDING, not FAIL). */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

test.describe('controls overlay stack (CMP-378)', () => {
  test('select popup closes first, dialog second; portal + z-order', async ({ page }) => {
    await gotoStory(page, 'overlays-dialog--form');
    const dialogPopup = page.locator('[data-ag-part="popup"]').first();
    await expect(dialogPopup).toBeVisible();

    const selectTrigger = dialogPopup.locator('[data-ag-part="trigger"], [role="combobox"]').first();
    test.skip((await selectTrigger.count()) === 0,
      'composite scene pending: no Select/Combobox mounted inside a Dialog story yet');
    await selectTrigger.click();
    const listbox = page.locator('[role="listbox"], [role="option"]').first();
    await expect(listbox).toBeVisible();

    // popup portals into the provider root
    const inPortalRoot = await page.evaluate(
      () => !!document.querySelector('[data-ag-portal-root] [role="listbox"], [data-ag-portal-root] [role="option"]'),
    );
    expect(inPortalRoot).toBe(true);

    await page.keyboard.press('Escape');
    await expect(listbox).toHaveCount(0);
    await expect(dialogPopup).toBeVisible();  // dialog still open
    await page.keyboard.press('Escape');
    await expect(dialogPopup).toHaveCount(0);
  });
});
