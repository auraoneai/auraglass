/* @ag-contract-seed: FND-064. Card content-layer material rendering —
   remote Playwright lane only. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../helpers/index';

test.describe('content layer', () => {
  test('card root carries the content material attributes', async ({ page }) => {
    await gotoStory(page, 'core-card--default');
    const root = page.locator('[data-ag-part="root"]').first();
    await expect(root).toHaveAttribute('data-ag-part', 'root');
  });
});
