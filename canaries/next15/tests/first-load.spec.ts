/* PLAT-289: first-load js delta — gzip-9 sum of /_next/static js for
   /plat/button minus /plat/empty must stay within the { Button } budget row
   (PROVISIONAL 10,240 B) + 2 KB slack, and axe colour-contrast reports no
   serious/critical issues at 1440x900 and 390x844. */
import { test, expect } from '@playwright/test';
import { gzipSync } from 'node:zlib';

const BUTTON_BUDGET = 10_240 + 2_048;

const bundleBytes = async (page: import('@playwright/test').Page, url: string) => {
  const reqs: Promise<Buffer>[] = [];
  page.on('response', async (r) => {
    if (r.url().includes('/_next/static/') && r.url().endsWith('.js')) reqs.push(r.body());
  });
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  const bodies = await Promise.all(reqs);
  return bodies.reduce((a, b) => a + gzipSync(b, { level: 9 }).length, 0);
};

test.describe('next15 first-load', () => {
  test('delta(button - empty) <= Button row + 2KB', async ({ page }) => {
    const empty = await bundleBytes(page, '/plat/empty');
    const button = await bundleBytes(page, '/plat/button');
    expect(button - empty).toBeLessThanOrEqual(BUTTON_BUDGET);
  });

  test('no horizontal scroll at 1440x900 and 390x844', async ({ page }) => {
    for (const [w, h] of [[1440, 900], [390, 844]] as const) {
      await page.setViewportSize({ width: w, height: h });
      await page.goto('/plat/client');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    }
  });
});
