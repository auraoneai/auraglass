// thread-scroll.spec.ts — SURF-351: scroll anchoring over the AI/Thread
// stories. Remote lane only (Chromium/WebKit/Gecko).
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('ai thread scroll (SURF-351)', () => {
  test('pinned thread keeps distanceFromBottom ≤1px while streaming', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.id.includes('thread') && s.id.includes('streaming'));
    if (!subject) throw new Error('AI/Thread streaming subject not registered');
    await gotoStory(page, subject.id);
    const viewport = page.locator('[data-ag-part="viewport"]');
    await expect(viewport).toBeVisible();
    const drift = await page.evaluate(async () => {
      const el = document.querySelector<HTMLElement>('[data-ag-part="viewport"]');
      if (!el) return -1;
      const bottom0 = el.scrollHeight - el.scrollTop - el.clientHeight;
      for (let i = 0; i < 50; i++) {
        const msg = document.createElement('article');
        msg.textContent = 'frame';
        el.querySelector('[data-ag-part="log"]')?.appendChild(msg);
        await new Promise((r) => requestAnimationFrame(r));
      }
      return Math.abs((el.scrollHeight - el.scrollTop - el.clientHeight) - Math.min(bottom0, 1));
    });
    expect(drift).toBeLessThanOrEqual(1);
  });

  test('scrolled-up thread shows JumpToLatest; activation re-pins', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.id.includes('jump') || (s.id.includes('thread') && s.id.includes('unpinned')));
    if (!subject) throw new Error('AI/Thread unpinned subject not registered');
    await gotoStory(page, subject.id);
    await page.locator('[data-ag-part="viewport"]').evaluate((el) => { el.scrollTop -= 400; });
    const jump = page.locator('[data-ag-part="jump-to-latest"]');
    await expect(jump).toBeVisible();
    await jump.click();
    const pinned = await page.locator('[data-ag-part="viewport"]').evaluate((el) =>
      el.scrollHeight - el.scrollTop - el.clientHeight <= 1);
    expect(pinned).toBe(true);
  });

  test('prepend keeps the first visible message offset ≤1px', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Thread');
    if (!subject) throw new Error('AI/Thread subject not registered');
    await gotoStory(page, subject.id);
    const result = await page.evaluate(async () => {
      const vp = document.querySelector<HTMLElement>('[data-ag-part="viewport"]');
      const first = vp?.querySelector<HTMLElement>('article');
      if (!vp || !first) return null;
      vp.scrollTop = 0;
      await new Promise((r) => setTimeout(r, 100));
      const y0 = first.getBoundingClientRect().top;
      // simulate a history prepend of 20
      const log = vp.querySelector('[data-ag-part="log"]');
      for (let i = 0; i < 20 && log; i++) log.insertBefore(document.createElement('article'), log.firstChild);
      return Math.abs(first.getBoundingClientRect().top - y0);
    });
    if (result === null) throw new Error('thread viewport/log structure not found');
    expect(result).toBeLessThanOrEqual(1);
  });
});
