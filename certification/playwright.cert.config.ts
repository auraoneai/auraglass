/* QUAL's certification Playwright config (contract §4.11: it appends every fragment project whose name matches
   <stream>:cert-*). Remote runs only (GitLab CI / gated runner); this file never raises local workers.
   - Built-in lane projects: chromium, webkit, firefox over certification/lanes/** only (REQ-QUAL-12). Lanes that need a
     per-cell viewport/DPR create their own browser context (environment-visual.spec.ts).
   - Fragment cert projects: loaded and shape-validated by lanes/_fixtures/fragments.ts (array or wave-keyed files;
     testDir resolved from the repository root).
   - REQ-QUAL-67: loading this config outside GitLab CI / the remote runner prints the remote command and exits 2
     (scripts/qual/remote-guard.mjs), so `playwright test -c certification/playwright.cert.config.ts` never launches a
     browser on a workstation (AG_CERT_ALLOW_LOCAL=1 for explicit local debugging).
   - REQ-QUAL-66: screenshots are taken with CSS animations/transitions disabled (L7 pixel regression compares stills;
     `animations: 'disabled'` finishes finite animations and cancels infinite ones before capture), caret hidden. */
import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { loadCertProjects } from './lanes/_fixtures/fragments';
import { guardRemote } from '../scripts/qual/remote-guard.mjs';

guardRemote({ command: ['npx playwright', ...process.argv.slice(2)].join(' '), what: 'certification/playwright.cert.config.ts' });

/** REQ-QUAL-66: the still-capture options every L7 comparison uses (expect.toHaveScreenshot and page.screenshot). */
export const L7_SCREENSHOT = { animations: 'disabled', caret: 'hide' } as const;

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const LANES_DIR = fileURLToPath(new URL('./lanes', import.meta.url));
const fragments = loadCertProjects(ROOT);
for (const i of fragments.issues) console.warn(`[cert-config] ${i.stream} ${i.file} ${i.project}: ${i.code} — ${i.message}`);

const ENGINES = ['chromium', 'webkit', 'firefox'] as const;
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
  expect: { toHaveScreenshot: { ...L7_SCREENSHOT } },
  projects: [
    lane('chromium', 'Desktop Chrome'),
    lane('webkit', 'Desktop Safari'),
    lane('firefox', 'Desktop Firefox'),
    ...fragments.projects,
  ],
});
