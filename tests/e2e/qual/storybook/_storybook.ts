/* REQ-QUAL-57 (REQ-FIN-106, FIN-452): shared plumbing for the Storybook flow specs. Remote only — run through
   scripts/storybook/run-flows.mjs (GitLab job qual:test:storybook-flows), which serves the fresh build and sets
   AG_STORYBOOK_URL. Every spec imports `test` from the certification determinism fixture (frozen clock, seeded
   Math.random, REQ-QUAL-11) and checks the served build is fresh for the SHA under test before any flow runs. */
import type { APIRequestContext, Page } from '@playwright/test';
import { freshnessProblems } from '../../../../scripts/storybook/lib/storybook-build.mjs';

export { test, expect } from '../../../../certification/lanes/_fixtures/determinism';

interface IndexEntry { id: string; type: string; title: string; name: string; importPath: string; tags?: string[] }

let cachedIndex: Record<string, IndexEntry> | null = null;

async function fetchOk(request: APIRequestContext, path: string): Promise<Buffer> {
  const res = await request.get(path);
  if (!res.ok()) throw new Error(`GET ${path} → HTTP ${res.status()} from ${process.env.AG_STORYBOOK_URL ?? '(AG_STORYBOOK_URL unset)'}`);
  return res.body();
}

/** REQ-QUAL-56 freshness of the served build: ag-build.json sha == SHA under test, clean in CI, index hash. */
export async function assertFreshStorybook(request: APIRequestContext): Promise<void> {
  const sha = process.env.CI_COMMIT_SHA ?? process.env.AG_EXPECTED_SHA;
  if (!sha) throw new Error('CI_COMMIT_SHA (or AG_EXPECTED_SHA) must name the SHA under test; flows never run against an unidentified build');
  const manifestRes = await request.get('/ag-build.json');
  const manifest = manifestRes.ok() ? JSON.parse((await manifestRes.body()).toString('utf8')) : null;
  const indexText = await fetchOk(request, '/index.json');
  const problems = freshnessProblems({ manifest, indexText, sha, requireClean: process.env.CI === 'true' });
  if (problems.length) throw new Error(`stale Storybook build: ${problems.join('; ')}`);
  cachedIndex = JSON.parse(indexText.toString('utf8')).entries as Record<string, IndexEntry>;
}

/** `test.beforeAll(({ playwright }) => beforeAllFresh(playwright))` — worker-scoped freshness check. */
export async function beforeAllFresh(playwright: { request: { newContext(o: { baseURL?: string }): Promise<APIRequestContext> } }): Promise<void> {
  const base = process.env.AG_STORYBOOK_URL;
  if (!base) throw new Error('AG_STORYBOOK_URL is unset; run through scripts/storybook/run-flows.mjs');
  const ctx = await playwright.request.newContext({ baseURL: base });
  try { await assertFreshStorybook(ctx); } finally { await ctx.dispose(); }
}

/** The built index entry for `id`; a missing story or a ShowcasePending (`no-cert`) render is a failure, never a pass. */
export function storyEntry(id: string): IndexEntry {
  if (!cachedIndex) throw new Error('assertFreshStorybook must run first (test.beforeAll)');
  const entry = cachedIndex[id];
  if (!entry || entry.type !== 'story') throw new Error(`story ${id} is not in the built Storybook index`);
  if (entry.tags?.includes('no-cert')) throw new Error(`story ${id} is tagged no-cert (ShowcasePending: a composed block is not landed)`);
  return entry;
}

/** Story ids in the built index whose tags include `tag` and whose title starts with `titlePrefix`. */
export function storiesTagged(tag: string, titlePrefix: string): IndexEntry[] {
  if (!cachedIndex) throw new Error('assertFreshStorybook must run first (test.beforeAll)');
  return Object.values(cachedIndex).filter((e) => e.type === 'story' && e.tags?.includes(tag) && e.title.startsWith(titlePrefix));
}

/** Opens a story in the preview iframe and waits for StoryRoot's data-ag-cert-ready (fonts, images, two frames). */
export async function openStory(page: Page, id: string, globals: Record<string, string> = {}): Promise<void> {
  storyEntry(id);
  const g = Object.entries(globals).map(([k, v]) => `${k}:${v}`).join(';');
  await page.goto(`/iframe.html?id=${encodeURIComponent(id)}&viewMode=story${g ? `&globals=${encodeURIComponent(g)}` : ''}`);
  await page.locator('[data-ag-story-content][data-ag-cert-ready]').waitFor({ state: 'attached', timeout: 30_000 });
}

/** Console errors and uncaught page errors collected for the life of `page`. */
export function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console.error: ${m.text()}`); });
  return errors;
}
