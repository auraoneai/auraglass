
/* CMP-398 (lane 3i-Q). Tooltip APG, 3 engines: focus opens; Escape closes;
   aria-describedby on the trigger resolves; popup is hoverable (pointer path
   trigger→popup keeps open). Companion: tests/e2e/cmp/overlays/tooltip.touch.spec.ts. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('tooltip APG (CMP-398)', () => {
  test('focus opens; describedby resolves; Escape closes', async ({ page }) => {
    await gotoStory(page, 'overlays-tooltip--playground');
    const trigger = page.locator('[data-ag-part="trigger"], button').first();
    await trigger.focus();
    const popup = page.locator('[data-ag-part="popup"], [role="tooltip"]').first();
    await expect(popup).toBeVisible();
    const describedby = await trigger.getAttribute('aria-describedby');
    expect(describedby).toBeTruthy();
    const resolves = await page.evaluate(
      (id) => !!document.getElementById(id!), describedby,
    );
    expect(resolves).toBe(true);
    await page.keyboard.press('Escape');
    /* REQ-CMP-100: after Escape the trigger keeps focus (it never lost it). */
    await expect(page.locator('[data-ag-part="trigger"]').first()).toBeFocused();
    await expect(popup).toHaveCount(0);
    await apg.axe(page);
  });

  test('hoverable: pointer path trigger→popup keeps it open', async ({ page }) => {
    await gotoStory(page, 'overlays-tooltip--playground');
    const trigger = page.locator('[data-ag-part="trigger"], button').first();
    const popup = page.locator('[data-ag-part="popup"], [role="tooltip"]').first();
    await trigger.hover();
    await expect(popup).toBeVisible();
    await popup.hover();
    await expect(popup).toBeVisible();
  });
});
