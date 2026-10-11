/* MAT-312 (REQ-A11Y-31/32): zoom + reflow — at 200% (640x400, dsf 2) no text is
   clipped or overlapped (range rects vs clipping ancestor and siblings); at
   400% (320x256 / 320x640, dsf 4) scrollWidth <= clientWidth except
   [data-reflow-exempt] (Table, CodeSurface, ImageViewer only), overlays fit
   the viewport, sticky chrome sums <=50% viewport height. Never style.zoom. */
import { test, expect } from '@playwright/test';

const STORY = 'a11y-rungs--default';
const EXEMPT = new Set(['table', 'code-surface', 'image-viewer']);

interface ReflowIssue { kind: string; detail: string }

async function clippingIssues(page: import('@playwright/test').Page): Promise<ReflowIssue[]> {
  return page.evaluate(() => {
    const out: Array<{ kind: string; detail: string }> = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    const range = document.createRange();
    while (node) {
      const parent = node.parentElement;
      if (parent && (node.textContent ?? '').trim()) {
        range.selectNodeContents(node);
        const r = range.getBoundingClientRect();
        const clip = parent.closest('[data-ag-scroll-container],[style*="overflow"]') ?? parent;
        const cr = clip.getBoundingClientRect();
        if (r.width > 0 && (r.right > cr.right + 1 || r.bottom > cr.bottom + 1)) {
          out.push({ kind: 'clipped-text', detail: `${parent.tagName} "${(node.textContent ?? '').slice(0, 30)}"` });
        }
        // sibling overlap: text node rect vs previous/next element sibling rect
        const sib = parent.nextElementSibling?.getBoundingClientRect();
        if (sib && r.width > 0 && !(r.bottom <= sib.top || r.top >= sib.bottom)) {
          const ox = Math.min(r.right, sib.right) - Math.max(r.left, sib.left);
          const oy = Math.min(r.bottom, sib.bottom) - Math.max(r.top, sib.top);
          if (ox > 2 && oy > 2) out.push({ kind: 'overlap', detail: parent.tagName });
        }
      }
      node = walker.nextNode();
    }
    return out.slice(0, 50);
  });
}

async function reflowIssues(page: import('@playwright/test').Page): Promise<ReflowIssue[]> {
  return page.evaluate((exempt) => {
    const out: Array<{ kind: string; detail: string }> = [];
    document.querySelectorAll<HTMLElement>('*').forEach((el) => {
      if (el.scrollWidth > el.clientWidth + 1 && el.scrollWidth > 0 && el.clientWidth > 0) {
        const part = el.getAttribute('data-ag-part') ?? '';
        const ex = el.hasAttribute('data-reflow-exempt') && exempt.includes(part);
        if (!ex && el !== document.documentElement && el !== document.body) {
          out.push({ kind: 'x-overflow', detail: `${el.tagName}[data-ag-part=${part}] sw=${el.scrollWidth} cw=${el.clientWidth}` });
        }
      }
      if (el.hasAttribute('data-reflow-exempt') && !exempt.includes(el.getAttribute('data-ag-part') ?? '')) {
        out.push({ kind: 'unauthorised-exempt', detail: el.getAttribute('data-ag-part') ?? el.tagName });
      }
    });
    const sticky = [...document.querySelectorAll<HTMLElement>('[data-ag-part="top-bar"],[data-ag-part="tab-bar"]')];
    const sum = sticky.reduce((s, el) => s + el.getBoundingClientRect().height, 0);
    if (sum > window.innerHeight / 2) out.push({ kind: 'chrome-too-tall', detail: `${sum}px > 50% of ${window.innerHeight}` });
    const zoomed = [...document.querySelectorAll<HTMLElement>('*')].some((el) => el.style.zoom !== '');
    if (zoomed) out.push({ kind: 'style.zoom-used', detail: 'forbidden' });
    return out.slice(0, 50);
  }, [...EXEMPT]);
}

test.describe('zoom + reflow', () => {
  test('200%: no clipped or overlapped text', async ({ page, baseURL }) => {
    await page.setViewportSize({ width: 640, height: 400 });
    await page.goto(`${baseURL ?? ''}/iframe.html?id=${STORY}&viewMode=story`);
    await page.waitForSelector('[data-ag-surface]');
    const issues = await clippingIssues(page);
    expect(issues, 'clipped/overlapped text at 200%').toEqual([]);
  });

  for (const size of [[320, 256], [320, 640]] as const) {
    test(`400% ${size[0]}x${size[1]}: single-axis reflow`, async ({ page, baseURL }) => {
      await page.setViewportSize({ width: size[0], height: size[1] });
      await page.goto(`${baseURL ?? ''}/iframe.html?id=${STORY}&viewMode=story`);
      await page.waitForSelector('[data-ag-surface]');
      const issues = await reflowIssues(page);
      expect(issues, 'reflow violations at 400%').toEqual([]);
      // overlays fit the viewport
      const over = await page.evaluate((vp) => {
        return [...document.querySelectorAll<HTMLElement>('[data-ag-part="dialog"],[data-ag-part="popover"],[data-ag-part="toast"]')]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > vp.w || r.height > vp.h;
          }).length;
      }, { w: size[0], h: size[1] });
      expect(over, 'overlays fit 400% viewport').toBe(0);
    });
  }
});
