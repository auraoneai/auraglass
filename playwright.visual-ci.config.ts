import { defineConfig, devices } from "@playwright/test";

/**
 * Release visual CI guardrail.
 *
 * The legacy visual tree still contains exploratory snapshot specs tied to old
 * story ids. Release CI should verify the maintained Storybook certification
 * artifacts and audit coverage story without depending on those stale baselines.
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: [
    "visual/design-system/storybook-visual-certification.spec.ts",
    "visual/design-system/glass-audit-coverage.spec.ts",
    "visual/liquid-glass/liquid-glass-showcase.spec.ts",
  ],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "test-results/results.json" }],
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
  outputDir: "test-results/",
});
