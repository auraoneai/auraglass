import { defineConfig, devices } from '@playwright/test';

/* PLAT-293 / REQ-PLAT-72: the smoke spec runs against the production build
   (vite build with babel-plugin-react-compiler) served by vite preview. */
const PORT = 4183;

export default defineConfig({
  testDir: './tests',
  forbidOnly: true,
  retries: 0,
  reporter: [['list']],
  use: { baseURL: `http://127.0.0.1:${PORT}` },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run build && npx vite preview --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
