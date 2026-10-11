/* REQ-QUAL-11 (FIN-449): shared lane fixture. Every lane spec under certification/lanes/** imports `test`
   from here (never from @playwright/test directly), so each page starts with the frozen clock and seeded
   Math.random before any story script runs. Remote-only (GitLab CI / gated runner). */
import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import { DEFAULT_SEED, FIXED_EPOCH_MS, determinismInit } from './determinism-init';
import type { DeterminismOptions } from './determinism-init';

export { DEFAULT_SEED, FIXED_EPOCH_ISO, FIXED_EPOCH_MS, determinismInit } from './determinism-init';
export type { DeterminismOptions } from './determinism-init';

export async function installDeterminism(page: Page, opts: Partial<DeterminismOptions> = {}): Promise<void> {
  await page.addInitScript(determinismInit, { epochMs: opts.epochMs ?? FIXED_EPOCH_MS, seed: opts.seed ?? DEFAULT_SEED });
}

export const test = base.extend({
  page: async ({ page }, provide) => {
    await installDeterminism(page);
    await provide(page);
  },
});
export { expect } from '@playwright/test';
