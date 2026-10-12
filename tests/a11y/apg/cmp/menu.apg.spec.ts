/* CMP-401 + REQ-CMP-103. Menu APG, 3 engines — full menu-button keyboard
   script on the closed-by-default MenuButton story (overlays-menu--menu-button).
   Remote lane only (AG_REMOTE_RUNNER=1). */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

// Remote-only (machine policy): a local run fails loudly instead of skipping (PRD §18).
if (process.env.AG_REMOTE_RUNNER !== '1') throw new Error('remote e2e lane only: run on the remote runner (AG_REMOTE_RUNNER=1)');

const TRIGGER = '[data-ag-part="trigger"]:visible';
const MENU = '[role="menu"]:visible';
const ITEM0 = `${MENU} [role^="menuitem"]`;

test.describe('menu APG (CMP-401 / REQ-CMP-103)', () => {
  test('menu-button script: open keys, wrap, Home/End, typeahead, submenu, Escape, Tab', async ({ page }) => {
    await gotoStory(page, 'flagships-overlays-menu--menu-button');
    const trigger = page.locator(TRIGGER).first();
    const item = (name: string) => page.locator(`${MENU} [role^="menuitem"]`, { hasText: name }).first();

    // Enter opens + focuses first item
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator(MENU)).toHaveCount(1);
    await expect(item('Apple')).toBeFocused();

    // Space re-open path verified after close
    await page.keyboard.press('Escape');
    await expect(page.locator(MENU)).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await page.keyboard.press('Space');
    await expect(page.locator(MENU)).toHaveCount(1);
    await expect(item('Apple')).toBeFocused();

    // ArrowUp (from close) opens focusing LAST item
    await page.keyboard.press('Escape');
    await page.keyboard.press('ArrowUp');
    await expect(page.locator(MENU)).toHaveCount(1);
    // the last item is the 'Share' submenu trigger — exactly it, nothing else
    await expect(item('Share')).toBeFocused();

    // ArrowDown opens focusing first; Home/End move
    await page.keyboard.press('Escape');
    await page.keyboard.press('ArrowDown');
    await expect(item('Apple')).toBeFocused();
    await page.keyboard.press('End');
    await expect(item('Share')).toBeFocused();
    await page.keyboard.press('ArrowDown'); // loop: wraps from last to first
    await expect(item('Apple')).toBeFocused();
    await page.keyboard.press('ArrowUp'); // loop: wraps from first to last
    await expect(item('Share')).toBeFocused();
    await page.keyboard.press('Home');
    await expect(item('Apple')).toBeFocused();

    // typeahead 'ba' focuses Banana
    await page.keyboard.type('b', { delay: 30 });
    await page.keyboard.type('a', { delay: 30 });
    await expect(item('Banana')).toBeFocused();

    // exactly one menuitem with tabindex=0
    const tabStops = await page.locator('[role^="menuitem"][tabindex="0"]').count();
    expect(tabStops).toBe(1);

    // ArrowRight on Share opens submenu + focuses its first item
    await item('Share').focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator(MENU)).toHaveCount(2);
    await expect(page.locator(MENU).nth(1).locator('[role^="menuitem"]').first()).toBeFocused();

    // ArrowLeft closes submenu, refocuses the submenu trigger
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator(MENU)).toHaveCount(1);
    await expect(item('Share')).toBeFocused();

    // hover: resting on Share opens the submenu after Base UI's 100 ms delay
    await page.keyboard.press('Home');
    const shareBox = await item('Share').boundingBox();
    expect(shareBox, 'Share submenu trigger has a layout box').not.toBeNull();
    await page.mouse.move(shareBox!.x + shareBox!.width / 2, shareBox!.y + shareBox!.height / 2, { steps: 2 });
    // (the exact 100 ms delay is pinned with fake timers in Menu.test.tsx)
    await expect(page.locator(MENU)).toHaveCount(2, { timeout: 1000 });
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator(MENU)).toHaveCount(1);

    // Escape closes the outer menu only
    await page.keyboard.press('Escape');
    await expect(page.locator(MENU)).toHaveCount(0);
    await expect(trigger).toBeFocused();

    // Tab closes the menu and moves to the next tabbable element
    await page.keyboard.press('ArrowDown');
    await expect(page.locator(MENU)).toHaveCount(1);
    await page.keyboard.press('Tab');
    await expect(page.locator(MENU)).toHaveCount(0);
    await expect(page.locator('button', { hasText: 'Next tabbable' })).toBeFocused();

    await apg.axe(page);
  });
});
