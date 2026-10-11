/* MAT-158 — SurfaceGroup: 5-child toolbar has exactly 1 visible backdrop
   filter (grouping); children keep rim and shadow. */
import { test, expect } from '@playwright/test';
import { readDensity } from '../../../material/helpers/density';
import { gotoMaterialStory } from '../../../material/helpers/story';

test.describe('SurfaceGroup', () => {
  test('5-child toolbar renders exactly 1 visible backdrop filter', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab--nesting-and-groups');
    const density = await readDensity(page, '[data-ag-group]');
    expect(density.liveBackdropFilters).toBe(1);
    // children keep rim (::after background non-none) and shadow
    const rimBg = await page.locator('[data-ag-group] .ag-surface').first()
      .evaluate((el) => getComputedStyle(el, '::after').backgroundImage);
    expect(rimBg).not.toBe('none');
    const shadow = await page.locator('[data-ag-group] .ag-surface').first()
      .evaluate((el) => getComputedStyle(el, '::before').boxShadow);
    expect(shadow).not.toBe('none');
  });
});
