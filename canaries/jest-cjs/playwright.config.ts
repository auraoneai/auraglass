import { defineConfig } from '@playwright/test';

/* PLAT-293: node-only canary leg. globalSetup installs the canary from the
   packed artifact (canaries/_shared/consumer-install.mjs); the spec then runs
   the consumer's own toolchain and asserts it exits 0. */
export default defineConfig({
  testDir: './tests',
  forbidOnly: true,
  retries: 0,
  reporter: [['list']],
  timeout: 300_000,
  globalSetup: './tests/global-setup.mjs',
});
