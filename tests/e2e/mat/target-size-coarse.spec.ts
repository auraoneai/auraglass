/* MAT-303 (REQ-A11Y-30, REQ-MAT-62/65): target size, coarse pointer —
   hasTouch+isMobile 390x844 on the Chromium and WebKit projects only (the
   mat:a11y-suites-firefox project ignores this file: Playwright has no
   isMobile emulation for Firefox, so no coarse pointer can be produced there).
   On every subject from listSubjects() (S-40): every REQ-A11Y-30 part
   >=44x44, no hit-area rects intersect, and the host layout box is unchanged
   with/without HitArea. Failures are attributed to the subject's owner. */
import { test, expect } from '@playwright/test';
import { assertMedia } from './helpers/emulate';
import { listSubjects } from '../../helpers';
import { sweepSubjects, tag, byOwner, type Owner } from './helpers/subjects';
import fs from 'node:fs';

const COARSE_PARTS = [
  'button', 'icon-button', 'checkbox', 'radio', 'switch', 'slider', 'tab',
  'tab-item', 'menu-item', 'toast-action', 'chip-remove', 'pagination-item',
  'carousel-control', 'media-control',
];

test.describe('target size (coarse)', () => {
  test('coarse pointer: REQ-A11Y-30 parts >=44x44, no hit-area overlap', async ({ browser, browserName, baseURL }) => {
    test.setTimeout(30 * 60 * 1000);
    const subjects = await sweepSubjects(listSubjects);
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const page = await context.newPage();
    const fails: Array<{ owner: Owner; msg: string }> = [];
    let measured = 0;
    for (const s of subjects) {
      await page.goto(`${baseURL ?? ''}/iframe.html?id=${s.id}&viewMode=story`);
      await page.waitForSelector('[data-ag-cert-ready]', { state: 'attached', timeout: 30_000 });
      await assertMedia(page, '(pointer: coarse)');
      const found = await page.evaluate((wanted) =>
        [...document.querySelectorAll<HTMLElement>(wanted.map((p) => `[data-ag-part="${p}"]`).join(','))]
          .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; })
          .map((el) => ({
            part: el.getAttribute('data-ag-part') ?? '',
            r: el.getBoundingClientRect().toJSON() as DOMRect,
            hit: (el.querySelector('[data-ag-part="hit-area"]')?.getBoundingClientRect().toJSON() ?? null) as DOMRect | null,
          })), COARSE_PARTS);
      measured += found.length;
      for (const p of found) {
        const w = (p.hit ?? p.r).width, h = (p.hit ?? p.r).height;
        if (Math.min(w, h) < 44) fails.push({ owner: s.owner, msg: `${tag(s)} ${p.part} coarse target ${w}x${h} < 44x44` });
      }
      const hits = found.filter((p) => p.hit).map((p) => ({ part: p.part, r: p.hit! }));
      for (let i = 0; i < hits.length; i += 1) {
        for (let j = i + 1; j < hits.length; j += 1) {
          const a = hits[i]!.r, b = hits[j]!.r;
          const overlap = !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
          if (overlap) fails.push({ owner: s.owner, msg: `${tag(s)} hit areas of ${hits[i]!.part} and ${hits[j]!.part} intersect` });
        }
      }
      // host layout box identical with/without HitArea, for every part carrying one
      const drift = await page.evaluate(() => {
        const out: Array<{ part: string; d: number }> = [];
        document.querySelectorAll<HTMLElement>('[data-ag-part]').forEach((el) => {
          const hit = el.querySelector(':scope > [data-ag-part="hit-area"]');
          if (!hit) return;
          const before = el.getBoundingClientRect();
          const parent = hit.parentNode!;
          const next = hit.nextSibling;
          hit.remove();
          const after = el.getBoundingClientRect();
          parent.insertBefore(hit, next);
          out.push({ part: el.getAttribute('data-ag-part') ?? '', d: Math.max(Math.abs(before.width - after.width), Math.abs(before.height - after.height)) });
        });
        return out;
      });
      for (const d of drift) {
        if (d.d !== 0) fails.push({ owner: s.owner, msg: `${tag(s)} ${d.part} host box changes by ${d.d}px with HitArea` });
      }
    }
    await context.close();
    fs.mkdirSync('.artifacts/mat', { recursive: true });
    fs.writeFileSync(`.artifacts/mat/target-size-coarse-${browserName}.json`, JSON.stringify({ subjects: subjects.length, measured, byOwner: byOwner(fails) }, null, 2));
    expect(measured, 'coarse REQ-A11Y-30 parts measured across subjects').toBeGreaterThan(0);
    expect(fails.map((f) => f.msg), 'coarse-pointer target-size failures').toEqual([]);
  });
});
