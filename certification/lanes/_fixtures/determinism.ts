/* REQ-QUAL-11 (FIN-449): shared lane fixture. Every lane spec under certification/lanes/** imports `test`
   from here (never from @playwright/test directly), so each page starts with the frozen clock and seeded
   Math.random before any story script runs — the fixture `page`, and every context a spec opens itself
   through `browser.newContext()` / `browser.newPage()`. Remote-only (GitLab CI / gated runner).
   REQ-QUAL-05: each worker records its browser name + version under $AG_LANE_EVIDENCE_DIR/browser-versions/,
   which the lane runner folds into lane-manifest.json `browserVersions`. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { test as base } from '@playwright/test';
import type { Browser, BrowserContext, Page } from '@playwright/test';
import { DEFAULT_SEED, FIXED_EPOCH_MS, determinismInit } from './determinism-init';
import { blockNonLoopback, offlineBrowser, offlineMode } from './offline';
import type { DeterminismOptions } from './determinism-init';

export { DEFAULT_SEED, FIXED_EPOCH_ISO, FIXED_EPOCH_MS, determinismInit } from './determinism-init';
export type { DeterminismOptions } from './determinism-init';

/** Sub-directory of $AG_LANE_EVIDENCE_DIR holding one `{ name, version }` file per worker. */
export const BROWSER_VERSIONS_DIR = 'browser-versions';

const initArg = (opts: Partial<DeterminismOptions>): DeterminismOptions =>
  ({ epochMs: opts.epochMs ?? FIXED_EPOCH_MS, seed: opts.seed ?? DEFAULT_SEED });

export async function installDeterminism(target: Page | BrowserContext, opts: Partial<DeterminismOptions> = {}): Promise<void> {
  await target.addInitScript(determinismInit, initArg(opts));
}

/** Patches `browser.newContext` (and so `browser.newPage`) so every context a spec opens itself starts deterministic.
    determinismInit is idempotent per realm, so an extra installDeterminism(page) on top is harmless. */
export function deterministicBrowser(browser: Browser): Browser {
  const newContext = browser.newContext.bind(browser);
  browser.newContext = async (...args: Parameters<Browser['newContext']>) => {
    const ctx = await newContext(...args);
    await installDeterminism(ctx);
    return ctx;
  };
  return browser;
}

/** Writes this worker's browser name + version for the lane manifest (no-op outside a lane run). */
export function recordBrowserVersion(browser: Browser, workerIndex: number, env: NodeJS.ProcessEnv = process.env): string | null {
  const dir = env.AG_LANE_EVIDENCE_DIR;
  if (!dir) return null;
  const name = browser.browserType().name();
  const out = join(dir, BROWSER_VERSIONS_DIR);
  mkdirSync(out, { recursive: true });
  const file = join(out, `${name}-${process.pid}-${workerIndex}.json`);
  writeFileSync(file, `${JSON.stringify({ name, version: browser.version() })}\n`);
  return file;
}

export const test = base.extend<object, { agBrowserVersion: void }>({
  // REQ-QUAL-67: on the offline AWS worker (AG_OFFLINE_BUNDLE=1) every context aborts non-127.0.0.1 requests.
  browser: [async ({ browser }, provide) => {
    const b = deterministicBrowser(browser);
    await provide(offlineMode() ? offlineBrowser(b) : b);
  }, { scope: 'worker' }],
  agBrowserVersion: [async ({ browser }, provide, workerInfo) => {
    recordBrowserVersion(browser, workerInfo.workerIndex);
    await provide();
  }, { scope: 'worker', auto: true }],
  context: async ({ context }, provide) => {
    if (offlineMode()) await blockNonLoopback(context);
    await installDeterminism(context);
    await provide(context);
  },
  page: async ({ page }, provide) => {
    await installDeterminism(page);
    await provide(page);
  },
});
export { expect } from '@playwright/test';
