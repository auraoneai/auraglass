/* MAT-303 (REQ-A11Y-30, REQ-MAT-62/65): target size, fine pointer — at
   1440x900 every data-ag-part on every subject from listSubjects() (S-40;
   flagship + MAT at MAT_A11Y_SCOPE=pr, the whole index at full) owns a >=24x24
   region (elementsFromPoint on a 24px grid) or meets the 24px-circle spacing
   exception. The coarse-pointer half lives in target-size-coarse.spec.ts
   (Chromium + WebKit projects; Firefox has no isMobile emulation). Failures
   are attributed to the subject's owner. */
import { test, expect } from '@playwright/test';
import { listSubjects } from '../../helpers';
import { sweepSubjects, tag, byOwner, type Owner } from './helpers/subjects';
import fs from 'node:fs';

test.describe('target size', () => {
  test('fine pointer: 24px grid ownership on every subject', async ({ browser, baseURL, browserName }) => {
    test.setTimeout(30 * 60 * 1000);
    const subjects = await sweepSubjects(listSubjects);
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const fails: Array<{ owner: Owner; msg: string }> = [];
    let measured = 0;
    for (const s of subjects) {
      await page.goto(`${baseURL ?? ''}/iframe.html?id=${s.id}&viewMode=story`);
      await page.waitForSelector('[data-ag-cert-ready]', { state: 'attached', timeout: 30_000 });
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
      measured += rows.length;
      for (const r of rows) {
        if (!r.ok) fails.push({ owner: s.owner, msg: `${tag(s)} ${r.part} ${r.w}x${r.h} owns no 24px grid cell and misses the spacing exception` });
      }
    }
    await context.close();
    fs.mkdirSync('.artifacts/mat', { recursive: true });
    fs.writeFileSync(`.artifacts/mat/target-size-fine-${browserName}.json`, JSON.stringify({ subjects: subjects.length, measured, byOwner: byOwner(fails) }, null, 2));
    expect(measured, 'parts measured across subjects').toBeGreaterThan(0);
    expect(fails.map((f) => f.msg), 'fine-pointer target-size failures').toEqual([]);
  });
});
