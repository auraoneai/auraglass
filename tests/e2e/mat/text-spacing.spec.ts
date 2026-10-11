/* MAT-313 (REQ-A11Y-33, REQ-MAT-65): text spacing — inject the WCAG 1.4.12
   bookmarklet stylesheet as an UNLAYERED sheet (line-height 1.5, paragraph
   2em, letter-spacing .12em, word-spacing .16em; !important allowed in test
   code only) on every subject from listSubjects() (S-40; flagship + MAT at
   MAT_A11Y_SCOPE=pr, the whole index at full) and assert every text node's
   clipping ancestor has scrollWidth <= clientWidth and scrollHeight <=
   clientHeight. Failures are attributed to the subject's owner. */
import { test, expect } from '@playwright/test';
import { listSubjects } from '../../helpers';
import { sweepSubjects, tag, byOwner, type Owner } from './helpers/subjects';
import fs from 'node:fs';

const BOOKMARKLET = `
* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
p, [data-ag-part="description"] { margin-block-end: 2em !important; }
`;

test.describe('text spacing', () => {
  test('WCAG 1.4.12 stylesheet causes no clipping on any subject', async ({ page, baseURL, browserName }) => {
    test.setTimeout(30 * 60 * 1000);
    const subjects = await sweepSubjects(listSubjects);
    const fails: Array<{ owner: Owner; msg: string }> = [];
    let textNodes = 0;
    for (const s of subjects) {
      await page.goto(`${baseURL ?? ''}/iframe.html?id=${s.id}&viewMode=story`);
      await page.waitForSelector('[data-ag-cert-ready]', { state: 'attached', timeout: 30_000 });
      await page.addStyleTag({ content: BOOKMARKLET });
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      const res = await page.evaluate(() => {
        const out: string[] = [];
        let n = 0;
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        while (node) {
          const el = node.parentElement;
          if (el && (node.textContent ?? '').trim() && el.closest('script,style,noscript') === null) {
            n += 1;
            const clip = el.closest('[data-ag-scroll-container],[style*="overflow"]') ?? el;
            if (clip.scrollWidth > clip.clientWidth + 1 || clip.scrollHeight > clip.clientHeight + 1) {
              out.push(`${el.tagName}: sw${clip.scrollWidth}>cw${clip.clientWidth} sh${clip.scrollHeight}>ch${clip.clientHeight}`);
            }
          }
          node = walker.nextNode();
        }
        return { issues: [...new Set(out)].slice(0, 25), n };
      });
      textNodes += res.n;
      for (const i of res.issues) fails.push({ owner: s.owner, msg: `${tag(s)} ${i}` });
    }
    fs.mkdirSync('.artifacts/mat', { recursive: true });
    fs.writeFileSync(`.artifacts/mat/text-spacing-${browserName}.json`, JSON.stringify({ subjects: subjects.length, textNodes, byOwner: byOwner(fails) }, null, 2));
    expect(textNodes, 'text nodes inspected across subjects').toBeGreaterThan(0);
    expect(fails.map((f) => f.msg), 'text clipped after 1.4.12 spacing').toEqual([]);
  });
});
