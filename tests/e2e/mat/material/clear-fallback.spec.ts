/* MAT-161 — clear fallback: without a declared backdrop (or under nearest
   'auto'), clear computes identical ::before filter and host fill to regular;
   under light/dark/media it keeps its own cell. */
import { test, expect } from '@playwright/test';
import { computedPseudoVar } from '../../../material/helpers/computed';
import { gotoMaterialStory } from '../../../material/helpers/story';

test.describe('clear fallback', () => {
  test('clear without backdrop == regular (filter + fill)', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-examples--clear');
    // The subjects are the story's final no-backdrop pair. Select by
    // ancestry (no [data-ag-backdrop] ancestor), never document order:
    // the first clear in the story sits over a light backdrop (dimmed,
    // a different ladder cell) and the first regular belongs to the
    // frame chrome, so order-based selection compared two wrong cells.
    const pair = await page.evaluate(() => {
      const pick = (variant: string) => {
        const el = [...document.querySelectorAll(`.ag-surface[data-ag-variant="${variant}"]`)]
          .find((e) => !e.closest('[data-ag-backdrop]'));
        if (!el) return null;
        return {
          bf: getComputedStyle(el, '::before').backdropFilter,
          fill: getComputedStyle(el).getPropertyValue('--ag-surface-fill').trim(),
        };
      };
      return { clear: pick('clear'), regular: pick('regular') };
    });
    // The comparison subjects are required: a story missing either fails, never skips (PRD §18).
    expect(pair.clear, 'no clear-without-backdrop surface in material-lab-examples--clear').not.toBeNull();
    expect(pair.regular, 'no regular-without-backdrop comparison surface').not.toBeNull();
    if (!pair.clear || !pair.regular) return;
    expect(pair.clear.bf).toBe(pair.regular.bf);
    expect(pair.clear.fill).toBe(pair.regular.fill);
  });

  test('clear under light/dark/media keeps the clear cell', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-clear--over-media');
    const bf = await computedPseudoVar(page, '.ag-surface[data-ag-variant="clear"]', '::before', 'backdrop-filter');
    expect(bf).toContain('blur(');
  });
});
