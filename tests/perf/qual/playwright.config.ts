/* tests/perf/qual/playwright.config.ts — L10 Playwright projects (QUAL; remote only, qual:certify:l10).
     qual:l10-selftest  tests/perf/qual/harness-selftest.spec.ts (REQ-QUAL-34 harness self-test, Chromium)
     qual:l10-streams   tests/perf/browser/<stream>/**  — stream-authored perf specs, discovered by location (QUAL never
                        edits them); served from storybook-static by run-perf.mjs --serve when AG_L10_STREAMS=1. */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';

const ROOT = fileURLToPath(new URL('../../..', import.meta.url));
const evidence = resolve(ROOT, process.env.AURAGLASS_EVIDENCE_DIR ?? '.artifacts', 'qual', process.env.CI_JOB_NAME_SLUG ?? 'qual-certify-l10');
const storybookUrl = process.env.AG_STORYBOOK_URL ?? 'http://127.0.0.1:6006';
const streams = process.env.AG_L10_STREAMS === '1';

export default defineConfig({
  forbidOnly: true,
  retries: 0,
  workers: 1,                                   // perf: one measured page at a time per runner
  reporter: [['list'], ['json', { outputFile: `${evidence}/playwright-${streams ? 'streams' : 'selftest'}.json` }]],
  outputDir: `${evidence}/playwright-output`,
  use: { trace: 'retain-on-failure' },
  projects: [
    { name: 'qual:l10-selftest', testDir: '.', testMatch: 'harness-selftest.spec.ts', use: { ...devices['Desktop Chrome'], channel: 'chromium-headless-shell' } },
    { name: 'qual:l10-streams', testDir: '../browser', testMatch: '**/*.spec.ts', use: { ...devices['Desktop Chrome'], baseURL: storybookUrl } },
  ],
  ...(streams ? { webServer: {
    command: 'node tests/perf/harness/run-perf.mjs --serve storybook-static --port 6006',
    cwd: ROOT, url: `${storybookUrl}/index.json`, reuseExistingServer: false, timeout: 60_000,
    env: { AG_REMOTE_RUNNER: process.env.AG_REMOTE_RUNNER ?? '' },
  } } : {}),
});
