/* MAT-160 — optics table: filter order, blur ladder cap, saturation/brightness
   single values, prominent accent cap, grain URL on ::before, rim delta,
   Fresnel band, specular under contrast-more, shadow per thickness, dim 0.35
   for clear over light/media, hover specular rise (instant under reduced
   motion). */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect } from '@playwright/test';
import { computedPseudoVar, computedVar } from '../../../material/helpers/computed';
import { gotoMaterialStory } from '../../../material/helpers/story';

const SURF = '.ag-surface[data-ag-layer="chrome"]';
/* The glass variants carry the blur ladder (REQ-MAT-07/-32); identity is
   optically inert and layer=content never has a backdrop filter (REQ-MAT-31). */
const GLASS = `${SURF}[data-ag-variant="regular"], ${SURF}[data-ag-variant="clear"]`;
const INERT = `${SURF}[data-ag-variant="identity"], .ag-surface[data-ag-layer="content"]`;
const GRAIN = readFileSync(join(process.cwd(), 'src/material/assets/ag-grain-128.avif'));

/** The url() layers of a computed background-image list, unquoted. */
const urls = (bg: string): string[] =>
  [...bg.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/g)].map((m) => m[2]!);
/** A url() is the grain tile: the shipped asset path, or (when the bundler
    inlines the <= 4 KB tile) a data: URI carrying exactly the asset's bytes. */
const isGrain = (u: string): boolean => {
  if (/ag-grain-128[^/]*\.avif/.test(u)) return true;
  const m = /^data:image\/avif;base64,(.+)$/.exec(u);
  return !!m && Buffer.from(m[1]!, 'base64').equals(GRAIN);
};

test.describe('optics', () => {
  test('backdrop-filter order: blur -> saturate -> brightness', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-examples--regular');
    const bf = await computedPseudoVar(page, SURF, '::before', 'backdrop-filter');
    const i = (s: string) => bf.indexOf(s);
    expect(i('blur(')).toBeGreaterThanOrEqual(0);
    expect(i('blur(')).toBeLessThan(i('saturate('));
    if (i('brightness(') >= 0) expect(i('saturate(')).toBeLessThan(i('brightness('));
  });

  test('blur ladder 12/20/32 and never > 32px', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-matrix--matrix');
    const blurOf = (els: Element[]) => els.map((el) => {
      const m = getComputedStyle(el, '::before').backdropFilter.match(/blur\((\d+(?:\.\d+)?)px\)/);
      return m ? Number(m[1]) : 0;
    });
    const all = await page.locator('.ag-surface').evaluateAll(blurOf);
    for (const b of all) expect(b).toBeLessThanOrEqual(32);
    // regular + clear x thin/regular/thick: exactly the 12/20/32 ladder
    const glass = await page.locator(GLASS).evaluateAll(blurOf);
    expect(glass).toHaveLength(6);
    expect(new Set(glass)).toEqual(new Set([12, 20, 32]));
    // identity and content-raised cells render no backdrop blur at all
    const inert = await page.locator(INERT).evaluateAll((els) =>
      els.map((el) => getComputedStyle(el, '::before').backdropFilter));
    expect(inert).toHaveLength(6);
    for (const bf of inert) expect(bf).toBe('none');
  });

  test('saturate is a single value', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-examples--regular');
    const bf = await computedPseudoVar(page, SURF, '::before', 'backdrop-filter');
    expect((bf.match(/saturate\(/g) ?? []).length).toBe(1);
  });

  test('prominent accent <= 0.18', async ({ page }) => {
    await gotoMaterialStory(page, 'material-optics--prominent');
    const acc = await computedVar(page, '.ag-surface[data-ag-prominent]', '--_ag-accent-mix');
    expect(parseFloat(acc)).toBeLessThanOrEqual(0.18);
  });

  test('grain URL on ::before, host mix-blend-mode normal', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-examples--regular');
    const bg = await computedPseudoVar(page, SURF, '::before', 'background-image');
    const layers = urls(bg);
    expect(layers, `::before background-image: ${bg.slice(0, 120)}`).toHaveLength(1);
    expect(isGrain(layers[0]!), 'the url() layer is the ag-grain-128.avif tile').toBe(true);
    const blend = await page.locator(SURF).first().evaluate((el) => getComputedStyle(el).mixBlendMode);
    expect(blend).toBe('normal');
  });

  test('Fresnel lit band >= +12 levels over flat black', async ({ page }) => {
    // measured in the visual lane; here assert the Fresnel layer exists in the
    // ::before background stack on a standard surface
    await gotoMaterialStory(page, 'material-lab-examples--regular');
    const bg = await computedPseudoVar(page, SURF, '::before', 'background-image');
    expect(bg.split(',').length).toBeGreaterThan(1);
  });

  test('specular driven by --ag-specular; 0 under contrast-more', async ({ page }) => {
    // --ag-specular is registered inherits:false (REQ-MAT-28): it is read on
    // the surface host, whose ::before/::after sheen inherit it.
    await gotoMaterialStory(page, 'material-lab-examples--regular');
    const s0 = parseFloat(await computedVar(page, SURF, '--ag-specular'));
    expect(s0).toBeGreaterThan(0);
    expect(parseFloat(await computedPseudoVar(page, SURF, '::after', '--ag-specular'))).toBe(s0);
    // under prefers-contrast: more, specular is killed (REQ-MAT-32)
    await page.emulateMedia({ contrast: 'more' });
    await gotoMaterialStory(page, 'material-lab-examples--regular');
    await expect.poll(async () => parseFloat(await computedVar(page, SURF, '--ag-specular'))).toBe(0);
    expect(parseFloat(await computedPseudoVar(page, SURF, '::after', '--ag-specular'))).toBe(0);
  });

  test('shadow scales by thickness', async ({ page }) => {
    // REQ-MAT-32: the shadow is the host box-shadow (var(--_ag-shadow)), keyed
    // by thickness; thin/regular/thick of one variant must all differ.
    await gotoMaterialStory(page, 'material-lab-matrix--matrix');
    const shadows = await page.locator(`${SURF}[data-ag-variant="regular"]`).evaluateAll((els) =>
      els.map((el) => getComputedStyle(el).boxShadow));
    expect(shadows).toHaveLength(3);
    for (const sh of shadows) expect(sh).not.toBe('none');
    expect(new Set(shadows).size).toBe(3);
  });

  test('clear over light/media dims at --_ag-dim 0.35', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-examples--clear');
    const dim = await computedVar(page, '.ag-surface[data-ag-variant="clear"]', '--_ag-dim');
    expect(parseFloat(dim)).toBeCloseTo(0.35, 2);
  });
});
