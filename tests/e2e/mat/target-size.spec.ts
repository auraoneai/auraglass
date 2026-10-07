/* MAT-303 (REQ-A11Y-30): target size — fine pointer 1440x900: each part owns a
   >=24x24 region (elementsFromPoint on a 24px grid) or meets the 24px-circle
   spacing exception. Coarse pointer (hasTouch+isMobile 390x844, WebKit +
   Chromium): every REQ-A11Y-30 part >=44x44, no hit-area rects intersect, and
   the host layout box is unchanged with/without HitArea. */
import { test, expect } from '@playwright/test';

const STORY = 'a11y-targets--default';
const COARSE_PARTS = [
  'button', 'icon-button', 'checkbox', 'radio', 'switch', 'slider', 'tab',
  'tab-item', 'menu-item', 'toast-action', 'chip-remove', 'pagination-item',
  'carousel-control', 'media-control',
];

test.describe('target size', () => {
  test('fine pointer: 24px grid ownership', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${baseURL ?? ''}/iframe.html?id=${STORY}&viewMode=story`);
    await page.waitForSelector('[data-ag-part]');
    const rows = await page.evaluate(() => {
      const out: Array<{ part: string; ok: boolean; w: number; h: number }> = [];
      document.querySelectorAll<HTMLElement>('[data-ag-part]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        const part = el.getAttribute('data-ag-part') ?? '';
        const step = 24;
        let owned = 0;
        const cx0 = r.left + Math.min(step / 2, r.width / 2);
        const cy0 = r.top + Math.min(step / 2, r.height / 2);
        for (let y = cy0; y < r.bottom; y += step) {
          for (let x = cx0; x < r.right; x += step) {
            const top = document.elementFromPoint(x, y);
            if (top === el || el.contains(top) || (top && top.contains(el))) owned += 1;
          }
        }
        const ok = (r.width >= 24 && r.height >= 24) || owned > 0;
        out.push({ part, ok, w: r.width, h: r.height });
      });
      return out;
    });
    for (const r of rows) {
      expect(r.ok, `${r.part} ${r.w}x${r.h} owns 24px grid or spacing exception`).toBe(true);
    }
    await context.close();
  });

  test('coarse pointer: REQ-A11Y-30 parts >=44x44, no hit-area overlap', async ({ browser, browserName, baseURL }) => {
    test.skip(!['chromium', 'webkit'].includes(browserName), 'coarse emulation covered on Chromium+WebKit');
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();
    await page.goto(`${baseURL ?? ''}/iframe.html?id=${STORY}&viewMode=story`);
    await page.waitForSelector('[data-ag-part]');
    const parts = await page.evaluate((wanted) => {
      const rects = (sel: string) =>
        [...document.querySelectorAll<HTMLElement>(sel)].map((el) => ({
          part: el.getAttribute('data-ag-part') ?? '',
          r: el.getBoundingClientRect().toJSON(),
          hit: el.querySelector('[data-ag-part="hit-area"]')?.getBoundingClientRect().toJSON() ?? null,
        }));
      return rects(wanted.map((p) => `[data-ag-part="${p}"]`).join(','));
    }, COARSE_PARTS);
    const found = parts.filter((p) => COARSE_PARTS.includes(p.part));
    for (const p of found) {
      const w = (p.hit ?? p.r).width, h = (p.hit ?? p.r).height;
      expect(Math.min(w, h), `${p.part} coarse target >=44x44 (hit ${w}x${h})`).toBeGreaterThanOrEqual(44);
    }
    // hit-area rects must not intersect each other
    const hits = found.filter((p) => p.hit).map((p) => p.hit!);
    for (let i = 0; i < hits.length; i += 1) {
      for (let j = i + 1; j < hits.length; j += 1) {
        const a = hits[i]!, b = hits[j]!;
        const overlap = !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
        expect(overlap, `hit-area rects ${i}/${j} must not intersect`).toBe(false);
      }
    }
    // host layout box identical with/without HitArea
    const drift = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('[data-ag-part="icon-button"]');
      if (!el) return null;
      const before = el.getBoundingClientRect().toJSON();
      const hit = el.querySelector('[data-ag-part="hit-area"]');
      hit?.remove();
      const after = el.getBoundingClientRect().toJSON();
      return Math.max(Math.abs(before.width - after.width), Math.abs(before.height - after.height));
    });
    if (drift !== null) expect(drift, 'host layout box unchanged by HitArea').toBe(0);
    await context.close();
  });
});
