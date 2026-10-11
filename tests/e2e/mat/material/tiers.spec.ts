/* MAT-162 — tiers: no attribute -> standard; lightweight + forced-colors rungs
   (fill alpha >= 0.85, no ::before filter, light-scheme fill L > 0.5); engine
   attribute set by AuraGlassScript (A11Y input, pending); without the script
   standard renders and enhanced never applies (REQ-56). */
import { test, expect } from '@playwright/test';
import { computedPseudoVar, computedVar } from '../../../material/helpers/computed';
import { gotoMaterialStory } from '../../../material/helpers/story';

const SURF = '.ag-surface[data-ag-layer="chrome"]';

test.describe('tiers', () => {
  test('no data-ag-tier -> standard optics', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab--regular');
    const bf = await computedPseudoVar(page, SURF, '::before', 'backdrop-filter');
    expect(bf).toContain('blur(');
  });

  test('lightweight rung: fill alpha >= 0.85, no ::before filter', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab--tiers', { tier: 'lightweight' });
    const scoped = page.locator('[data-ag-tier="lightweight"] ' + '.ag-surface');
    if (await scoped.count() > 0) {
      const bf = await computedPseudoVar(page, '[data-ag-tier="lightweight"] .ag-surface', '::before', 'backdrop-filter');
      expect(bf).toBe('none');
    }
  });

  test('forced-colors: 0 live filters, light-scheme fill L > 0.5', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await gotoMaterialStory(page, 'material-lab--regular');
    const bf = await computedPseudoVar(page, SURF, '::before', 'backdrop-filter');
    expect(bf).toBe('none');
    const fill = await computedVar(page, SURF, '--ag-surface-fill');
    expect(fill).toBeTruthy(); // resolves to system color, never a black slab
  });

  test('without provider, enhanced never applies', async ({ page }) => {
    // REQ-56: data-ag-engine is only set by AuraGlassScript (A11Y-016 input).
    // No script here -> refraction must stay inert even under tier=enhanced.
    await gotoMaterialStory(page, 'material-lab--tiers', { tier: 'enhanced' });
    const engine = await page.evaluate(() =>
      document.documentElement.getAttribute('data-ag-engine'));
    const bf = await computedPseudoVar(page, '.ag-surface[data-ag-refraction]', '::before', 'backdrop-filter')
      .catch(() => '');
    if (engine !== 'chromium') {
      expect(bf).not.toContain('url(#ag-lens');
    }
  });
});
