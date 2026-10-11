/* MAT-307 (REQ-A11Y-28): focus-not-obscured — on A11y/ScrollPadding at 1440 and
   390 widths, Tab through >=50 focusables; for each, the fraction of the
   focused element covered by sticky chrome must be < 1.0 and the median
   coverage = 0. REQ-MAT-65: the fixture is resolved through listSubjects()
   and must be MAT-owned. */
import { test, expect } from '@playwright/test';
import { listSubjects } from '../../helpers';
import { matFixture } from './helpers/subjects';

const STORY = 'a11y-scrollpadding--default';

async function coverageProbe(page: import('@playwright/test').Page): Promise<{ each: number[]; median: number }> {
  const coverages: number[] = [];
  for (let i = 0; i < 50; i += 1) {
    await page.keyboard.press('Tab');
    const c = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return 0;
      const r = el.getBoundingClientRect();
      const chrome = [...document.querySelectorAll<HTMLElement>('[data-ag-part="top-bar"],[data-ag-part="tab-bar"]')];
      let covered = 0;
      for (const ch of chrome) {
        const cr = ch.getBoundingClientRect();
        const w = Math.max(0, Math.min(r.right, cr.right) - Math.max(r.left, cr.left));
        const h = Math.max(0, Math.min(r.bottom, cr.bottom) - Math.max(r.top, cr.top));
        covered += w * h;
      }
      return r.width * r.height > 0 ? Math.min(1, covered / (r.width * r.height)) : 0;
    });
    coverages.push(c);
    // page-level assertion for each focused element
    expect(c, `focus target ${i} not fully covered by chrome`).toBeLessThan(1.0);
  }
  const sorted = [...coverages].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)]!;
  return { each: coverages, median };
}

test.describe('focus-not-obscured', () => {
  for (const width of [1440, 390]) {
    test(`sticky chrome never covers the focused element at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      const fixture = await matFixture(listSubjects, STORY);
      await page.goto(`/iframe.html?id=${fixture.id}&viewMode=story`);
      await page.waitForSelector('[data-ag-scroll-container]');
      await page.click('[data-ag-scroll-container]');
      const { median } = await coverageProbe(page);
      expect(median, 'median chrome coverage = 0').toBe(0);
    });
  }
});
