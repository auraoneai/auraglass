/* MAT-313 (REQ-A11Y-33): text spacing — inject the WCAG 1.4.12 bookmarklet
   stylesheet as an UNLAYERED sheet (line-height 1.5, paragraph 2em,
   letter-spacing .12em, word-spacing .16em; !important allowed in test code
   only) and assert every text node's clipping ancestor has
   scrollWidth <= clientWidth and scrollHeight <= clientHeight. */
import { test, expect } from '@playwright/test';

const STORY = 'a11y-rungs--default';
const BOOKMARKLET = `
* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
p, [data-ag-part="description"] { margin-block-end: 2em !important; }
`;

test.describe('text spacing', () => {
  test('WCAG 1.4.12 stylesheet causes no clipping', async ({ page, baseURL }) => {
    await page.goto(`${baseURL ?? ''}/iframe.html?id=${STORY}&viewMode=story`);
    await page.waitForSelector('[data-ag-surface]');
    await page.addStyleTag({ content: BOOKMARKLET });
    await page.waitForTimeout(100);
    const issues = await page.evaluate(() => {
      const out: string[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        const el = node.parentElement;
        if (el && (node.textContent ?? '').trim()) {
          const clip = el.closest('[data-ag-scroll-container],[style*="overflow"]') ?? el;
          if (clip.scrollWidth > clip.clientWidth + 1 || clip.scrollHeight > clip.clientHeight + 1) {
            out.push(`${el.tagName}: sw${clip.scrollWidth}>cw${clip.clientWidth} sh${clip.scrollHeight}>ch${clip.clientHeight}`);
          }
        }
        node = walker.nextNode();
      }
      return [...new Set(out)].slice(0, 25);
    });
    expect(issues, 'text clipped after 1.4.12 spacing').toEqual([]);
  });
});
