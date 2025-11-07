import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for AuraGlass
 * E2E and Accessibility Testing
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    process.env.CI ? ['github'] : ['list']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.NODE_ENV === 'production' 
      ? 'http://localhost:6007' // Production Storybook build
      : 'http://localhost:6006', // Development Storybook
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile devices
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    
    // Tablet
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },

    // High DPI displays
    {
      name: 'Desktop Chrome High DPI',
      use: { 
        ...devices['Desktop Chrome'],
        deviceScaleFactor: 2,
      },
    },
    
    // Dark mode testing
    {
      name: 'Dark Mode',
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'dark',
      },
    },
    
    // Reduced motion testing (for accessibility)
    {
      name: 'Reduced Motion',
      use: {
        ...devices['Desktop Chrome'],
        // Note: Playwright doesn't have a built-in reducedMotion option
        // This can be simulated by setting CSS media queries in tests
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run storybook',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes
  },

  /* Global test timeout */
  timeout: 30 * 1000,

  /* Expect timeout for assertions */
  expect: {
    /* Maximum time expect() should wait for the condition to be met. */
    timeout: 5000,

    /* Screenshot comparison options */
    toHaveScreenshot: {
      /* Threshold for pixel comparison */
      threshold: 0.3,
      /* Maximum allowed pixel difference */
      maxDiffPixels: 1000,
    },
  },

  /* Output directories */
  outputDir: 'test-results/',
});