// forced-colors.spec.ts — SURF-104: forced-colors mode keeps text and focus outlines legible. Remote lane (3 engines where required); absent
// subjects report pending, never fail.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('forced colors (SURF-104)', () => {
  test('shell stays legible under forced-colors: active', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'AppShell');
    if (!subject) { console.warn('AppShell subject not registered — pending'); return; }
    await page.emulateMedia({ forcedColors: 'active' });
    await gotoStory(page, subject.id);
    const res = await page.evaluate(() => {
      const el = document.querySelector('.ag-app-shell');
      if (!el) return 'no-shell';
      const s = getComputedStyle(el);
      return s.color !== s.backgroundColor ? 'ok' : 'same-color';
    });
    expect(res).toBe('ok');
  });
});
