/* REQ-CMP-19: shared focus ring — every focusable part shows the
   --ag-focus-outer outline + --ag-focus-inner inner ring on :focus-visible,
   including focusable disabled elements. Remote lane only. */
import { test, expect } from '@playwright/test';
import { gotoStory, listSubjects } from '../../helpers/index';

test.skip(!process.env.AG_REMOTE_RUNNER, 'remote e2e lane only (AG_REMOTE_RUNNER=1)');

const FAMILIES = [
  'controls-button--default',
  'controls-checkbox--default',
  'controls-switch--default',
  'controls-slider--default',
  'controls-select--default',
  'controls-text-field--default',
  'content-link--default',
];

test.describe('cmp focus contract', () => {
  for (const storyId of FAMILIES) {
    test(`${storyId}: keyboard focus draws the outer + inner ring`, async ({ page }) => {
      await gotoStory(page, storyId);
      await page.keyboard.press('Tab');
      const rings = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        const target = cs.outlineStyle !== 'none' ? el : el.closest('[data-ag-part]');
        const t = target ? getComputedStyle(target) : cs;
        return { outlineStyle: t.outlineStyle, outlineWidth: t.outlineWidth, boxShadow: t.boxShadow, part: target?.getAttribute('data-ag-part') };
      });
      expect(rings, 'a [data-ag-part] element must hold keyboard focus').not.toBeNull();
      expect(rings!.outlineStyle, `${storyId} focus-visible outline`).not.toBe('none');
      expect(parseFloat(rings!.outlineWidth)).toBeGreaterThan(0);
      expect(rings!.boxShadow, 'inner --ag-focus-inner ring via box-shadow').not.toBe('none');
    });
  }

  test('focusable disabled element keeps the ring', async ({ page }) => {
    const subjects = await listSubjects();
    void subjects;
    await gotoStory(page, 'controls-button--default');
    await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('[data-ag-part]');
      el?.setAttribute('aria-disabled', 'true');
      el?.focus();
    });
    const ring = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const cs = getComputedStyle(el);
      return { outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth };
    });
    expect(ring.outlineStyle).not.toBe('none');
    expect(parseFloat(ring.outlineWidth)).toBeGreaterThan(0);
  });
});
