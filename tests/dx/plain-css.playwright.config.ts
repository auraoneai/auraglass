/* tests/dx/plain-css.playwright.config.ts — PLAT-381. Runs tests/dx/plain-css.spec.ts
   (the root playwright.config.ts only matches stream kind directories, not tests/dx).
   Browser runs are remote-only (machine policy): outside CI this config exits 2 and
   prints the remote command instead of launching browsers. */
import { defineConfig, devices } from '@playwright/test';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const REMOTE = 'GitLab CI job plat:test:docs: npx playwright test -c tests/dx/plain-css.playwright.config.ts (needs plat:build:dist)';
if (!process.env.CI) {
  console.error(`plain-css spec is remote-only; run it in ${REMOTE}`);
  process.exit(2);
}

export default defineConfig({
  testDir: '.',
  testMatch: ['plain-css.spec.ts'],
  forbidOnly: true,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: join(process.env.AURAGLASS_EVIDENCE_DIR ?? join(ROOT, '.artifacts'), 'playwright', 'plain-css.json') }]],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});
