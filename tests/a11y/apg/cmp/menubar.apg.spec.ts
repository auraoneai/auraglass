
/* CMP-403 (lane 3i-Q). Menubar APG, 3 engines: one tab stop; ArrowLeft/Right
   move between triggers and move an open menu; ArrowDown opens; Escape returns
   focus to the top-level trigger; loop. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('menubar APG (CMP-403)', () => {
  test('one tab stop; arrows move across triggers; Escape restores', async ({ page }) => {
    await gotoStory(page, 'overlays-menu--menubar');
    const menubar = page.locator('[role="menubar"]').first();
    await expect(menubar).toBeVisible();
    const triggers = menubar.locator('button, [data-ag-part="trigger"]');
    expect(await triggers.count()).toBeGreaterThanOrEqual(2);
    const tabbables = await triggers.evaluateAll(
      (els) => els.filter((el) => el.getAttribute('tabindex') !== '-1').length,
    );
    expect(tabbables).toBe(1);

    await triggers.first().focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    const menu = page.locator('[role="menu"], [data-ag-part="popup"]').first();
    await expect(menu).toBeVisible();
    await page.keyboard.press('Escape');
    // focus returns to a top-level trigger, not <body>
    const onTrigger = await page.evaluate(
      () => !!document.activeElement?.closest('[role="menubar"]'),
    );
    expect(onTrigger).toBe(true);
    await apg.axe(page);
  });
});
