// REQ-SURF-08 — browser hydration of the built Next 16 canary (L11, remote).
// The lane starts `next start` for canaries/next16 with TZ=Pacific/Kiritimati
// (UTC+14) and exports its origin as AG_CANARY_BASE_URL; the browser context
// here runs at Pacific/Pago_Pago (UTC−11). Every SURF canary page must load
// with 0 hydration warnings/errors, and the app-shell page restored from a
// persisted `ag-shell-canary=sidebar:rail` cookie must paint and stay 'rail'.
// Fail-closed: without AG_CANARY_BASE_URL the spec errors instead of skipping.
import { test, expect, type Page } from '@playwright/test';

const BASE = process.env.AG_CANARY_BASE_URL;
const SURF_PAGES = ['/surf/app-shell', '/surf/data-server', '/surf/ai-rsc', '/surf/ai-client'] as const;
const HYDRATION_RE = /hydrat|did not match|server rendered (html|text)|Minified React error #(418|423|425)/i;

test.use({ timezoneId: 'Pacific/Pago_Pago', locale: 'en-US' });

function requireBase(): string {
  if (!BASE) {
    throw new Error('AG_CANARY_BASE_URL is not set: run this spec through the L11 canary lane (remote), which serves canaries/next16 at TZ=Pacific/Kiritimati.');
  }
  return BASE.replace(/\/$/, '');
}

function collectHydrationErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if ((msg.type() === 'error' || msg.type() === 'warning') && HYDRATION_RE.test(msg.text())) errors.push(msg.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
}

test.describe('SURF canary cross-TZ hydration (REQ-SURF-08)', () => {
  for (const path of SURF_PAGES) {
    test(`${path} hydrates with 0 hydration warnings`, async ({ page }) => {
      const base = requireBase();
      const errors = collectHydrationErrors(page);
      const res = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
      expect(res?.status()).toBe(200);
      expect({ path, errors }).toEqual({ path, errors: [] });
    });
  }

  test('/surf/app-shell restored from a persisted sidebar:rail cookie paints and stays rail', async ({ page, context }) => {
    const base = requireBase();
    await context.addCookies([{ name: 'ag-shell-canary', value: 'sidebar:rail', url: base }]);
    const errors = collectHydrationErrors(page);
    const res = await page.goto(`${base}/surf/app-shell`, { waitUntil: 'networkidle' });
    // First paint (server HTML) already carries the persisted state.
    expect(await res?.text()).toMatch(/data-ag-sidebar="rail"/);
    // After hydration the client store agrees with it.
    await expect(page.locator('.ag-app-shell[data-ag-part="root"]')).toHaveAttribute('data-ag-sidebar', 'rail');
    expect(errors).toEqual([]);
  });
});
