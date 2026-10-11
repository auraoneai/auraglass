
/* CMP-349 (lane 3i-Q). Grid Masonry: Tab through focusable items and assert
   focus order equals DOM order in the column-fallback path (Chromium) and the
   native masonry path where supported. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

test.describe('grid masonry (CMP-349)', () => {
  test('focus order equals DOM order in both layout paths', async ({ page, browserName }) => {
    await gotoStory(page, 'core-grid--masonry');
    const root = page.locator('[data-ag-part="root"]').first();
    await expect(root).toHaveAttribute('data-ag-variant', 'masonry');
    const domOrder = await root.evaluate(
      (el) => [...el.querySelectorAll('a, button, [tabindex]')].map((n) => n.textContent),
    );
    if (domOrder.length === 0) return; // no focusables in this story
    const focusOrder: (string | null)[] = [];
    for (let i = 0; i < domOrder.length; i++) {
      await page.keyboard.press('Tab');
      focusOrder.push(await page.evaluate(() => document.activeElement?.textContent ?? null));
    }
    expect(focusOrder).toEqual(domOrder);
    // browserName used for engine-specific masonry path reporting
    expect(['chromium', 'webkit', 'firefox']).toContain(browserName);
  });
});
