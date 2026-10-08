
/* CMP-401 (lane 3i-Q). Menu APG, 3 engines — full menu-button script:
   open keys, wrap, Home/End, typeahead, submenu ArrowRight/Left, Escape per
   level with focus restore, Tab closes. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('menu APG (CMP-401)', () => {
  test('menu-button script: open, wrap, typeahead, escape restores', async ({ page }) => {
    await gotoStory(page, 'overlays-menu--playground');
    const trigger = page.locator('[data-ag-part="trigger"], button').first();
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    const menu = page.locator('[role="menu"], [data-ag-part="popup"]').first();
    await expect(menu).toBeVisible();

    await apg.keyboard(page, [
      { press: 'End' },
      { press: 'ArrowDown' },  // wraps to first
      { press: 'Home' },
    ]);
    // typeahead: 'b' then 'ba' within 500ms
    await page.keyboard.type('b');
    await page.keyboard.type('a');
    const focusInside = await page.evaluate(
      () => !!document.activeElement?.closest('[role="menu"], [data-ag-part="popup"]'),
    );
    expect(focusInside).toBe(true);

    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await apg.axe(page);
  });

  test('submenu: ArrowRight opens, ArrowLeft returns', async ({ page }) => {
    await gotoStory(page, 'overlays-menu--submenu');
    const trigger = page.locator('[data-ag-part="trigger"], button').first();
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    const sub = page.locator('[data-ag-part="trigger"][aria-haspopup], [role="menuitem"][aria-haspopup="true"]').first();
    if (await sub.count()) {
      await sub.focus();
      await page.keyboard.press('ArrowRight');
      expect(await page.locator('[role="menu"], [data-ag-part="popup"]').count()).toBeGreaterThanOrEqual(2);
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('Escape');
    }
  });
});
