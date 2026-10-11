/* tests/visual/design-system/reduced-motion-4x.spec.ts — REQ-PLAT-103.
   Remote Chromium with reducedMotion 'reduce' over the stories of the 35
   reduced-motion components (same table as
   src/__tests__/motion/reduced-motion-visible.test.tsx):
     - 500 ms after load, no visible text node has computed opacity < 1
     - 1 s after mount, document.getAnimations().length === 0 (subtree)
   Artifacts: .artifacts/plat/visual-4x/<component>.png (+ summary.json).
   Remote-only subject; skips locally without AG_STORYBOOK_URL. */
import { test, expect } from '@playwright/test';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/* CJS-transpiled spec: __dirname is available. */
const ROOT = join(__dirname, '..', '..', '..');
const OUT = join(ROOT, '.artifacts', 'plat', 'visual-4x');
const TABLE = join(ROOT, 'src/__tests__/motion/reduced-motion-visible.test.tsx');

/* Parse the 35-row {file, component} table. */
const rows = (() => {
  const src = readFileSync(TABLE, 'utf8');
  const out: { file: string; component: string }[] = [];
  for (const m of src.matchAll(/\{\s*file:\s*"([^"]+)",\s*component:\s*"([^"]+)"\s*\}/g)) {
    out.push({ file: m[1], component: m[2] });
  }
  return out;
})();

/* Resolve a row to a story id: meta title + first export. */
function storyIds(row: { file: string; component: string }): string[] {
  const stories = join(ROOT, 'src/components', row.file + '.stories.tsx');
  if (!existsSync(stories)) return [];
  const src = readFileSync(stories, 'utf8');
  const title = /title:\s*['"`]([^'"`]+)['"`]/.exec(src)?.[1];
  if (!title) return [];
  const kind = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const exports = [...src.matchAll(/export const (\w+)\s*[=:]/g)].map((e) => e[1])
    .filter((n) => n !== 'default' && !/^meta/i.test(n));
  return exports.map((e) => `${kind}--${e.toLowerCase().replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`);
}

test.describe('reduced-motion visual (4.x, remote)', () => {
  test.skip(!process.env.AG_STORYBOOK_URL && !process.env.CI, 'remote-only subject; needs storybook URL');
  test.setTimeout(300_000);
  mkdirSync(OUT, { recursive: true });

  const summary: Record<string, unknown>[] = [];
  for (const row of rows) {
    test(`${row.component} settles visible with zero animations`, async ({ page }) => {
      const ids = storyIds(row);
      expect(ids.length, `${row.file} story ids`).toBeGreaterThan(0);
      for (const id of ids.slice(0, 3)) {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto(`/iframe.html?id=${id}&viewMode=story`);
        await page.waitForTimeout(500);
        const settled = await page.evaluate(() => {
          const bad: string[] = [];
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
          let el = walker.nextNode() as HTMLElement | null;
          while (el) {
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.height > 0 && el.textContent?.trim()) {
              const cs = getComputedStyle(el);
              if (cs.visibility !== 'hidden' && parseFloat(cs.opacity) < 1 && cs.display !== 'none') {
                bad.push(`${el.tagName}.${el.className?.toString?.().slice(0, 30)}:${cs.opacity}`);
              }
            }
            el = walker.nextNode() as HTMLElement | null;
          }
          return bad;
        });
        expect(settled, `${id} opacity<1 nodes`).toEqual([]);
        await page.waitForTimeout(500);
        const anims = await page.evaluate(() => document.getAnimations().length);
        expect(anims, `${id} getAnimations`).toBe(0);
        summary.push({ component: row.component, story: id, opacityViolations: settled.length, animations: anims });
        await page.screenshot({ path: join(OUT, `${row.component}-${id.split('--').pop()}.png`) });
      }
    });
  }
  test.afterAll(() => {
    writeFileSync(join(OUT, 'summary.json'), JSON.stringify(summary, null, 2));
  });
});
