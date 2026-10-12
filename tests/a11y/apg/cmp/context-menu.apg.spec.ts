/* CMP-402 + REQ-CMP-105 (lane 3i-Q). ContextMenu APG, 3 engines: right-click,
   Shift+F10 and the ContextMenu key each open the menu with focus on the
   first item; Escape restores focus to the region that opened it. Coarse
   long-press (500 ms) is covered in Menu.test.tsx with fake timers. */
import { test, expect, type Page } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

const MENU = '[role="menu"]:visible';

async function expectOpenOnFirstItem(page: Page) {
  const menu = page.locator(MENU);
  await expect(menu).toHaveCount(1);
  await expect(menu.getByRole('menuitem').first()).toBeFocused();
  await expect(menu.getByRole('menuitem').first()).toHaveText('Inspect');
}

test.describe('context-menu APG (CMP-402 / REQ-CMP-105)', () => {
  test('contextmenu, Shift+F10 and the ContextMenu key open on the first item; focus restores', async ({ page }) => {
    await gotoStory(page, 'flagships-overlays-menu--context-menu-scene');
    const region = page.locator('[data-ag-part="context-trigger"] [data-context-area]');
    await expect(region).toHaveCount(1);

    // pointer: right-click
    await region.click({ button: 'right' });
    await expectOpenOnFirstItem(page);
    await page.keyboard.press('Escape');
    await expect(page.locator(MENU)).toHaveCount(0);
    await expect(region).toBeFocused();

    // keyboard: Shift+F10 (synthesized through BU's own contextmenu handling)
    await region.focus();
    await page.keyboard.press('Shift+F10');
    await expectOpenOnFirstItem(page);
    await page.keyboard.press('Escape');
    await expect(page.locator(MENU)).toHaveCount(0);
    await expect(region).toBeFocused();

    // keyboard: the ContextMenu key
    await page.keyboard.press('ContextMenu');
    await expectOpenOnFirstItem(page);
    await page.keyboard.press('Escape');
    await expect(page.locator(MENU)).toHaveCount(0);
    await expect(region).toBeFocused();
    await apg.axe(page);
  });
});
