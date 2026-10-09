/* REQ-PLAT-92 dx lane: tests/dx/*.spec.ts (codemod canary packed-tarball
 * pipeline, backdrop audits). Browser runs remain remote-only per machine
 * policy — this config only selects the dx test files and browsers; the dx
 * CI image provides packed tarballs via `npm run plat:package:pack` first. */
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testMatch: 'dx/**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['json', { outputFile: `${process.env.AURAGLASS_EVIDENCE_DIR ?? '.artifacts'}/playwright-dx/results.json` }]],
  use: { trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});
