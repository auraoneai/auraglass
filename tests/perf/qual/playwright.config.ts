/* tests/perf/qual/playwright.config.ts — L10 Playwright projects (QUAL; remote only, qual:certify:l10).
     qual:l10-selftest  tests/perf/qual/harness-selftest.spec.ts (REQ-QUAL-34 harness self-test, Chromium)
     qual:l10-streams   tests/perf/browser/<stream>/**  — stream-authored perf specs, discovered by location (QUAL never
                        edits them); served from storybook-static by run-perf.mjs --serve when AG_L10_STREAMS=1.
     qual:l10-invariants-{chromium,webkit,firefox}
                        REQ-QUAL-42/-43 (G-22): backdrop-root, lens-defs, webgl-context, a11y-fallback in all three
                        engines; mount-unmount-leak in Chromium only (forced GC needs --js-flags=--expose-gc).
                        Served the same way when AG_L10_INVARIANTS=1. */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';

const ROOT = fileURLToPath(new URL('../../..', import.meta.url));
const evidence = resolve(ROOT, process.env.AURAGLASS_EVIDENCE_DIR ?? '.artifacts', 'qual', process.env.CI_JOB_NAME_SLUG ?? 'qual-certify-l10');
const storybookUrl = process.env.AG_STORYBOOK_URL ?? 'http://127.0.0.1:6006';
const streams = process.env.AG_L10_STREAMS === '1';
const invariants = process.env.AG_L10_INVARIANTS === '1';
const run = streams ? 'streams' : invariants ? 'invariants' : 'selftest';

const INVARIANT_SPECS = ['backdrop-root.spec.ts', 'lens-defs.spec.ts', 'webgl-context.spec.ts', 'a11y-fallback.spec.ts'];
const invariantsProject = (engine: 'chromium' | 'webkit' | 'firefox', device: (typeof devices)[string], extra: object = {}) => ({
  name: `qual:l10-invariants-${engine}`,
  testDir: '.',
  testMatch: engine === 'chromium' ? ['mount-unmount-leak.spec.ts', ...INVARIANT_SPECS] : INVARIANT_SPECS,
  // a11y-fallback tags its per-engine condition lists @<engine> (OI-QUAL-04); drop the other engines' tags.
  grepInvert: new RegExp(['chromium', 'webkit', 'firefox'].filter((e) => e !== engine).map((e) => `@${e}\\b`).join('|')),
  timeout: 120_000,
  use: { ...device, baseURL: storybookUrl, ...extra },
});

export default defineConfig({
  forbidOnly: true,
  retries: 0,
  workers: 1,                                   // perf: one measured page at a time per runner
  reporter: [['list'], ['json', { outputFile: `${evidence}/playwright-${run}.json` }]],
  outputDir: `${evidence}/playwright-output`,
  use: { trace: 'retain-on-failure' },
  projects: [
    /* No Playwright trace here: its recorder takes a DOM snapshot and screencast frame around every action of the
       settled window (~40 mouse/keyboard/wheel steps), which lands on the measured page's main thread as long tasks. */
    { name: 'qual:l10-selftest', testDir: '.', testMatch: 'harness-selftest.spec.ts', use: { ...devices['Desktop Chrome'], channel: 'chromium-headless-shell', trace: 'off' } },
    { name: 'qual:l10-streams', testDir: '../browser', testMatch: '**/*.spec.ts', use: { ...devices['Desktop Chrome'], baseURL: storybookUrl } },
    invariantsProject('chromium', devices['Desktop Chrome'], { launchOptions: { args: ['--js-flags=--expose-gc'] } }),
    invariantsProject('webkit', devices['Desktop Safari']),
    invariantsProject('firefox', devices['Desktop Firefox'], { launchOptions: { firefoxUserPrefs: { 'webgl.force-enabled': true } } }),
  ],
  ...(streams || invariants ? { webServer: {
    command: 'node tests/perf/harness/run-perf.mjs --serve storybook-static --port 6006',
    cwd: ROOT, url: `${storybookUrl}/index.json`, reuseExistingServer: false, timeout: 60_000,
    env: { AG_REMOTE_RUNNER: process.env.AG_REMOTE_RUNNER ?? '' },
  } } : {}),
});
