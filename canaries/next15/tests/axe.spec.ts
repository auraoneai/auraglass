/* PLAT-77 item 4 — @axe-core/playwright colour-contrast scans, 0 serious or
   critical violations, at desktop (1440x900) and mobile (390x844). */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGE = process.env.AG_AXE_PAGE || '/plat/button';

for (const [w, h] of [[1440, 900], [390, 844]] as const) {
  test(`colour-contrast ${w}x${h}: 0 serious/critical`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto(PAGE);
    await page.waitForLoadState('networkidle');
    const { violations } = await new AxeBuilder({ page })
      .withTags(['color-contrast'])
      .analyze();
    const bad = violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''));
    expect(bad).toEqual([]);
  });
}
