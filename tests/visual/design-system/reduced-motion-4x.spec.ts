/* tests/visual/design-system/reduced-motion-4x.spec.ts — REQ-PLAT-48 (PLAT-103).
   Remote Chromium with reducedMotion 'reduce' over the stories of the 35
   reduced-motion components (the same table as
   src/__tests__/motion/reduced-motion-visible.test.tsx):
     - 500 ms after load, no visible text-bearing element has computed opacity < 1
     - 1 s after load, document.getAnimations().length === 0
   Story ids come from the served Storybook's index.json (by importPath), so
   every table row must resolve to at least one story.
   Artifacts: .artifacts/plat/visual-4x/<component>-<story>.png + summary.json.

   Remote-only subject (GitLab CI / gated remote runner, never this Mac): it
   needs a served Storybook at AG_STORYBOOK_URL (or the config baseURL in CI).
   Invoked without one it fails with the remote command rather than skipping. */
import { test, expect, type APIRequestContext } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/* CJS-transpiled spec: __dirname is available. */
const ROOT = join(__dirname, '..', '..', '..');
const OUT = join(ROOT, '.artifacts', 'plat', 'visual-4x');
const TABLE = join(ROOT, 'src/__tests__/motion/reduced-motion-visible.test.tsx');
const STORYBOOK = process.env.AG_STORYBOOK_URL?.replace(/\/$/, '') ?? '';

/* Parse the {file, component} rows; rows may span several lines and carry props. */
const tableSrc = readFileSync(TABLE, 'utf8');
const rows = [...tableSrc.matchAll(/\bfile:\s*"([^"]+)",\s*component:\s*"([^"]+)"/g)].map(
  (m) => ({ file: m[1], component: m[2] })
);
const declaredRows = (tableSrc.match(/\bfile:\s*"/g) ?? []).length;

type IndexEntry = { id: string; type?: string; importPath: string };
let index: IndexEntry[] = [];

async function loadIndex(request: APIRequestContext): Promise<IndexEntry[]> {
  const base = STORYBOOK || '';
  for (const path of ['/index.json', '/stories.json']) {
    const res = await request.get(`${base}${path}`);
    if (res.ok()) {
      const body = await res.json();
      const entries = Object.values(body.entries ?? body.stories ?? {}) as IndexEntry[];
      return entries.filter((e) => (e.type ?? 'story') === 'story');
    }
  }
  throw new Error(`no Storybook index at ${base || '<baseURL>'}/index.json`);
}

const storyIds = (file: string) =>
  index
    .filter((e) => e.importPath.replace(/^\.\//, '') === `src/components/${file}.stories.tsx`)
    .map((e) => e.id);

const url = (id: string) => `${STORYBOOK}/iframe.html?id=${id}&viewMode=story`;

test.describe('reduced-motion visual (4.x, remote)', () => {
  test.setTimeout(300_000);
  const summary: Record<string, unknown>[] = [];

  test.beforeAll(async ({ request }) => {
    if (!STORYBOOK && !process.env.CI) {
      throw new Error(
        'remote-only subject: run in GitLab CI (plat:test:visual-4x) or the gated remote runner ' +
          'with AG_STORYBOOK_URL=<served storybook-static> npx playwright test ' +
          'tests/visual/design-system/reduced-motion-4x.spec.ts'
      );
    }
    mkdirSync(OUT, { recursive: true });
    index = await loadIndex(request);
  });

  test('the table parses every declared row', () => {
    expect(rows.length).toBe(declaredRows);
    expect(rows.length).toBeGreaterThanOrEqual(35);
  });

  for (const row of rows) {
    test(`${row.component} settles visible with zero animations`, async ({ page }) => {
      const ids = storyIds(row.file);
      expect(ids.length, `${row.file}.stories.tsx story ids in Storybook index`).toBeGreaterThan(0);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      for (const id of ids.slice(0, 3)) {
        await page.goto(url(id));
        await page.waitForTimeout(500);
        const lowOpacity = await page.evaluate(() => {
          const bad: string[] = [];
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
          let el = walker.nextNode() as HTMLElement | null;
          while (el) {
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.height > 0 && el.textContent?.trim()) {
              const cs = getComputedStyle(el);
              if (cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) < 1) {
                bad.push(`${el.tagName}.${String(el.className).slice(0, 30)}:${cs.opacity}`);
              }
            }
            el = walker.nextNode() as HTMLElement | null;
          }
          return bad;
        });
        await page.waitForTimeout(500);
        const animations = await page.evaluate(() => document.getAnimations().length);
        summary.push({ component: row.component, story: id, opacityViolations: lowOpacity, animations });
        await page.screenshot({ path: join(OUT, `${row.component}-${id.split('--').pop()}.png`) });
        expect(lowOpacity, `${id} opacity<1 nodes`).toEqual([]);
        expect(animations, `${id} getAnimations`).toBe(0);
      }
    });
  }

  test.afterAll(() => {
    mkdirSync(OUT, { recursive: true });
    writeFileSync(join(OUT, 'summary.json'), JSON.stringify(summary, null, 2));
  });
});
