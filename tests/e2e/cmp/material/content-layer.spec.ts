
/* CMP-348 (lane 3i-Q). Chromium + WebKit: Default stories of Card, Alert,
   Skeleton carry data-ag-layer="content" and ::before backdropFilter "none";
   Card RegularOverMedia keeps a non-none backdrop-filter. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

test.describe('content layer (CMP-348)', () => {
  for (const story of ['core-card--default', 'core-alert--default', 'core-skeleton--default']) {
    test(`${story}: content layer, no ::before blur`, async ({ page }) => {
      await gotoStory(page, story);
      const root = page.locator('[data-ag-part="root"], [data-ag-surface]').first();
      await expect(root).toHaveAttribute('data-ag-layer', 'content');
      const bf = await root.evaluate((el) => getComputedStyle(el, '::before').backdropFilter);
      expect(['none','']).toContain(bf);
    });
  }

  test('Card over media keeps its blur (RegularOverMedia)', async ({ page }) => {
    await gotoStory(page, 'core-card--regular-over-media');
    const root = page.locator('[data-ag-part="root"], [data-ag-surface]').first();
    const bf = await root.evaluate((el) => getComputedStyle(el, '::before').backdropFilter);
    // over-media surfaces blur through ::before or the element itself
    const selfBf = await root.evaluate((el) => getComputedStyle(el).backdropFilter);
    expect(bf !== 'none' || selfBf !== 'none').toBe(true);
  });
});
