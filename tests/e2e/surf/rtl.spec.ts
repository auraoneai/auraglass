// tests/e2e/surf/rtl.spec.ts — SURF RTL slice of QUAL's dir=rtl matrix
// (L12). listSubjects enumerates shipped SURF subjects; absent dirs report
// absence and pass — nothing hard-codes another lane's output.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../helpers';

test.describe('SURF RTL', () => {
  test('every shipped SURF subject mirrors cleanly under dir=rtl', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    expect(subjects.length, 'no SURF subjects registered in the subject index').toBeGreaterThan(0);
    for (const subject of subjects) {
      await test.step(`${subject.id} renders without horizontal overflow in dir=rtl`, async () => {
        await gotoStory(page, subject.id);
        await page.evaluate(() => {
          document.documentElement.setAttribute('dir', 'rtl');
        });
        const doc = await page.evaluate(() => document.documentElement.dir);
        expect(doc).toBe('rtl');
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        expect(overflow, `${subject.id} overflows by ${overflow}px in dir=rtl`).toBeLessThanOrEqual(0);
      });
    }
  });
});
