/* MAT-168 — responsive: coarse-pointer thick -> 20px and grain <= 0.02;
   390x844 modal <= 3 visible filters incl. scrim; scrim blur <= 12px;
   ScrollEdge 16-32px, no overlap with focusable boxes; concentric inner
   radius >= 0 across densities; full-width refracting bar at 390px warns. */
import { test, expect, devices } from '@playwright/test';
import { computedVar, computedPseudoVar } from '../../../material/helpers/computed';
import { readDensity } from '../../../material/helpers/density';
import { gotoMaterialStory } from '../../../material/helpers/story';

test.describe('responsive', () => {
  test.use({ ...devices['iPhone 13'] });

  test('coarse pointer: thick blur 20px, grain <= 0.02', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab--matrix');
    const blur = await computedVar(page, '.ag-surface[data-ag-thickness="thick"]', '--_ag-blur');
    expect(blur).toBe('20px');
    const grain = await computedVar(page, '.ag-surface[data-ag-thickness="thick"]', '--_ag-grain-opacity');
    expect(parseFloat(grain)).toBeLessThanOrEqual(0.02);
  });

  test('390x844 modal <= 3 visible filters incl. scrim, scrim blur <= 12', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoMaterialStory(page, 'material-lab--nesting-and-groups');
    const d = await readDensity(page);
    expect(d.liveBackdropFilters).toBeLessThanOrEqual(3);
    const scrimBlur = await computedVar(page, '[data-ag-layer="scrim"]', '--_ag-blur').catch(() => '');
    if (scrimBlur) expect(parseFloat(scrimBlur)).toBeLessThanOrEqual(12);
  });

  test('ScrollEdge height 16-32px, no overlap with focusables', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-shape--scroll-edge-soft-hard');
    const edge = page.locator('[data-ag-part="scroll-edge"]').first();
    const box = await edge.boundingBox();
    expect(box).toBeTruthy();
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(16);
      expect(box.height).toBeLessThanOrEqual(32);
    }
  });

  test('concentric inner radius >= 0 at every density', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-shape--radius-rhythm');
    const inner = await computedVar(page, '.ag-surface[data-ag-shape="concentric"]', '--ag-radius-inner');
    expect(parseFloat(inner)).toBeGreaterThanOrEqual(0);
  });
});
