import { defineConfig, devices } from "@playwright/test";

/**
 * Cross-browser visual/audit matrix.
 *
 * This runs the maintained visual certification guardrails across engines and
 * Mobile Safari emulation. The release-blocking `test:visual:ci` script stays
 * Chromium-only for speed; this script is the broader compatibility evidence
 * gate for manual release-readiness review.
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: [
    "visual/design-system/storybook-visual-certification.spec.ts",
    "visual/design-system/glass-audit-coverage.spec.ts",
  ],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { outputFolder: "playwright-report-visual-matrix" }],
    ["json", { outputFile: "test-results/visual-matrix-results.json" }],
    process.env.CI ? ["github"] : ["list"],
  ],
  use: {
    baseURL: "http://localhost:6006",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 14"] },
    },
  ],
  webServer: {
    command: "npm run storybook",
    url: "http://localhost:6006",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  outputDir: "test-results/visual-matrix/",
});
