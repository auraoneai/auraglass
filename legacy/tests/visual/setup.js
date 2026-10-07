/**
 * Visual Regression Test Setup
 * 
 * Configuration for jest-image-snapshot and Playwright
 */

const { configureToMatchImageSnapshot } = require('jest-image-snapshot');

// Configure image snapshot defaults
const toMatchImageSnapshot = configureToMatchImageSnapshot({
  // Threshold for pixel differences
  failureThreshold: 0.1,
  failureThresholdType: 'percent',
  
  // Diff configuration
  customDiffConfig: {
    threshold: 0.1,
    includeAA: false, // Ignore anti-aliasing differences
  },
  
  // Snapshot naming
  customSnapshotsDir: '__image_snapshots__',
  customDiffDir: '__image_snapshots__/__diff_output__',
  
  // Only update snapshots in CI when explicitly requested
  updateSnapshot: process.env.CI ? false : true,
  
  // Custom image handling
  noColors: false,
  runInBand: true
});

expect.extend({ toMatchImageSnapshot });

// Global test timeout for visual tests
jest.setTimeout(60000);

// Console logging configuration
global.console = {
  ...console,
  // Suppress less important logs during visual tests
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: console.warn,
  error: console.error
};

// Environment variables for tests
process.env.NODE_ENV = 'test';
process.env.PLAYWRIGHT_HEADLESS = process.env.CI ? 'true' : 'false';