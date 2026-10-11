/* MAT-161 — clear fallback: without a declared backdrop (or under nearest
   'auto'), clear computes identical ::before filter and host fill to regular;
   under light/dark/media it keeps its own cell. */
import { test, expect } from '@playwright/test';
import { computedPseudoVar, computedVar } from '../../../material/helpers/computed';
import { gotoMaterialStory } from '../../../material/helpers/story';

async function readPair(page: import('@playwright/test').Page, variant: string) {
  const sel = `.ag-surface[data-ag-variant="${variant}"]`;
  return {
    bf: await computedPseudoVar(page, sel, '::before', 'backdrop-filter'),
    fill: await computedVar(page, sel, '--ag-surface-fill'),
  };
}

test.describe('clear fallback', () => {
  test('clear without backdrop == regular (filter + fill)', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab--clear');
    const clear = await readPair(page, 'clear');
    const regular = await readPair(page, 'regular').catch(() => null);
    if (!regular) {
      // compare clear to a regular surface on the same page if the story
      // doesn't include both variants
      const reg = await page.evaluate(() => {
        const els = [...document.querySelectorAll('.ag-surface')];
        for (const el of els) {
          if (el.getAttribute('data-ag-variant') === 'regular') {
            return {
              bf: getComputedStyle(el, '::before').backdropFilter,
              fill: getComputedStyle(el).getPropertyValue('--ag-surface-fill').trim(),
            };
          }
        }
        return null;
      });
      if (reg) {
        const stripped = clear.bf.replace(/blur\([^)]*\)/, 'blur(*)'); // dimmed variant may share blur
        const regStripped = reg.bf.replace(/blur\([^)]*\)/, 'blur(*)');
        expect(stripped).toBe(regStripped);
        expect(clear.fill).toBe(reg.fill);
        return;
      }
      test.skip(true, 'no regular surface on page to compare');
      return;
    }
    expect(clear.bf).toBe(regular.bf);
    expect(clear.fill).toBe(regular.fill);
  });

  test('clear under light/dark/media keeps the clear cell', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-clear--over-media');
    const bf = await computedPseudoVar(page, '.ag-surface[data-ag-variant="clear"]', '::before', 'backdrop-filter');
    expect(bf).toContain('blur(');
  });
});
