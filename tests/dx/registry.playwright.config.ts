/* tests/dx/registry.playwright.config.ts — REQ-PLAT-97 (plat:test:registry).
   Runs the render gate tests/dx/registry-render.spec.ts in Chromium and WebKit
   (axe in both; the 4× CPU long-task check needs CDP, so it runs in Chromium).
   The root playwright.config.ts only matches stream kind directories, not
   tests/dx, so the job passes `-c` with this file. retries: 0 — a capture that
   only passes on a retry is not certified (the pass flag is the conjunction of
   every assertion of the one run). Browser runs are remote-only (machine
   policy): outside CI this config exits 2 instead of launching browsers. */
import { defineConfig, devices } from '@playwright/test';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
if (!process.env.CI) {
  console.error('the registry render gate is remote-only; it runs in GitLab CI job plat:test:registry (npx playwright test -c tests/dx/registry.playwright.config.ts)');
  process.exit(2);
}
const EVIDENCE = process.env.AURAGLASS_EVIDENCE_DIR ?? join(ROOT, '.artifacts');

export default defineConfig({
  testDir: '.',
  testMatch: ['registry-render.spec.ts'],
  forbidOnly: true,
  retries: 0,
  fullyParallel: true,
  timeout: 20 * 60 * 1000,
  reporter: [['list'], ['json', { outputFile: join(EVIDENCE, 'playwright', 'registry-render.json') }]],
  outputDir: join(EVIDENCE, 'playwright', 'registry-render'),
  use: { trace: 'retain-on-failure' },
  projects: [
    { name: 'registry-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'registry-webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
