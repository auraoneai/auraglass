/* MAT-162 / REQ-MAT-35 — tiers: no attribute -> standard (blur(20px) on a
   regular surface); lightweight rung (subtree and <html>): fill alpha >= 0.85
   following the scheme (never a black slab), grain <= 0.02, no ::before
   filter; forced-colors rung; engine attribute set by AuraGlassScript (A11Y
   input, pending); without the script enhanced never applies (REQ-56). */
import { test, expect, type Page } from '@playwright/test';
import { computedPseudoVar, computedVar } from '../../../material/helpers/computed';
import { gotoMaterialStory } from '../../../material/helpers/story';

const SURF = '.ag-surface[data-ag-layer="chrome"]';
const LIGHTWEIGHT = '[data-ag-tier="lightweight"] .ag-surface';

/** Host fill as sRGB 0..1 + alpha, normalised by the engine's own colour
    parser (a 2D canvas fill), so oklch()/color()/rgb() serialisations agree. */
async function hostFill(page: Page, selector: string) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const css = getComputedStyle(el).backgroundColor;
    const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    if (r === undefined || g === undefined || b === undefined || a === undefined) {
      throw new Error('Canvas did not return a complete RGBA pixel');
    }
    const lin = (c: number) => { const v = c / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    // WCAG relative luminance of the un-premultiplied fill colour
    const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    return { css, alpha: a / 255, luminance };
  }, selector);
}

test.describe('tiers', () => {
  test('no data-ag-tier -> standard optics: regular surface blurs 20px', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-examples--regular');
    // the story frame's provider writes data-ag-tier="standard" on <html>;
    // drop it so no element carries the attribute at all
    await page.evaluate(() => document.documentElement.removeAttribute('data-ag-tier'));
    expect(await page.locator('[data-ag-tier]').count()).toBe(0);
    const bf = await computedPseudoVar(page, SURF, '::before', 'backdrop-filter');
    expect(bf).toMatch(/(^|\s)blur\(20px\)/);
  });

  test('lightweight subtree rung: fill alpha >= 0.85, grain <= 0.02, no ::before filter', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-examples--tiers');
    // the story frame pins scheme light (data-ag-scheme on <html>)
    await page.evaluate(() => document.documentElement.setAttribute('data-ag-scheme', 'light'));
    await expect(page.locator(LIGHTWEIGHT)).toHaveCount(1);

    const bf = await computedPseudoVar(page, LIGHTWEIGHT, '::before', 'backdrop-filter');
    expect(bf).toBe('none');

    const grain = parseFloat(await computedVar(page, LIGHTWEIGHT, '--_ag-grain-opacity'));
    expect(Number.isFinite(grain)).toBe(true);
    expect(grain).toBeLessThanOrEqual(0.02);

    const fill = await hostFill(page, LIGHTWEIGHT);
    expect(fill).not.toBeNull();
    expect(fill!.alpha).toBeGreaterThanOrEqual(0.85);
    // follows the light scheme: a light canvas fill, never a black slab
    expect(fill!.luminance).toBeGreaterThan(0.5);

    // the sibling standard surface in the same story keeps its live filter
    // (<html> carries the provider's data-ag-tier="standard"; only body
    // descendants are subtree rungs)
    const standard = '.ag-surface:not(body [data-ag-tier] *)';
    const sbf = await computedPseudoVar(page, standard, '::before', 'backdrop-filter');
    expect(sbf).toMatch(/blur\(20px\)/);
  });

  test('lightweight on <html> under the dark scheme: alpha >= 0.85, dark fill (follows the scheme)', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-examples--regular', { tier: 'lightweight' });
    await page.evaluate(() => document.documentElement.setAttribute('data-ag-scheme', 'dark'));
    const bf = await computedPseudoVar(page, SURF, '::before', 'backdrop-filter');
    expect(bf).toBe('none');
    const fill = await hostFill(page, SURF);
    expect(fill).not.toBeNull();
    expect(fill!.alpha).toBeGreaterThanOrEqual(0.85);
    expect(fill!.luminance).toBeLessThan(0.5);
  });

  test('forced-colors: 0 live filters, light-scheme fill L > 0.5', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await gotoMaterialStory(page, 'material-lab-examples--regular');
    const bf = await computedPseudoVar(page, SURF, '::before', 'backdrop-filter');
    expect(bf).toBe('none');
    const fill = await computedVar(page, SURF, '--ag-surface-fill');
    expect(fill).toBeTruthy(); // resolves to system color, never a black slab
  });

  test('without provider, enhanced never applies', async ({ page }) => {
    // REQ-56: data-ag-engine is only set by AuraGlassScript (A11Y-016 input).
    // No script here -> refraction must stay inert even under tier=enhanced.
    await gotoMaterialStory(page, 'material-lab-examples--tiers', { tier: 'enhanced' });
    const engine = await page.evaluate(() =>
      document.documentElement.getAttribute('data-ag-engine'));
    const bf = await computedPseudoVar(page, '.ag-surface[data-ag-refraction]', '::before', 'backdrop-filter')
      .catch(() => '');
    if (engine !== 'chromium') {
      expect(bf).not.toContain('url(#ag-lens');
    }
  });
});
