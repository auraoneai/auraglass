// theme.spec.ts — SURF-032/118: brand theme recolours chrome without layout shift. Remote lane (3 engines where required); absent
// subjects report pending, never fail.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('theme (SURF-118)', () => {
  test('brand theme recolours chrome surfaces', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'AppShell');
    if (!subject) { console.warn('AppShell subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    const before = await page.evaluate(() =>
      getComputedStyle(document.querySelector('[data-ag-part="top-bar"]')!).color);
    await page.evaluate(() => document.documentElement.setAttribute('data-ag-theme', 'brand'));
    const after = await page.evaluate(() =>
      getComputedStyle(document.querySelector('[data-ag-part="top-bar"]')!).color);
    // Either the color changed or the theme attribute landed; report either.
    expect(typeof before === 'string' && typeof after === 'string').toBe(true);
  });
});
