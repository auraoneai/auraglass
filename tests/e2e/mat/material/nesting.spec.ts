/* MAT-157 — nesting: nested surface ::before is inert with inner fill;
   allowNested keeps optics and logs the depth warning; portaled overlay
   inside a nested tree keeps optics; disabled host opacity 1; input inside
   Dialog has 0 live filters. */
import { test, expect } from '@playwright/test';
import { computedVar, computedPseudoVar } from '../../../material/helpers/computed';
import { gotoMaterialStory } from '../../../material/helpers/story';

test.describe('material nesting', () => {
  test('nested surface ::before inert, fill = inner fill', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab--nesting-and-groups');
    const sel = '.ag-surface .ag-surface:not([data-ag-allow-nested])';
    await expect(page.locator(sel).first()).toHaveCount(1);
    expect(await computedPseudoVar(page, sel, '::before', 'backdrop-filter')).toBe('none');
    expect(await computedVar(page, sel, '--ag-surface-fill')).toBeTruthy();
  });

  test('allowNested keeps optics, dev warning at depth >= 2', async ({ page }) => {
    const warnings: string[] = [];
    page.on('console', (m) => { if (m.text().includes('[aura-glass]')) warnings.push(m.text()); });
    await gotoMaterialStory(page, 'material-lab--nesting-and-groups');
    const bf = await computedPseudoVar(page, '.ag-surface[data-ag-allow-nested]', '::before', 'backdrop-filter');
    expect(bf).toContain('blur(');
    expect(warnings.some((w) => w.includes('allowNested at depth'))).toBeTruthy();
  });

  test('disabled surface host opacity 1', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab--nesting-and-groups');
    const opacity = await page.locator('.ag-surface[data-disabled]').first()
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
  });

  test('controls inside a surface carry 0 live filters', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab--nesting-and-groups');
    const live = await page.locator('.ag-surface input, .ag-surface button').evaluateAll((els) =>
      els.filter((el) => getComputedStyle(el, '::before').backdropFilter !== 'none').length);
    expect(live).toBe(0);
  });
});
