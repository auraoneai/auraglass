import { defineConfig, devices } from '@playwright/test';

/* PLAT-293 / REQ-PLAT-72: the smoke spec runs against the production build
   (vite build with babel-plugin-react-compiler) served by vite preview. The
   canary is first installed from the packed artifact with its own pinned
   toolchain (canaries/_shared/consumer-install.mjs); @playwright/test stays
   the repo's single copy so the runner and the spec share one instance. */
const PORT = 4183;

export default defineConfig({
  testDir: './tests',
  forbidOnly: true,
  retries: 0,
  reporter: [['list']],
  use: { baseURL: `http://127.0.0.1:${PORT}` },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `node ../_shared/consumer-install.mjs . && npm run build && npx vite preview --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: false,
    timeout: 600_000,
  },
});
