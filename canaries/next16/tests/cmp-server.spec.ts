/* REQ-CMP-130 — next16 cmp canary: /cmp/server builds and renders every
   REQ-CMP-17 server-list component with 0 hydration warnings and no provider. */
import { test, expect } from '@playwright/test';

const PAGES = ['/cmp/server'];

test.describe('next16 cmp server', () => {
  for (const p of PAGES) {
    test(`${p} renders with 0 hydration warnings`, async ({ page }) => {
      const warnings: string[] = [];
      page.on('console', (m) => {
        const t = m.text();
        if (/hydrat|Hydration|did not match|createContext|useState.*server/i.test(t)) warnings.push(t);
      });
      page.on('pageerror', (e) => warnings.push(String(e)));
      const res = await page.goto(p);
      expect(res?.status()).toBe(200);
      await page.waitForLoadState('networkidle');
      expect(warnings).toEqual([]);
      // spot-check that server parts actually rendered
      await expect(page.locator('[data-ag-part="root"]').first()).toBeVisible();
    });
  }
});
