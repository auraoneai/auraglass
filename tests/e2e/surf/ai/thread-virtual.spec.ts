// thread-virtual.spec.ts — SURF-352: virtualization bounds over the
// Long2000Virtualized story.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('ai thread virtualization (SURF-352)', () => {
  test('mounted articles ≤ visible + 12 in the 2,000-message story', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.id.includes('virtual') || s.id.includes('long'));
    if (!subject) throw new Error('Long2000Virtualized subject not registered');
    await gotoStory(page, subject.id);
    const counts = await page.evaluate(() => {
      const vp = document.querySelector<HTMLElement>('[data-ag-part="viewport"]');
      if (!vp) return { mounted: -1, visible: -1 };
      const r = vp.getBoundingClientRect();
      const articles = [...vp.querySelectorAll('article')];
      const visible = articles.filter((a) => {
        const ar = a.getBoundingClientRect();
        return ar.bottom > r.top && ar.top < r.bottom;
      }).length;
      return { mounted: articles.length, visible };
    });
    if (counts.mounted < 0) throw new Error('viewport absent');
    expect(counts.mounted).toBeLessThanOrEqual(counts.visible + 12);
  });

  test('a single role=log element owns the message list', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Thread');
    if (!subject) throw new Error('AI/Thread subject not registered');
    await gotoStory(page, subject.id);
    await expect(page.locator('[role="log"]')).toHaveCount(1);
  });
});
