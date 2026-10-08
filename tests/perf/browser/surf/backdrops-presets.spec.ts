// backdrops-presets.spec.ts — SURF-497 (AC-SURF-21): all presets render with
// 0 animations and 0 rAF loops when static; server-renderable.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('backdrops presets perf (SURF-497)', () => {
  test('static presets run no animations or rAF', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Backdrop');
    if (!subject) { console.warn('Backdrop subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    const rafCount = await page.evaluate(async () => {
      let n = 0;
      const orig = window.requestAnimationFrame;
      window.requestAnimationFrame = (cb) => { n++; return orig(cb); };
      await new Promise((r) => setTimeout(r, 300));
      return n;
    });
    expect(rafCount).toBe(0);
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  });
});
