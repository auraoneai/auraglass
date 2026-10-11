/* PLAT-289: next16 canary — specs run against `next start` of the packed
   artifact, started by ../next-serve.mjs. */
import { defineConfig } from '@playwright/test';

const PORT = 3016;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests',
  reporter: 'list',
  use: { baseURL },
  webServer: {
    command: `node ../next-serve.mjs ${PORT}`,
    url: `${baseURL}/plat/empty`,
    timeout: 15 * 60_000,
    reuseExistingServer: false,
    stdout: 'pipe',
  },
});
