/* @ag-contract-seed: QUAL's own config; the contract fixes only that it appends every
   fragment project whose name matches <stream>:cert-* (§4.11). Remote runs only. */
import { defineConfig, devices } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';

const STREAMS = ['plat', 'mat', 'cmp', 'surf', 'qual'] as const;
const CERT_RE = /^(plat|mat|cmp|surf|qual):cert-/;
const fragmentProjects = STREAMS.flatMap((s) => {
  const f = `fragments/playwright/${s}.json`;
  return existsSync(f) ? (JSON.parse(readFileSync(f, 'utf8')) as Array<Record<string, unknown>>) : [];
}).filter((p) => CERT_RE.test(String(p.name ?? '')));

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['json', { outputFile: `${process.env.AURAGLASS_EVIDENCE_DIR ?? '.artifacts'}/playwright-cert/results.json` }]],
  use: { baseURL: process.env.AG_STORYBOOK_URL ?? 'http://127.0.0.1:6006', trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, testMatch: '**/*.spec.ts' },
    ...fragmentProjects,
  ],
});
