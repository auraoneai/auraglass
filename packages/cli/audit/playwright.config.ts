/**
 * Playwright config for the `audit backdrop` reference endpoint (REQ-PLAT-89).
 * Used only by the manual GitLab job `plat:audit:backdrop` (Playwright image):
 *
 *   npx playwright test -c packages/cli/audit/playwright.config.ts
 *
 * It starts packages/cli/audit/reference-server.mjs as the endpoint and runs
 * tests/dx/audit-backdrop.remote.spec.ts. Never certification/**.
 */
import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..', '..');
const PORT = Number(process.env.AG_AUDIT_PORT ?? 4791);

export default defineConfig({
  testDir: path.join(ROOT, 'tests', 'dx'),
  testMatch: ['audit-backdrop.remote.spec.ts'],
  outputDir: path.join(ROOT, '.artifacts', 'plat', 'audit-backdrop', 'test-results'),
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: true,
  timeout: 180_000,
  reporter: [['list'], ['junit', { outputFile: path.join(ROOT, '.artifacts', 'plat', 'audit-backdrop', 'junit.xml') }]],
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `node ${JSON.stringify(path.join(HERE, 'reference-server.mjs'))} --port ${PORT} --host 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}/healthz`,
    reuseExistingServer: false,
    timeout: 60_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
