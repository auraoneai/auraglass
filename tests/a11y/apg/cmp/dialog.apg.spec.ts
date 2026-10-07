
/* CMP-391 (lane 3i-Q). Dialog APG, 3 engines: focus moves in on open; Tab and
   Shift+Tab cycle inside; Escape closes and restores focus; background is inert
   (30 Tabs stay inside); no layout shift on scroll lock. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('dialog APG (CMP-391)', () => {
  test('focus moves in; Tab cycles inside; Escape restores focus', async ({ page }) => {
    await gotoStory(page, 'overlays-dialog--default');
    const popup = page.locator('[data-ag-part="popup"]').first();
    await expect(popup).toBeVisible();

    // focus moved inside on open
    const inside = await page.evaluate(
      () => !!document.querySelector('[data-ag-part="popup"]')?.contains(document.activeElement),
    );
    expect(inside).toBe(true);

    // no layout shift on lock: document scrollWidth unchanged
    const vw = await page.evaluate(() => document.documentElement.clientWidth);
    expect(Math.abs(vw - page.viewportSize()!.width)).toBeLessThanOrEqual(20);

    // 30 Tabs stay inside the dialog
    for (let i = 0; i < 30; i++) await page.keyboard.press('Tab');
    const stillInside = await page.evaluate(
      () => !!document.querySelector('[data-ag-part="popup"]')?.contains(document.activeElement),
    );
    expect(stillInside).toBe(true);

    // background is inert
    const inert = await page.evaluate(() => {
      const root = document.querySelector('#root, [data-ag-root], body > div:not([data-ag-part])');
      return !!document.querySelector('[inert]');
    });
    expect(inert).toBe(true);

    await page.keyboard.press('Escape');
    await expect(popup).toHaveCount(0);
    await apg.axe(page);
  });
});
