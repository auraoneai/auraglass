/* contract-v1.0 verbatim. Browser runs are remote-only (machine policy); this file never raises local workers. */
import { defineConfig, devices } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
const STREAMS = ['plat', 'mat', 'cmp', 'surf', 'qual'] as const;
const KINDS = ['a11y/apg', 'e2e', 'visual', 'ssr', 'rsc'] as const;
const fragmentProjects = STREAMS.flatMap((s) => {
  const f = `fragments/playwright/${s}.json`;
  return existsSync(f) ? (JSON.parse(readFileSync(f, 'utf8')) as Array<Record<string, unknown>>) : [];
});
const testMatch = STREAMS.flatMap((s) => KINDS.map((k) => `${k}/${s}/**/*.spec.ts`)).concat(['a11y/browser/**/*.spec.ts', 'perf/browser/**/*.spec.ts']);
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['json', { outputFile: `${process.env.AURAGLASS_EVIDENCE_DIR ?? '.artifacts'}/playwright/results.json` }]],
  use: { baseURL: process.env.AG_STORYBOOK_URL ?? 'http://127.0.0.1:6006', trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, testMatch },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, testMatch },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, testMatch },
    ...fragmentProjects,
  ],
});
