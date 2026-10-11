/* tests/dx/docs.playwright.config.ts — REQ-PLAT-102 (PLAT-384). Runs the
   remote docs gates tests/dx/docs-a11y.spec.ts and tests/dx/docs-lighthouse.spec.ts
   against the static export of plat:build:docs (apps/docs/out), served under the
   basePath it was built with by scripts/docs/serve-out.mjs. The root
   playwright.config.ts only matches stream kind directories, not tests/dx.
   Browser runs are remote-only (machine policy): outside CI this config exits 2
   and prints the remote command instead of launching browsers. */
import { defineConfig, devices } from '@playwright/test';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { docsBasePath } from '../../scripts/docs/serve-out.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const REMOTE = 'GitLab CI job plat:test:docs: npx playwright test -c tests/dx/docs.playwright.config.ts (needs plat:build:docs artifacts)';
if (!process.env.CI) {
  console.error(`docs a11y/lighthouse specs are remote-only; run them in ${REMOTE}`);
  process.exit(2);
}

const PORT = Number(process.env.AG_DOCS_PORT ?? 4173);
const BASE = docsBasePath();
export const DOCS_ORIGIN = `http://127.0.0.1:${PORT}`;
const EVIDENCE = process.env.AURAGLASS_EVIDENCE_DIR ?? join(ROOT, '.artifacts');

export default defineConfig({
  testDir: '.',
  forbidOnly: true,
  retries: 0,
  fullyParallel: true,
  timeout: 10 * 60 * 1000,
  reporter: [['list'], ['json', { outputFile: join(EVIDENCE, 'playwright', 'docs-gates.json') }]],
  outputDir: join(EVIDENCE, 'playwright', 'docs-gates'),
  webServer: {
    command: `node scripts/docs/serve-out.mjs --dir apps/docs/out --port ${PORT} --base "${BASE}"`,
    cwd: ROOT,
    url: `${DOCS_ORIGIN}${BASE}/`,
    reuseExistingServer: false,
    timeout: 60 * 1000,
  },
  use: { baseURL: `${DOCS_ORIGIN}${BASE}/`, trace: 'retain-on-failure' },
  projects: [
    { name: 'a11y-chromium', testMatch: ['docs-a11y.spec.ts'], use: { ...devices['Desktop Chrome'] } },
    /* WebKit cannot emulate prefers-reduced-transparency (no CDP); that one check runs in Chromium. */
    { name: 'a11y-webkit', testMatch: ['docs-a11y.spec.ts'], grepInvert: /prefers-reduced-transparency/, use: { ...devices['Desktop Safari'] } },
    { name: 'lighthouse', testMatch: ['docs-lighthouse.spec.ts'], use: { ...devices['Desktop Chrome'] } },
  ],
});
