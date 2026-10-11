import { defineConfig } from '@playwright/test';

/* REQ-PLAT-77: the webServer packs the repo (from the existing dist/), installs
   this canary from that tarball, builds it, then serves the build with
   `vite preview`. Playwright itself resolves from the repo root. */
const PORT = 4173;

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [['list'], ['junit', { outputFile: 'test-results/junit.xml' }]] : 'list',
  use: { baseURL: process.env.AG_CANARY_BASE || `http://localhost:${PORT}` },
  webServer: process.env.AG_CANARY_BASE
    ? undefined
    : {
        command: `node ../../scripts/ci/canary-prepare.mjs . && ./node_modules/.bin/vite preview --port ${PORT} --strictPort`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 600_000,
        stdout: 'pipe',
        stderr: 'pipe',
      },
});
