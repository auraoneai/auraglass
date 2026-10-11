// Playwright config for the MAT 4.x bridge pixel check (REQ-MAT-41 / REQ-FIN-57 item 6).
// Remote only: run by ci/mat.gitlab-ci.yml `mat:test:preview-v5` on $AG_PLAYWRIGHT_IMAGE,
// never on a developer machine. Three engines, one project each.
import { defineConfig, devices } from '@playwright/test';

if (!process.env.AG_REMOTE_RUNNER) {
  console.error('mat bridge pixel check runs remotely only: GitLab job mat:test:preview-v5 (AG_REMOTE_RUNNER=1).');
  process.exit(2);
}

export default defineConfig({
  testDir: '.',
  testMatch: ['preview-v5.pixel.pw.mjs'],
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: [['line'], ['json', { outputFile: process.env.AG_MAT_REPORT ?? '../../../.artifacts/mat/preview-v5/results.json' }]],
  use: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } },
    { name: 'webkit', use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } },
  ],
});
