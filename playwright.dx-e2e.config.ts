/* playwright.dx-e2e.config.ts — REQ-PLAT-97 registry DX e2e runner.
   globalSetup packs aura-glass + @auraglass/cli + @auraglass/registry;
   spec scaffolds real consumers, production-builds, serves and runs the
   capture battery. Chromium + WebKit only (axe battery + longtask CDP). */
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/dx',
  testMatch: ['registry-shadcn-interop.spec.ts'],
  globalSetup: './tests/dx/e2e-setup.mjs',
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  timeout: 900_000,
  reporter: [['list'], ['json', { outputFile: '.artifacts/e2e/results.json' }]],
  use: { trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
