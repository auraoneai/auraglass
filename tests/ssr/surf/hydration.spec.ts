// REQ-SURF-08 — e2e hydration spec: loads the SURF canary pages in a real
// browser and fails on any React hydration warning. Runs in the L11 lane
// against the built canaries (remote runner).
import { test, expect } from '@playwright/test';

const BASE = process.env.AG_CANARY_BASE_URL ?? 'http://localhost:3116';
const PAGES = ['/surf/breadcrumbs-server'];

test.describe('SURF canary hydration (REQ-SURF-08)', () => {
  test.skip(!process.env.AG_REMOTE_RUNNER, 'remote lane only — needs the built next16 canary');
  for (const path of PAGES) {
    test(`${path} hydrates with 0 warnings`, async ({ page }) => {
      const hydrationErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error' && /hydrat|mismatch|Minified React error #4/i.test(msg.text())) hydrationErrors.push(msg.text());
      });
      page.on('pageerror', (e) => hydrationErrors.push(String(e)));
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      expect({ path, errors: hydrationErrors }).toEqual({ path, errors: [] });
    });
  }
});
