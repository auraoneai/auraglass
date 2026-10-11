/* REQ-PLAT-92 dx lane: tests/dx/*.spec.ts (codemod canary, backdrop audits)
 * across chromium/webkit/firefox. Browser runs are remote-only (PRD-F §12
 * rule 6, machine policy §1): outside CI this config exits 2 and prints the
 * remote command instead of starting browsers. The GitLab job runs
 * `npm run plat:package:pack` first so the canary has the packed tarballs. */
import { defineConfig, devices } from '@playwright/test';

export const DX_REMOTE_COMMAND = 'GitLab CI job plat:test:cli (project 87152036): npm run plat:package:pack && npx playwright test -c playwright.dx.config.ts';

if (!process.env.CI) {
  console.error(`playwright.dx.config.ts is remote-only (REQ-PLAT-92). Run it in ${DX_REMOTE_COMMAND}`);
  process.exit(2);
}

export default defineConfig({
  testDir: './tests',
  testMatch: 'dx/**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: true,
  retries: 2,
  reporter: [['list'], ['json', { outputFile: `${process.env.AURAGLASS_EVIDENCE_DIR ?? '.artifacts'}/playwright-dx/results.json` }]],
  use: { trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});
