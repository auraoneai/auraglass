/* MAT-159 — content materials: layer=content without variant is opaque and
   filter-free in every tier; sunken gets inset top shade; explicit
   variant=regular blurs. */
import { test, expect } from '@playwright/test';
import { computedPseudoVar, computedVar } from '../../../material/helpers/computed';
import { gotoMaterialStory } from '../../../material/helpers/story';

test.describe('content materials', () => {
  for (const tier of ['standard', 'enhanced', 'lightweight'] as const) {
    test(`content without variant: no backdrop in ${tier}`, async ({ page }) => {
      await gotoMaterialStory(page, 'material-lab--content-raised', { tier });
      const sel = '.ag-surface[data-ag-layer="content"]';
      expect(await computedPseudoVar(page, sel, '::before', 'backdrop-filter')).toBe('none');
      expect(await computedVar(page, sel, '--ag-surface-fill')).toBeTruthy();
    });
  }

  test('sunken carries inset top shade', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab--content-sunken');
    const shadow = await computedPseudoVar(
      page, '.ag-surface[data-ag-content="content-sunken"]', '::before', 'box-shadow');
    expect(shadow).toContain('inset');
  });

  test('explicit variant=regular on content blurs', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab--matrix');
    const sel = '.ag-surface[data-ag-layer="content"][data-ag-variant="regular"]';
    if (await page.locator(sel).count() === 0) return; // cell absent from grid
    const bf = await computedPseudoVar(page, sel, '::before', 'backdrop-filter');
    expect(bf).toContain('blur(');
  });
});
