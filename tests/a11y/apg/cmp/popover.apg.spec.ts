
/* CMP-397 (lane 3i-Q). Popover APG, 3 engines: focus in/out; Escape closes and
   restores; outside press closes. Companion spec:
   tests/e2e/cmp/overlays/popover.spec.ts ("collision at 390"). */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('popover APG (CMP-397)', () => {
  test('focus moves in; Escape and outside-press close with focus return', async ({ page }) => {
    await gotoStory(page, 'overlays-popover--playground');
    const popup = page.locator('[data-ag-part="popup"]').first();
    await expect(popup).toBeVisible();

    // focus moves into the popup on open
    const inside = await page.evaluate(
      () => !!document.querySelector('[data-ag-part="popup"]')?.contains(document.activeElement),
    );
    expect(inside).toBe(true);

    await page.keyboard.press('Escape');
    await expect(popup).toHaveCount(0);
    expect(await page.evaluate(() => document.activeElement?.tagName)).not.toBe('BODY');
    await apg.axe(page);
  });

  test('outside press closes the popover', async ({ page }) => {
    await gotoStory(page, 'overlays-popover--playground');
    const popup = page.locator('[data-ag-part="popup"]').first();
    await expect(popup).toBeVisible();
    await page.mouse.click(4, 4);
    await expect(popup).toHaveCount(0);
  });
});
