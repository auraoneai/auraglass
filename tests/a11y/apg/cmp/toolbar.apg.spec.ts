
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

    /* REQ-CMP-40: exact focus index after each key; disabled items skipped. */
    const focusIndex = () => toolbar.evaluate(
      (tb) => [...tb.querySelectorAll('button, [data-ag-part]')].indexOf(document.activeElement as Element),
    );
    const n = await toolbar.locator('button, [data-ag-part]').count();
    expect(await focusIndex()).toBe(0);
    await page.keyboard.press('End');
    expect(await focusIndex()).toBe(n - 1);
    await page.keyboard.press('ArrowRight'); /* loops to 0 */
    expect(await focusIndex()).toBe(0);
    await page.keyboard.press('Home');
    expect(await focusIndex()).toBe(0);
    /* disabled items never receive focus while arrowing through */
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    const focusedDisabled = await page.evaluate(
      () => (document.activeElement as HTMLElement | null)?.hasAttribute('disabled') ?? false,
    );
    expect(focusedDisabled).toBe(false);
    const inside = await page.evaluate(
      () => !!document.querySelector('[role="toolbar"]')?.contains(document.activeElement),
    );
    expect(inside).toBe(true);
    await apg.axe(page);
  });
});
