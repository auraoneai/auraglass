/* MAT-169 — material a11y coverage: under forced-colors / contrast-more /
   reduced-transparency, 100% of live ::before filters belong to data-ag
   surfaces, 0 live filters under forced colors; media + ScrollEdge hidden;
   no material element focusable. */
import { test, expect } from '@playwright/test';
import { readDensity } from '../../../material/helpers/density';
import { gotoMaterialStory } from '../../../material/helpers/story';

test.describe('material a11y coverage', () => {
  test('every live ::before filter belongs to an .ag-surface', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab--overview');
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
    await gotoMaterialStory(page, 'material-lab--overview');
    const d = await readDensity(page);
    expect(d.liveBackdropFilters).toBe(0);
  });

  test('reduced-transparency: surfaces render on the opaque rung', async ({ page }) => {
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
    await gotoMaterialStory(page, 'material-lab--overview');
    const bf = await page.locator('.ag-surface').first()
      .evaluate((el) => getComputedStyle(el, '::before').backdropFilter);
    expect(bf).toBe('none');
  });

  test('media + scroll-edge are aria-hidden; no material element focusable', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-shape--scroll-edge-soft-hard');
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
