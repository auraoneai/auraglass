
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
    /* REQ-CMP-105: focus returns to the top-level trigger itself (the one the
       arrows moved to), not merely inside the menubar. */
    await expect(triggers.nth(1)).toBeFocused();
    await apg.axe(page);
  });
});
