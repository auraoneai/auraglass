/* MAT-169 — material a11y coverage: under forced-colors / contrast-more /
   reduced-transparency, 100% of live ::before filters belong to data-ag
   surfaces, 0 live filters under forced colors; media + ScrollEdge hidden;
   no material element focusable. */
import { test, expect } from '@playwright/test';
import { readDensity } from '../../../material/helpers/density';
import { gotoMaterialStory } from '../../../material/helpers/story';

test.describe('material a11y coverage', () => {
  test('every live ::before filter belongs to an .ag-surface', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-examples--overview');
    const stray = await page.evaluate(() => {
      let n = 0;
      for (const el of document.querySelectorAll('*')) {
        const bf = getComputedStyle(el, '::before').backdropFilter;
        if (bf && bf !== 'none' && !el.classList.contains('ag-surface')) n += 1;
      }
      return n;
    });
    expect(stray).toBe(0);
  });

  test('forced-colors: 0 live filters', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await gotoMaterialStory(page, 'material-lab-examples--overview');
    const d = await readDensity(page);
    expect(d.liveBackdropFilters).toBe(0);
  });

  test('reduced-transparency: surfaces render on the tinted rung', async ({ page }) => {
    // REQ-MAT-05/-54, AC-MAT-14: reduced transparency is an OS floor of
    // `tinted` (osFloor 1): the resolved rung is tinted, the tint floor is at
    // least the surface's own tinted row (generated/floors.css), and the
    // tinted rung keeps the blur (it is not the solid rung).
    const read = () => page.locator('.ag-surface').first().evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        floor: parseFloat(s.getPropertyValue('--_ag-tint-floor')),
        tintedRow: parseFloat(s.getPropertyValue('--_ag-tint-floor-tinted')),
        bf: getComputedStyle(el, '::before').backdropFilter,
      };
    });
    await gotoMaterialStory(page, 'material-lab-examples--overview');
    const glass = await read();
    // no playwright emulate flag; stub matchMedia before the page loads
    await page.addInitScript(() => {
      const orig = window.matchMedia.bind(window);
      window.matchMedia = (q: string) =>
        q.includes('prefers-reduced-transparency')
          ? ({ matches: true, media: q, addListener() {}, removeListener() {},
               addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false,
               onchange: null } as MediaQueryList)
          : orig(q);
    });
    await gotoMaterialStory(page, 'material-lab-examples--overview');
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-ag-transparency')))
      .toBe('tinted');
    const tinted = await read();
    expect(tinted.tintedRow).toBeGreaterThanOrEqual(0.55);
    expect(tinted.floor).toBeGreaterThanOrEqual(tinted.tintedRow);
    expect(tinted.floor).toBeGreaterThanOrEqual(glass.floor);
    expect(tinted.bf).toContain('blur(');
  });

  test('media + scroll-edge are aria-hidden; no material element focusable', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-shape-concentricity--scroll-edge-soft-hard');
    const bad = await page.evaluate(() => {
      const focusable = document.querySelectorAll(
        '.ag-surface [tabindex]:not([tabindex="-1"]), .ag-surface[tabindex]:not([tabindex="-1"])');
      const edgeHidden = document.querySelector('[data-ag-part="scroll-edge"]')
        ?.getAttribute('aria-hidden');
      return { focusable: focusable.length, edgeHidden };
    });
    expect(bad.focusable).toBe(0);
    expect(bad.edgeHidden).toBe('true');
  });
});
