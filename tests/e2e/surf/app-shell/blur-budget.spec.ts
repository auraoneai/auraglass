// blur-budget.spec.ts — SURF-070/103: concurrent blurred surfaces stay under the release budget. Remote lane (3 engines where required); absent
// subjects report pending, never fail.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('blur budget (SURF-070/103)', () => {
  test('shell renders ≤ the blurred-surface budget', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'AppShell');
    if (!subject) { console.warn('AppShell subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    const blurred = await page.evaluate(() =>
      [...document.querySelectorAll('*')].filter((el) => {
        const s = getComputedStyle(el);
        return (s.backdropFilter && s.backdropFilter !== 'none') || (s.filter ?? '').includes('blur');
      }).length,
    );
    expect(blurred).toBeLessThanOrEqual(4);
  });
});

// REQ-SURF-53 (REQ-FIN-82): the tab bar's SurfaceGroup owns the only backdrop
// filter; items tint/rim only. Runs on chromium/webkit/firefox.
test.describe('blur budget: tab bar (SURF-53)', () => {
  test('tab bar = 1 backdrop filter', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.id === 'surf-tab-bar--default');
    if (!subject) throw new Error('surf-tab-bar--default subject not registered');
    await gotoStory(page, subject.id);
    const count = await page.evaluate(() => {
      const bar = document.querySelector('[data-ag-part="tab-bar"]');
      const group = bar?.closest('[data-ag-group]');
      if (!group) return -1;
      return [group, ...group.querySelectorAll('*')].filter((el) => {
        const cs = getComputedStyle(el);
        const before = getComputedStyle(el, '::before');
        return (cs.backdropFilter || 'none') !== 'none' || (before.backdropFilter || 'none') !== 'none';
      }).length;
    });
    expect(count).toBe(1);
  });
});
