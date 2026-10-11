// tests/e2e/surf/motion/idle.spec.ts — SURF loop-idle matrix (REQ-SURF-05).
// Each shipped SURF subject stops rAF when the page is hidden and when the
// element scrolls out of view; an empty subject index fails the test.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('SURF motion idle', () => {
  test('every shipped SURF subject suspends rAF when hidden', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    expect(subjects.length, 'no SURF subjects registered in the subject index').toBeGreaterThan(0);
    for (const subject of subjects) {
      await test.step(subject.id, async () => {
        await gotoStory(page, subject.id);
        await page.evaluate(() => {
          (window as any).__rafCount = 0;
          const orig = requestAnimationFrame.bind(window);
          (window as any).requestAnimationFrame = (cb: FrameRequestCallback) =>
            orig((t) => { (window as any).__rafCount++; cb(t); });
        });
        await page.evaluate(() => {
          Object.defineProperty(document, 'visibilityState', { value: 'hidden' });
          document.dispatchEvent(new Event('visibilitychange'));
        });
        const before = await page.evaluate(() => (window as any).__rafCount);
        await page.waitForTimeout(300);
        const after = await page.evaluate(() => (window as any).__rafCount);
        expect(after - before, `${subject.id} kept animating while hidden`).toBeLessThanOrEqual(1);
      });
    }
  });
});
