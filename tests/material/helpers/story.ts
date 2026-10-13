/* tests/material/helpers/story.ts — goto a storybook story by id and wait for
   cert-ready. Mirrors the frozen GotoStory shape (S-40) with no QUAL import. */
import type { Page } from '@playwright/test';

export interface MatStoryEnv {
  tier?: 'lightweight' | 'standard' | 'enhanced';
  engine?: 'chromium' | 'webkit' | 'gecko';
  transparency?: 'glass' | 'tinted' | 'solid';
  motion?: 'full' | 'calm' | 'none';
}

export async function gotoMaterialStory(page: Page, storyId: string, env: MatStoryEnv = {}) {
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);
  await page.waitForSelector('[data-ag-cert-ready]', { state: 'attached' });
  // Apply env attributes only after cert-ready: the provider's preference
  // mounts write data-ag-tier / data-ag-engine on <html> during mount (from
  // the Storybook globals, default tier 'standard'), which would stomp any
  // attribute set between goto and first paint. Nothing re-applies them
  // after mount unless the globals change, so post-ready values stick.
  if (env.engine) {
    await page.evaluate((e) => document.documentElement.setAttribute('data-ag-engine', e), env.engine);
  }
  if (env.tier) {
    await page.evaluate((t) => document.documentElement.setAttribute('data-ag-tier', t), env.tier);
  }
  await page.waitForSelector('.ag-surface', { state: 'attached', timeout: 10_000 }).catch(() => {});
}
