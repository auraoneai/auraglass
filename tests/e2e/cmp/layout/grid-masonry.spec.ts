/* CMP-349 / REQ-CMP-112 (lane 3i-Q). Grid Masonry: Tab through the story's
   focusable items and assert focus order equals DOM order on whichever layout
   path the engine takes (native `grid-template-rows: masonry` under @supports,
   otherwise the CSS-columns fallback). Remote Playwright lane only. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

test.describe('grid masonry (CMP-349)', () => {
  test('focus order equals DOM order in both layout paths', async ({ page }) => {
    await gotoStory(page, 'core-grid--masonry');
    const root = page.locator('[data-ag-part="root"]').first();
    await expect(root).toHaveAttribute('data-ag-appearance', 'masonry');

    const { native, display } = await root.evaluate((el) => ({
      native: CSS.supports('grid-template-rows', 'masonry'),
      display: getComputedStyle(el).display,
    }));
    expect(display).toBe(native ? 'grid' : 'block');

    const domOrder = await root.evaluate(
      (el) => [...el.querySelectorAll('a, button, [tabindex]')].map((n) => n.textContent),
    );
    expect(domOrder.length).toBeGreaterThanOrEqual(4);

    const focusOrder: (string | null)[] = [];
    for (let i = 0; i < domOrder.length; i++) {
      await page.keyboard.press('Tab');
      focusOrder.push(await page.evaluate(() => document.activeElement?.textContent ?? null));
    }
    expect(focusOrder).toEqual(domOrder);
  });
});
