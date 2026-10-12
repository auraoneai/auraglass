/* MAT-165 — WebKit literal: over a hf-pattern scene, pixel variance under a
   regular surface drops >= 40% vs the same region without surface — proves
   -webkit-backdrop-filter is actually applied (not just backdrop-filter).
   The material ships the same regular-surface backdrop in every engine
   (only the enhanced lens is engine-gated), so the drop is asserted in all
   three projects; the WebKit run is the one that exercises the prefixed
   literal. No skip (PRD §18). */
import { test, expect } from '@playwright/test';
import { bandVariance } from '../../../material/helpers/pixels';
import { gotoMaterialStory } from '../../../material/helpers/story';

test.describe('webkit literal', () => {
  test('variance under regular surface drops >= 40% over hf-pattern', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-examples--regular');
    const surf = page.locator('.ag-surface').first();
    const box = await surf.boundingBox();
    expect(box).toBeTruthy();
    if (!box) return;
    // screenshot the surface region, then an equal region with the surface hidden
    const clip = { x: box.x, y: box.y, width: box.width, height: box.height };
    const withSurf = await page.screenshot({ clip });
    await surf.evaluate((el) => ((el as HTMLElement).style.visibility = 'hidden'));
    const withoutSurf = await page.screenshot({ clip });
    const vUnder = bandVariance(withSurf);
    const vBare = bandVariance(withoutSurf);
    expect(vUnder).toBeLessThanOrEqual(vBare * 0.6);
  });
});
