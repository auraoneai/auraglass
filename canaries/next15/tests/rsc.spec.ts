/* PLAT-289: next15 canary assertions — every page 200, no hydration warnings,
   0 createContext/useState server errors, RSC payload carries no client
   reference for server-safe exports. Remote Chromium legs run on GitLab;
   these specs are self-contained against `next start`. */
import { test, expect } from '@playwright/test';

const PAGES = ['/plat/server', '/plat/server-helpers', '/plat/client', '/plat/button', '/plat/empty'];

test.describe('next15 rsc', () => {
  for (const p of PAGES) {
    test(`${p} renders with 0 hydration warnings`, async ({ page }) => {
      const warnings: string[] = [];
      page.on('console', (m) => {
        const t = m.text();
        if (/hydrat|Hydration|did not match|createContext|useState.*server/i.test(t)) warnings.push(t);
      });
      const res = await page.goto(p);
      expect(res?.status()).toBe(200);
      await page.waitForLoadState('networkidle');
      expect(warnings).toEqual([]);
    });
  }

  test('rsc payload has no client reference for server-safe exports', async ({ request }) => {
    const res = await request.get('/plat/server', { headers: { Accept: 'text/x-component' } });
    const body = await res.text();
    /* a client reference shows up as `"$L<hex>"` rows pointing at .client modules —
       server-safe exports must not produce one. */
    expect(body).not.toMatch(/ChartFrameInteractive|\.client/);
  });
});
