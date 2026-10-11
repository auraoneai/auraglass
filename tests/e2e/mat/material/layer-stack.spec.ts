/* MAT-156 — layer stack: host backdrop-filter none; ::before carries the
   ladder blur; ::after carries --ag-specular response; host stays paint-clean;
   the six public read-outs resolve non-empty. Browser-only (remote lane). */
import { test, expect } from '@playwright/test';
import { computedVar, computedPseudoVar } from '../../../material/helpers/computed';
import { gotoMaterialStory } from '../../../material/helpers/story';

const BLUR_LADDER = { thin: '12px', regular: '20px', thick: '32px' } as const;

test.describe('material layer stack', () => {
  for (const [thickness, px] of Object.entries(BLUR_LADDER)) {
    test(`::before --_ag-blur = ${px} at thickness ${thickness}`, async ({ page }) => {
      await gotoMaterialStory(page, 'material-lab-matrix--matrix');
      const sel = `.ag-surface[data-ag-thickness="${thickness}"]`;
      await expect(page.locator(sel).first()).toHaveCount(1);
      expect(await computedVar(page, sel, '--_ag-blur')).toBe(px);
      // blur lives on ::before, not the host
      expect(await page.locator(sel).first().evaluate((el) => getComputedStyle(el).backdropFilter)).toBe('none');
      const bf = await computedPseudoVar(page, sel, '::before', 'backdrop-filter');
      expect(bf).toContain('blur(');
    });
  }

  test('host is paint-clean', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab--overview');
    const s = await page.locator('.ag-surface').first().evaluate((el) => getComputedStyle(el));
    expect(s.transform).toBe('none');
    expect(s.willChange).toBe('auto');
    expect(s.contain).toBe('none');
    expect(s.opacity).toBe('1');
    expect(s.filter).toBe('none');
  });

  test('::after --ag-specular changes on interactive hover', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab--nesting-and-groups');
    const sel = '.ag-surface[data-ag-interactive]';
    const before = await computedPseudoVar(page, sel, '::after', '--ag-specular');
    await page.locator(sel).first().hover();
    const after = await computedPseudoVar(page, sel, '::after', '--ag-specular');
    expect(after).not.toBe(before);
  });

  test('six public read-outs resolve', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab--overview');
    for (const v of ['--ag-surface-fill', '--ag-surface-rim', '--ag-surface-shadow', '--ag-surface-radius', '--ag-on-surface', '--ag-on-surface-muted']) {
      const val = await computedVar(page, '.ag-surface', v);
      expect(val && val !== 'initial').toBeTruthy();
    }
  });
});
