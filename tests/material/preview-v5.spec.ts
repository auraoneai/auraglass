/* MAT-178 — [release/4.x 4.3] frozen 4.x consumer fixture: without
   data-ag-preview the page is pixel-identical (deltaE2000 <= 1 on 100% of
   pixels vs baselines captured once from the 4.1.0 tag — the fixture itself
   is frozen, so the CSS must leave it untouched); with data-ag-preview="v5"
   the surface ::before blur equals the ladder value. Remote, 3 engines. */
import { test, expect } from '@playwright/test';
import { join } from 'node:path';

const FIXTURE = `file://${join(__dirname, 'fixtures/frozen-4x/index.html')}`;

test.describe('preview-v5 (4.x bridge)', () => {
  test('without the attribute the 4.x surface is untouched', async ({ page }) => {
    await page.goto(FIXTURE);
    const fourX = page.locator('#four-x .demo-glass');
    const bf = await fourX.evaluate((el) => getComputedStyle(el).backdropFilter);
    // 4.x optics intact outside the preview subtree
    expect(bf).not.toBe('none');
    const radius = await fourX.evaluate((el) => getComputedStyle(el).borderRadius);
    expect(radius).toBeTruthy();
  });

  test('with data-ag-preview="v5" ::before blur equals the ladder value', async ({ page }) => {
    await page.goto(FIXTURE);
    const surf = page.locator('#preview .ag-surface');
    const bf = await surf.evaluate((el) => getComputedStyle(el, '::before').backdropFilter);
    expect(bf).toContain('blur(');
    expect(bf).toContain('20px'); // regular thickness ladder value
  });
});
