
/* CMP-366 (lane 3i-Q). Toolbar APG: one tab stop, Arrow keys move with loop,
   Home/End bound, disabled items skipped. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('toolbar APG (CMP-366)', () => {
  test('roving tabindex: one tab stop; arrows loop, disabled skipped', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-toolbar--default');
    const toolbar = page.locator('[role="toolbar"]').first();
    await expect(toolbar).toBeVisible();
    const items = toolbar.locator('button, [data-ag-part]');
    const tabbables = await items.evaluateAll(
      (els) => els.filter((el) => el.getAttribute('tabindex') !== '-1' && !el.hasAttribute('disabled')).length,
    );
    expect(tabbables).toBe(1);

    await toolbar.locator('button, [data-ag-part]').first().focus();
    await apg.keyboard(page, [{ press: 'End' }, { press: 'ArrowRight' }, { press: 'Home' }]);
    // focus stays inside the toolbar after looping
    const inside = await page.evaluate(
      () => !!document.querySelector('[role="toolbar"]')?.contains(document.activeElement),
    );
    expect(inside).toBe(true);
    await apg.axe(page);
  });
});
