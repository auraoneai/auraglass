/* QUAL's certification Playwright config (contract §4.11: it appends every fragment project whose name matches
   <stream>:cert-*). Remote runs only (GitLab CI / gated runner); this file never raises local workers.
   - Built-in lane projects: chromium, webkit, firefox over certification/lanes/** only (REQ-QUAL-12). Lanes that need a
     per-cell viewport/DPR create their own browser context (environment-visual.spec.ts).
   - Fragment cert projects: loaded and shape-validated by lanes/_fixtures/fragments.ts (array or wave-keyed files;
     testDir resolved from the repository root).
   - Location projects (REQ-QUAL-19, lanes/_fixtures/behaviour.ts): tests/a11y/apg/<stream>/**\/*.apg.spec.ts and
     tests/e2e/<stream>/**\/*.spec.ts in chromium, webkit and firefox, discovered by location in addition to the fragment
     projects, plus QUAL's tests/a11y/browser/** (axe spec, harness self-test). */
import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { loadCertProjects } from './lanes/_fixtures/fragments';
import { locationProjects } from './lanes/_fixtures/behaviour';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const LANES_DIR = fileURLToPath(new URL('./lanes', import.meta.url));
const fragments = loadCertProjects(ROOT);
for (const i of fragments.issues) console.warn(`[cert-config] ${i.stream} ${i.file} ${i.project}: ${i.code} — ${i.message}`);

const ENGINES = ['chromium', 'webkit', 'firefox'] as const;
const DEVICE = { chromium: 'Desktop Chrome', webkit: 'Desktop Safari', firefox: 'Desktop Firefox' } as const;
const located = locationProjects(ROOT).map((p) => ({ name: p.name, testDir: p.testDir, testMatch: p.testMatch, use: { ...devices[DEVICE[p.engine]] } }));
/** Tests titled `@engine-<engine>` (environment-visual cells) run only in that engine's project; untagged lane tests run in all. */
const lane = (name: (typeof ENGINES)[number], device: string) => ({
  name, testDir: LANES_DIR, testMatch: '**/*.spec.ts', testIgnore: '**/_fixtures/**', use: { ...devices[device] },
  grepInvert: new RegExp(`@engine-(${ENGINES.filter((e) => e !== name).join('|')})\\b`),
});

export default defineConfig({
  testDir: LANES_DIR,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // run.mjs points PLAYWRIGHT_JSON_OUTPUT_NAME at its per-row report; the default path is for direct runs.
  reporter: [['list'], ['json', { outputFile: process.env.PLAYWRIGHT_JSON_OUTPUT_NAME ?? `${process.env.AURAGLASS_EVIDENCE_DIR ?? '.artifacts'}/playwright-cert/results.json` }]],
  use: { baseURL: process.env.AG_STORYBOOK_URL ?? 'http://127.0.0.1:6006', trace: 'retain-on-failure' },
  projects: [
    lane('chromium', 'Desktop Chrome'),
    lane('webkit', 'Desktop Safari'),
    lane('firefox', 'Desktop Firefox'),
    ...located,
    ...fragments.projects,
  ],
});
