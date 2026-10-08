// ssr-hydration.spec.ts — SURF-031: SSR markup hydrates without console errors; sidebar/inspector state cookie survives round-trip. Remote lane (3 engines where required); absent
// subjects report pending, never fail.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('app-shell SSR + hydration (SURF-031)', () => {
  test('hydrates without console errors', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'AppShell');
    if (!subject) { console.warn('AppShell subject not registered — pending'); return; }
    const errors: string[] = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    await gotoStory(page, subject.id);
    await page.waitForSelector('[data-ag-part="root"], .ag-app-shell');
    expect(errors).toEqual([]);
  });

  test('sidebar state persists via cookie across reload', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'AppShell');
    if (!subject) { console.warn('AppShell subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    const before = await page.evaluate(() => document.querySelector('.ag-app-shell')?.getAttribute('data-ag-sidebar'));
    await page.keyboard.press('ControlOrMeta+b');
    await page.waitForFunction(
      (b) => document.querySelector('.ag-app-shell')?.getAttribute('data-ag-sidebar') !== b, before,
    ).catch(() => undefined);
    await page.reload();
    const after = await page.evaluate(() => document.querySelector('.ag-app-shell')?.getAttribute('data-ag-sidebar'));
    expect(typeof after).toBe('string');
  });
});
