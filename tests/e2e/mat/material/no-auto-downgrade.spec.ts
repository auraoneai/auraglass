/* MAT-166 — no auto-downgrade: 20 mounted surfaces + scripted scroll; zero
   attribute mutations on <html> and surfaces; computed ::before filters
   identical before/after. */
import { test, expect } from '@playwright/test';
import { gotoMaterialStory } from '../../../material/helpers/story';

test.describe('no auto-downgrade', () => {
  test('scroll storm mutates nothing', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab--matrix');
    // mount 20 surfaces for the stress case
    await page.evaluate(() => {
      const host = document.querySelector('[data-ag-root]') ?? document.body;
      for (let i = 0; i < 20; i++) {
        const d = document.createElement('div');
        d.className = 'ag-surface';
        d.setAttribute('data-ag-layer', 'chrome');
        host.appendChild(d);
      }
    });
    const mutations: string[] = [];
    await page.evaluate(() => {
      const mo = new MutationObserver((rs) => {
        for (const r of rs) {
          if (r.type === 'attributes') {
            (window as unknown as { __mut: string[] }).__mut.push(
              `${(r.target as Element).tagName}.${r.attributeName}`);
          }
        }
      });
      (window as unknown as { __mut: string[] }).__mut = [];
      mo.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['data-ag-tier', 'data-ag-transparency', 'data-ag-engine', 'data-ag-backdrop'] });
      (window as unknown as { __mo: MutationObserver }).__mo = mo;
    });
    const before = await page.locator('.ag-surface').evaluateAll((els) =>
      els.map((el) => getComputedStyle(el, '::before').backdropFilter));
    for (let i = 0; i < 5; i++) {
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(200);
    }
    const after = await page.locator('.ag-surface').evaluateAll((els) =>
      els.map((el) => getComputedStyle(el, '::before').backdropFilter));
    const recorded = await page.evaluate(() =>
      (window as unknown as { __mut: string[] }).__mut ?? mutations);
    expect(recorded).toEqual([]);
    expect(after).toEqual(before);
  });
});
