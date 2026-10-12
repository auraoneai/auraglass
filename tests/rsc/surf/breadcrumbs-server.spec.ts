// breadcrumbs-server.spec.ts — REQ-SURF-57 / SURF-080 (L11, remote): the
// Next 16 canary's server Breadcrumbs page renders its complete markup in the
// initial HTML and references 0 client modules from the breadcrumbs tree when
// not overflowing; the overflow page (positive control) references the
// Breadcrumbs.Overflow island.
//
// The canary lane (`surf:test:canary-hydration`) packs dist, runs
// `next build` + `next start` for canaries/next16 and exports its origin as
// AG_CANARY_BASE_URL. A production RSC payload names every client reference
// a route renders as an `I[moduleId, chunks, exportName]` row; the spec reads
// the payload the browser received (self.__next_f) and lists those export
// names. Fail-closed: without AG_CANARY_BASE_URL the spec errors, never skips.
import { test, expect, type Page } from '@playwright/test';

const BASE = process.env.AG_CANARY_BASE_URL;
/* Client modules of the breadcrumbs graph: the overflow island and the
   (dev-only) landmark beacon it renders. */
const BREADCRUMBS_CLIENT_EXPORTS = ['BreadcrumbsOverflow', 'LandmarkBeacon'] as const;

function requireBase(): string {
  if (!BASE) {
    throw new Error('AG_CANARY_BASE_URL is not set: run this spec through the L11 canary lane (surf:test:canary-hydration), which serves the built canaries/next16.');
  }
  return BASE.replace(/\/$/, '');
}

/** Export names of every client reference (`I` row) in the route's RSC payload. */
async function clientReferenceExports(page: Page): Promise<string[]> {
  const payload = await page.evaluate(() => {
    const f = (self as unknown as { __next_f?: unknown[][] }).__next_f ?? [];
    return f.map((entry) => (typeof entry[1] === 'string' ? entry[1] : '')).join('');
  });
  expect(payload.length).toBeGreaterThan(0);
  const names: string[] = [];
  for (const m of payload.matchAll(/(?:^|\n)[0-9a-f]+:I\[([\s\S]*?)\]\n/g)) {
    try {
      const row = JSON.parse(`[${m[1]}]`) as unknown[];
      const name = row[2];
      if (typeof name === 'string') names.push(name);
    } catch {
      names.push(`<unparsed:${m[1]!.slice(0, 80)}>`);
    }
  }
  return names;
}

test.describe('breadcrumbs server render (REQ-SURF-57)', () => {
  test('nav > ol > li markup is in the initial HTML, links truncate with the full text as title', async ({ request }) => {
    const base = requireBase();
    const res = await request.get(`${base}/surf/breadcrumbs-server`);
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toMatch(/<nav[^>]*aria-label="Breadcrumb"[^>]*>\s*<ol[^>]*data-ag-part="list"/);
    expect(html).toMatch(/<a[^>]*data-ag-part="link"[^>]*>Home<\/a>/);
    expect(html).toContain('title="Components"');
    expect(html).toMatch(/<span[^>]*data-ag-part="current"[^>]*aria-current="page"|<span[^>]*aria-current="page"[^>]*data-ag-part="current"/);
  });

  test('not overflowing: the route references 0 breadcrumbs client modules', async ({ page }) => {
    const base = requireBase();
    const res = await page.goto(`${base}/surf/breadcrumbs-server`, { waitUntil: 'networkidle' });
    expect(res?.status()).toBe(200);
    const refs = await clientReferenceExports(page);
    const hits = refs.filter((n) => (BREADCRUMBS_CLIENT_EXPORTS as readonly string[]).includes(n) || n.startsWith('<unparsed'));
    expect({ hits }).toEqual({ hits: [] });
    // no surface / backdrop filter on the trail (REQ-SURF-57)
    const nav = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(nav).toBeVisible();
    const filters = await nav.evaluate((el) => {
      const all = [el, ...el.querySelectorAll('*')] as Element[];
      return all
        .map((n) => getComputedStyle(n))
        .filter((s) => (s.backdropFilter && s.backdropFilter !== 'none') || (s.getPropertyValue('-webkit-backdrop-filter') || 'none') !== 'none').length;
    });
    expect(filters).toBe(0);
    await expect(nav.locator('[data-ag-material], [data-ag-layer]')).toHaveCount(0);
  });

  test('overflowing (positive control): the route references the Breadcrumbs.Overflow island', async ({ page }) => {
    const base = requireBase();
    const res = await page.goto(`${base}/surf/breadcrumbs-overflow`, { waitUntil: 'networkidle' });
    expect(res?.status()).toBe(200);
    const refs = await clientReferenceExports(page);
    expect(refs).toContain('BreadcrumbsOverflow');
  });
});
