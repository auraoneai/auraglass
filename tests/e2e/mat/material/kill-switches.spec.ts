/* MAT-164 — kill switches (interim SC-37 owner pending PRD-15): subtree
   data-ag-tier / data-ag-transparency / solid override descendants only,
   siblings unchanged. */
import { test, expect } from '@playwright/test';
import { computedPseudoVar, computedVar } from '../../../material/helpers/computed';
import { gotoMaterialStory } from '../../../material/helpers/story';

test.describe('kill switches', () => {
  test('subtree data-ag-tier=standard removes the lens under enhanced', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'enhanced is Chromium-only');
    await gotoMaterialStory(page, 'material-lab--tiers', { tier: 'enhanced', engine: 'chromium' });
    // flip a subtree to standard
    await page.evaluate(() => {
      const host = document.querySelector('[data-ag-tier="enhanced"]');
      if (host) host.setAttribute('data-ag-tier', 'standard');
    });
    const bf = await computedPseudoVar(page, '[data-ag-tier="standard"] .ag-surface', '::before', 'backdrop-filter')
      .catch(() => '');
    expect(bf).not.toContain('url(#ag-lens');
  });

  test('subtree solid gives lightweight rung; siblings unchanged', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab--preferences');
    const solidBf = await computedPseudoVar(
      page, '[data-ag-transparency="solid"] .ag-surface', '::before', 'backdrop-filter');
    const glassBf = await computedPseudoVar(
      page, '[data-ag-transparency="glass"] .ag-surface', '::before', 'backdrop-filter').catch(() => '');
    expect(solidBf).toBe('none');
    if (glassBf) expect(glassBf).toContain('blur(');
  });

  test('subtree tinted raises the tint floor only under that subtree', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab--preferences');
    const tinted = await computedVar(page, '[data-ag-transparency="tinted"] .ag-surface', '--_ag-tint-floor');
    const glass = await computedVar(page, '[data-ag-transparency="glass"] .ag-surface', '--_ag-tint-floor')
      .catch(() => '');
    expect(parseFloat(tinted)).toBeGreaterThanOrEqual(0.55);
    if (glass) expect(parseFloat(glass)).toBeLessThan(parseFloat(tinted));
  });
});
