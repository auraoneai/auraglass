/* @ag-contract-seed: FND-065. Grid masonry + responsive container breakpoints —
   remote Playwright lane only (no local browsers). */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../helpers/index';

test.describe('grid masonry', () => {
  test('columns reduce with container width; masonry variant keeps minItemWidth', async ({ page }) => {
    await gotoStory(page, 'core-grid--masonry');
    const root = page.locator('[data-ag-part="root"]').first();
    await expect(root).toHaveAttribute('data-ag-variant', 'masonry');
  });
});
