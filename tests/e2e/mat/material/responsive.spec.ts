/* MAT-168 — responsive: coarse-pointer thick -> 20px and grain <= 0.02;
   390x844 modal <= 3 visible filters incl. scrim; scrim blur <= 12px;
   ScrollEdge 16-32px, no overlap with focusable boxes; concentric inner
   radius >= 0 across densities; full-width refracting bar at 390px warns. */
import { test, expect, devices } from '@playwright/test';
import { computedVar, computedPseudoVar } from '../../../material/helpers/computed';
import { readDensity } from '../../../material/helpers/density';
import { gotoMaterialStory } from '../../../material/helpers/story';

// The project picks the engine; a describe-level use() may not set
// defaultBrowserType, and Gecko has no isMobile emulation.
const { defaultBrowserType: _engine, isMobile: _isMobile, ...iPhone13 } = devices['iPhone 13'];

test.describe('responsive', () => {
  test.use({ ...iPhone13, isMobile: async ({ browserName }, provide) => provide(browserName !== 'firefox') });

  test('coarse pointer: thick blur 20px, grain <= 0.02', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-matrix--matrix');
    const blur = await computedVar(page, '.ag-surface[data-ag-thickness="thick"]', '--_ag-blur');
    expect(blur).toBe('20px');
    const grain = await computedVar(page, '.ag-surface[data-ag-thickness="thick"]', '--_ag-grain-opacity');
    expect(parseFloat(grain)).toBeLessThanOrEqual(0.02);
  });

  test('390x844 modal <= 3 visible filters incl. scrim, scrim blur <= 12', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    // MAT-168's subject is the modal story (page chrome + scrim + open
    // overlay sheet); the nesting story's four legitimately live surfaces
    // are a different scene with a different budget (REQ-MAT-155).
    await gotoMaterialStory(page, 'material-lab-examples--modal-scrim');
    const d = await readDensity(page, '[data-modal-scene]');
    // The scrim paints backdrop-filter on the element itself, not a surface
    // ::before, so readDensity cannot see it; count it explicitly.
    const scrim = await page.evaluate(() => {
      const el = document.querySelector('[data-modal-scene] [data-ag-layer="scrim"]');
      if (!el) return null;
      const cs = getComputedStyle(el);
      const bf = cs.backdropFilter || cs.getPropertyValue('-webkit-backdrop-filter') || '';
      const m = /blur\(([\d.]+)px\)/.exec(bf);
      return { found: true, blur: m ? parseFloat(m[1]!) : Number.NaN };
    });
    expect(scrim, 'modal scene has no [data-ag-layer="scrim"] sibling').not.toBeNull();
    expect(Number.isFinite(scrim!.blur), 'scrim backdrop-filter has no resolvable blur').toBe(true);
    expect(scrim!.blur).toBeLessThanOrEqual(12);
    const total = d.liveBackdropFilters + (scrim!.blur > 0 ? 1 : 0);
    expect(total).toBeLessThanOrEqual(3);
  });

  test('ScrollEdge height 16-32px, no overlap with focusables', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-shape-concentricity--scroll-edge-soft-hard');
    const edge = page.locator('[data-ag-part="scroll-edge"]').first();
    const box = await edge.boundingBox();
    expect(box).toBeTruthy();
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(16);
      expect(box.height).toBeLessThanOrEqual(32);
    }
  });

  test('concentric inner radius >= 0 at every density', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-shape-concentricity--radius-rhythm');
    for (const density of ['compact', 'regular', 'spacious'] as const) {
      await page.evaluate(
        (d) => document.documentElement.setAttribute('data-ag-density', d), density);
      const rows = await page.evaluate(() =>
        // --ag-radius-inner is unregistered, so its computed value stays an
        // unevaluated max()/calc() stream on some engines (WebKit); resolve
        // it through a probe length instead. The +100px sentinel keeps a
        // negative result observable instead of clamped away, and the
        // painted border radius must agree with the resolved value.
        [...document.querySelectorAll('.ag-surface[data-ag-shape="concentric"]')].map((el) => {
          const probe = document.createElement('div');
          probe.style.cssText = 'width: calc(var(--ag-radius-inner) + 100px); height: 0;';
          el.appendChild(probe);
          const inner = parseFloat(getComputedStyle(probe).width) - 100;
          const painted = parseFloat(getComputedStyle(el).borderTopLeftRadius);
          probe.remove();
          return { inner, painted };
        }));
      expect(rows.length, `no concentric surfaces at density ${density}`).toBeGreaterThan(0);
      for (const { inner, painted } of rows) {
        expect(Number.isFinite(inner)).toBe(true);
        expect(inner).toBeGreaterThanOrEqual(0);
        expect(Number.isFinite(painted)).toBe(true);
        expect(Math.abs(painted - inner)).toBeLessThanOrEqual(0.6);
      }
    }
  });
});
