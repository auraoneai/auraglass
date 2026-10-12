/* playwright.dx-e2e.config.ts — REQ-PLAT-94 shadcn interop runner.
   globalSetup packs aura-glass + @auraglass/cli + @auraglass/registry; the
   spec scaffolds a shadcn Base UI app, adds the published items with the
   shadcn CLI and checks next build + the shared --primary. One browser: the
   capture battery (Chromium + WebKit) is tests/dx/registry-render.spec.ts
   under tests/dx/registry.playwright.config.ts (REQ-PLAT-97). */
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/dx',
  testMatch: ['registry-shadcn-interop.spec.ts'],
  globalSetup: './tests/dx/e2e-setup.mjs',
  fullyParallel: false,
  retries: 0,
  timeout: 45 * 60_000,
  reporter: [['list'], ['json', { outputFile: '.artifacts/e2e/results.json' }]],
  use: { trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
