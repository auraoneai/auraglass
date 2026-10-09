/* CMP-391 + REQ-CMP-88 (lane 3i-Q). Dialog APG, 3 engines: focus moves in on
   open; Tab and Shift+Tab cycle inside; Escape restores focus to the trigger;
   background inert; scroll-lock has exactly one owner — clientWidth before ==
   after open (±0). Non-modal: no inert, no scroll-locked attr, no backdrop. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('dialog APG (CMP-391)', () => {
  test('focus moves in; Tab cycles; Escape restores to trigger; width ±0', async ({ page }) => {
    await gotoStory(page, 'overlays-dialog--default');
    const popup = page.locator('[data-ag-part="popup"]').first();
    await expect(popup).toBeVisible();

    // focus moved inside on open (initialFocus → first tabbable else popup)
    const inside = await page.evaluate(
      () => !!document.querySelector('[data-ag-part="popup"]')?.contains(document.activeElement),
    );
    expect(inside).toBe(true);

    // scroll locked exactly once: [data-ag-scroll-locked] is the only writer
    await expect(page.locator('html')).toHaveAttribute('data-ag-scroll-locked', '');
    const buInline = await page.evaluate(() => document.documentElement.style.overflow);
    expect(buInline).not.toBe('hidden');

    // 30 Tabs stay inside the dialog (trap)
    for (let i = 0; i < 30; i++) await page.keyboard.press('Tab');
    const stillInside = await page.evaluate(
      () => !!document.querySelector('[data-ag-part="popup"]')?.contains(document.activeElement),
    );
    expect(stillInside).toBe(true);

    // background is inert
    const inert = await page.evaluate(() => !!document.querySelector('[inert]'));
    expect(inert).toBe(true);

    await page.keyboard.press('Escape');
    await expect(popup).toHaveCount(0);

    // finalFocus: the trigger button regains focus
    const trigger = page.getByRole('button', { name: 'Open dialog' });
    await expect(trigger).toBeFocused();

    // clientWidth before open == after re-open (±0)
    const before = await page.evaluate(() => document.documentElement.clientWidth);
    await trigger.click();
    await expect(popup).toBeVisible();
    const after = await page.evaluate(() => document.documentElement.clientWidth);
    expect(after).toBe(before);

    await apg.axe(page);
  });

  test('modal={false}: no inert, no scroll-locked, no backdrop', async ({ page }) => {
    await gotoStory(page, 'overlays-dialog--non-modal');
    const popup = page.locator('[data-ag-part="popup"]').first();
    await expect(popup).toBeVisible();

    const inert = await page.evaluate(() => !!document.querySelector('[inert]'));
    expect(inert).toBe(false);
    const locked = await page.evaluate(() =>
      document.documentElement.hasAttribute('data-ag-scroll-locked'),
    );
    expect(locked).toBe(false);
    await expect(page.locator('[data-ag-layer="scrim"], [data-ag-part="backdrop"]')).toHaveCount(0);

    // page stays interactive
    await page.getByPlaceholder('page input stays interactive').click();
    await expect(page.getByPlaceholder('page input stays interactive')).toBeFocused();
  });
});
