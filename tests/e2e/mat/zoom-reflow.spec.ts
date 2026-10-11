/* MAT-312 (REQ-A11Y-31/32): zoom + reflow — at 200% (640x400, dsf 2) no text is
   clipped or overlapped (range rects vs clipping ancestor and siblings); at
   400% (320x256 / 320x640, dsf 4) scrollWidth <= clientWidth except
   [data-ag-reflow-exempt] (Table, CodeSurface, ImageViewer only), overlays fit
   the viewport, sticky chrome sums <=50% viewport height. Never style.zoom.
   REQ-MAT-65: zoom is real device-pixel zoom — each size runs in its own
   browser.newContext({ viewport, deviceScaleFactor }) (1280x800 at 200% =>
   640x400 @2; 1280x1024 / 1280x2560 at 400% => 320x256 / 320x640 @4) — over
   every subject from listSubjects() (S-40; flagship + MAT at
   MAT_A11Y_SCOPE=pr, the whole index at full); failures name the owner. */
import { test, expect } from '@playwright/test';
import type { Browser, Page } from '@playwright/test';
import { listSubjects } from '../../helpers';
import { sweepSubjects, tag, byOwner, type Owner, type Subject } from './helpers/subjects';
import fs from 'node:fs';

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
        const ex = el.hasAttribute('data-ag-reflow-exempt') && exempt.includes(part);
        if (!ex && el !== document.documentElement && el !== document.body) {
          out.push({ kind: 'x-overflow', detail: `${el.tagName}[data-ag-part=${part}] sw=${el.scrollWidth} cw=${el.clientWidth}` });
        }
      }
      if (el.hasAttribute('data-ag-reflow-exempt') && !exempt.includes(el.getAttribute('data-ag-part') ?? '')) {
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

interface ZoomCase { name: string; width: number; height: number; deviceScaleFactor: number }
const ZOOM_200: ZoomCase = { name: '200% 640x400', width: 640, height: 400, deviceScaleFactor: 2 };
const ZOOM_400: ZoomCase[] = [
  { name: '400% 320x256', width: 320, height: 256, deviceScaleFactor: 4 },
  { name: '400% 320x640', width: 320, height: 640, deviceScaleFactor: 4 },
];

async function sweep(
  browser: Browser, baseURL: string | undefined, zc: ZoomCase, subjects: readonly Subject[],
  check: (page: Page, zc: ZoomCase) => Promise<ReflowIssue[]>,
): Promise<Array<{ owner: Owner; msg: string }>> {
  const context = await browser.newContext({ viewport: { width: zc.width, height: zc.height }, deviceScaleFactor: zc.deviceScaleFactor });
  const page = await context.newPage();
  const fails: Array<{ owner: Owner; msg: string }> = [];
  try {
    for (const s of subjects) {
      await page.goto(`${baseURL ?? ''}/iframe.html?id=${s.id}&viewMode=story`);
      await page.waitForSelector('[data-ag-cert-ready]', { state: 'attached', timeout: 30_000 });
      const dpr = await page.evaluate(() => window.devicePixelRatio);
      if (dpr !== zc.deviceScaleFactor) fails.push({ owner: s.owner, msg: `${tag(s)} ${zc.name}: devicePixelRatio ${dpr} != ${zc.deviceScaleFactor}` });
      for (const i of await check(page, zc)) fails.push({ owner: s.owner, msg: `${tag(s)} ${zc.name}: ${i.kind} ${i.detail}` });
    }
  } finally {
    await context.close();
  }
  return fails;
}

async function overlayIssues(page: Page, zc: ZoomCase): Promise<ReflowIssue[]> {
  const over = await page.evaluate((vp) =>
    [...document.querySelectorAll<HTMLElement>('[data-ag-part="dialog"],[data-ag-part="popover"],[data-ag-part="toast"]')]
      .filter((el) => { const r = el.getBoundingClientRect(); return r.width > vp.w || r.height > vp.h; })
      .map((el) => el.getAttribute('data-ag-part') ?? ''), { w: zc.width, h: zc.height });
  return over.map((part) => ({ kind: 'overlay-exceeds-viewport', detail: part }));
}

function report(name: string, browserName: string, fails: Array<{ owner: Owner; msg: string }>, subjects: number) {
  fs.mkdirSync('.artifacts/mat', { recursive: true });
  fs.writeFileSync(`.artifacts/mat/zoom-reflow-${name.replace(/[^a-z0-9]+/gi, '-')}-${browserName}.json`,
    JSON.stringify({ subjects, byOwner: byOwner(fails) }, null, 2));
}

test.describe('zoom + reflow', () => {
  test(`${ZOOM_200.name} (dsf ${ZOOM_200.deviceScaleFactor}): no clipped or overlapped text`, async ({ browser, baseURL, browserName }) => {
    test.setTimeout(30 * 60 * 1000);
    const subjects = await sweepSubjects(listSubjects);
    const fails = await sweep(browser, baseURL, ZOOM_200, subjects, (page) => clippingIssues(page));
    report(ZOOM_200.name, browserName, fails, subjects.length);
    expect(fails.map((f) => f.msg), 'clipped/overlapped text at 200%').toEqual([]);
  });

  for (const zc of ZOOM_400) {
    test(`${zc.name} (dsf ${zc.deviceScaleFactor}): single-axis reflow, overlays fit`, async ({ browser, baseURL, browserName }) => {
      test.setTimeout(30 * 60 * 1000);
      const subjects = await sweepSubjects(listSubjects);
      const fails = await sweep(browser, baseURL, zc, subjects, async (page, z) => [...await reflowIssues(page), ...await overlayIssues(page, z)]);
      report(zc.name, browserName, fails, subjects.length);
      expect(fails.map((f) => f.msg), 'reflow violations at 400%').toEqual([]);
    });
  }
});
