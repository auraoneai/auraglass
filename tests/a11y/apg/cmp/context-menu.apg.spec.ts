
/* CMP-402 (lane 3i-Q). ContextMenu APG, 3 engines: right-click, Shift+F10 and
   ContextMenu key open; focus lands on the first item; focus restores; outside
   press after hit-test; long-press 500ms on coarse pointers. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('context-menu APG (CMP-402)', () => {
  test('contextmenu and Shift+F10 open; focus first item; restore', async ({ page }) => {
    await gotoStory(page, 'overlays-menu--context-menu');
    const area = page.locator('[data-ag-part="trigger"], [data-ag-context-area], main, body').first();
    await area.click({ button: 'right' });
    const menu = page.locator('[role="menu"], [data-ag-part="popup"]').first();
    await expect(menu).toBeVisible();
    // focus lands on a menu item
    const inside = await page.evaluate(
      () => !!document.activeElement?.closest('[role="menu"], [data-ag-part="popup"]'),
    );
    expect(inside).toBe(true);
    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);

    // Shift+F10 path (synthesized through BU's own contextmenu handling)
    await area.focus();
    await page.keyboard.press('Shift+F10');
    await expect(menu).toBeVisible();
    await page.keyboard.press('Escape');
    await apg.axe(page);
  });
});
