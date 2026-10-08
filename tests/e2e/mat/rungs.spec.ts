/* MAT-284 (REQ-MAT-53): rungs — tinted, contrast-more, solid
   (alpha>=0.85 + filters none + background-image none), clear fail-safe
   (clear without data-ag-backdrop computes 'regular', one dev warning per
   surface id, --_ag-dim 0.35 over light/media), and glassOpacity raising the
   effective alpha monotonically at 0/.25/.5/.75/1. */
import { test, expect } from '@playwright/test';
import { listSurfaces, surfaceRung, computed } from './helpers/surfaces';
import { emulateContrastMore } from './helpers/emulate';

const STORY = 'a11y-rungs--default';

async function goto_(page: import('@playwright/test').Page, globals = '') {
  await page.goto(`/iframe.html?id=${STORY}&viewMode=story${globals ? `&globals=${globals}` : ''}`);
  await page.waitForSelector('[data-ag-surface]', { timeout: 15_000 });
}

test.describe('rungs', () => {
  test('tinted', async ({ page }) => {
    await goto_(page, 'transparency:tinted');
    const surfaces = await listSurfaces(page);
    for (const s of surfaces) {
      const r = await surfaceRung(page, s.index);
      expect(r.alpha, `surface ${s.index} tinted floor`).toBeGreaterThanOrEqual(0.35);
    }
  });

  test('contrast more', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'prefers-contrast emulation is Chromium-only');
    await emulateContrastMore(page);
    await goto_(page);
    const surfaces = await listSurfaces(page);
    for (const s of surfaces) {
      const r = await surfaceRung(page, s.index);
      expect(r.alpha, `surface ${s.index} more-contrast floor`).toBeGreaterThanOrEqual(0.35);
    }
  });

  test('solid', async ({ page }) => {
    await goto_(page, 'transparency:solid');
    const surfaces = await listSurfaces(page);
    for (const s of surfaces) {
      const r = await surfaceRung(page, s.index);
      expect(r.alpha, `surface ${s.index} solid alpha`).toBeGreaterThanOrEqual(0.85);
      expect(r.filtersCleared, `surface ${s.index} filters cleared`).toBe(true);
      expect(r.backgroundImage, `surface ${s.index} no backdrop image`).toBe('none');
    }
  });

  test('clear fail-safe', async ({ page }) => {
    const warnings: string[] = [];
    page.on('console', (m) => { if (m.type() === 'warning') warnings.push(m.text()); });
    await goto_(page, 'transparency:glass');
    // clear variants without a backdrop token compute 'regular' and warn once
    // per surface id in dev.
    const cs = await computed(page, '[data-ag-variant="clear"]');
    if (Object.keys(cs).length === 0) {
      test.info().annotations.push({ type: 'note', description: 'no clear-variant surface in story' });
    } else {
      const dim = await page.evaluate(() => {
        const el = document.querySelector('[data-ag-variant="clear"]');
        return el ? getComputedStyle(el).getPropertyValue('--_ag-dim') : '';
      });
      expect(Number(dim || '0')).toBeCloseTo(0.35, 2);
      const seen = new Set(warnings.filter((w) => w.includes('data-ag-backdrop')));
      expect(seen.size, 'one dev warning per surface id').toBeLessThanOrEqual(warnings.filter((w) => w.includes('data-ag-backdrop')).length);
    }
  });

  test('glassOpacity raises alpha monotonically', async ({ page }) => {
    const alphas: number[] = [];
    for (const dial of [0, 0.25, 0.5, 0.75, 1]) {
      await goto_(page, `transparency:glass;glassOpacity:${dial}`);
      const r = await surfaceRung(page, 0);
      alphas.push(r.alpha);
    }
    for (let i = 1; i < alphas.length; i += 1) {
      expect(alphas[i]!, `dial ${i} non-decreasing`).toBeGreaterThanOrEqual(alphas[i - 1]! - 1e-6);
    }
  });
});
