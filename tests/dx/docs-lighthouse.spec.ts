/* tests/dx/docs-lighthouse.spec.ts — REQ-PLAT-102 (REQ-FIN-43), PLAT-384/385, DX-115.
   Remote only (tests/dx/docs.playwright.config.ts, project `lighthouse`).
   Lighthouse (default mobile form factor, simulated throttling) on the home
   page, one component page (Button) and the 4→5 migration guide of the static
   export. Budgets are constants here and are never lowered:
     Performance >= 90, Accessibility = 100, Best practices >= 95,
     LCP <= 2.5 s, CLS <= 0.05, TBT <= 200 ms.
   The full LHR JSON per page is attached to the report as evidence. */
import { chromium, expect, test } from '@playwright/test';
import lighthouse from 'lighthouse';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, 'apps', 'docs', 'out');

export const PAGES = ['/', '/components/button', '/plat/migrate/5'] as const;
export const BUDGETS = {
  performance: 0.9,
  accessibility: 1,
  'best-practices': 0.95,
  lcpMs: 2500,
  cls: 0.05,
  tbtMs: 200,
} as const;

const exported = (route: string) => join(OUT, route === '/' ? 'index.html' : `${route.slice(1)}/index.html`);
const DEBUG_PORT = Number(process.env.AG_LIGHTHOUSE_PORT ?? 9333);

test.describe.configure({ mode: 'serial' });

for (const route of PAGES) {
  test(`lighthouse mobile ${route}`, async ({ baseURL }, info) => {
    expect(existsSync(exported(route)), `${route} must be part of the static export`).toBe(true);
    const browser = await chromium.launch({ args: [`--remote-debugging-port=${DEBUG_PORT}`] });
    try {
      const target = new URL(route === '/' ? './' : `.${route}/`, baseURL).href;
      const result = await lighthouse(target, {
        port: DEBUG_PORT,
        output: 'json',
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices'],
      });
      expect(result, 'lighthouse returned a result').toBeTruthy();
      const lhr = result!.lhr;
      await info.attach(`lhr${route.replace(/\//g, '_') || '_home'}.json`, { body: JSON.stringify(lhr, null, 2), contentType: 'application/json' });
      expect(lhr.runtimeError, 'lighthouse runtime error').toBeUndefined();
      expect(lhr.configSettings.formFactor).toBe('mobile');
      const score = (id: string) => lhr.categories[id]?.score ?? 0;
      const num = (id: string) => lhr.audits[id]?.numericValue ?? Number.POSITIVE_INFINITY;
      const measured = {
        performance: score('performance'),
        accessibility: score('accessibility'),
        'best-practices': score('best-practices'),
        lcpMs: num('largest-contentful-paint'),
        cls: num('cumulative-layout-shift'),
        tbtMs: num('total-blocking-time'),
      };
      info.annotations.push({ type: 'lighthouse', description: JSON.stringify(measured) });
      expect.soft(measured.performance, 'Performance').toBeGreaterThanOrEqual(BUDGETS.performance);
      expect.soft(measured.accessibility, 'Accessibility').toBe(BUDGETS.accessibility);
      expect.soft(measured['best-practices'], 'Best practices').toBeGreaterThanOrEqual(BUDGETS['best-practices']);
      expect.soft(measured.lcpMs, 'LCP ms').toBeLessThanOrEqual(BUDGETS.lcpMs);
      expect.soft(measured.cls, 'CLS').toBeLessThanOrEqual(BUDGETS.cls);
      expect.soft(measured.tbtMs, 'TBT ms').toBeLessThanOrEqual(BUDGETS.tbtMs);
    } finally {
      await browser.close();
    }
  });
}
