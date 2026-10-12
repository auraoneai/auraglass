/* CMP-403 + REQ-CMP-105 (lane 3i-Q). Menubar APG, 3 engines: one tab stop;
   ArrowLeft/Right move between triggers (looping at the ends) and move an
   open menu; ArrowDown opens; Escape returns focus to the top-level trigger
   that owns the menu (never blur()). */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('menubar APG (CMP-403 / REQ-CMP-105)', () => {
  test('one tab stop; arrows move and loop; open menu follows; Escape restores the trigger', async ({ page }) => {
    await gotoStory(page, 'flagships-overlays-menu--menubar-scene');
    const menubar = page.locator('[role="menubar"]').first();
    await expect(menubar).toBeVisible();
    const trigger = (name: string) => menubar.locator('[data-ag-part="trigger"]', { hasText: name });
    const triggers = menubar.locator('[data-ag-part="trigger"]');
    await expect(triggers).toHaveCount(3);
    const tabbables = await triggers.evaluateAll(
      (els) => els.filter((el) => el.getAttribute('tabindex') !== '-1').length,
    );
    expect(tabbables).toBe(1);

    // closed: arrows move focus between triggers and loop at both ends
    await trigger('File').focus();
    await page.keyboard.press('ArrowRight');
    await expect(trigger('Edit')).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(trigger('View')).toBeFocused();
    await page.keyboard.press('ArrowRight'); // loop: last → first
    await expect(trigger('File')).toBeFocused();
    await page.keyboard.press('ArrowLeft'); // loop: first → last
    await expect(trigger('View')).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(trigger('File')).toBeFocused();

    // ArrowDown opens File's menu on its first item
    const menu = page.locator('[role="menu"]:visible');
    await page.keyboard.press('ArrowDown');
    await expect(menu).toHaveCount(1);
    await expect(menu.getByRole('menuitem', { name: 'File action' })).toBeFocused();

    // open: ArrowRight moves the open menu to Edit
    await page.keyboard.press('ArrowRight');
    await expect(menu).toHaveCount(1);
    await expect(menu.getByRole('menuitem', { name: 'Edit action' })).toBeVisible();
    await expect(trigger('Edit')).toHaveAttribute('data-popup-open', '');
    await expect(trigger('File')).not.toHaveAttribute('data-popup-open', '');

    // Escape closes and returns focus to exactly the trigger that owns the menu
    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
    await expect(trigger('Edit')).toBeFocused();
    await apg.axe(page);
  });
});
