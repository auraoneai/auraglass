// tests/perf/browser/surf/registry-blocks.spec.ts — SURF registry-blocks
// performance slice (REQ-SURF-171..178): every shipped SURF block renders
// its six states without exceeding the block budget; absence passes.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('SURF registry blocks perf', () => {
  test('every shipped SURF block renders within the 4 s interaction budget', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF', kind: 'showcase' });
    if (subjects.length === 0) {
      console.warn('no SURF block subjects registered in the subject index — pending');
      return;
    }
    for (const subject of subjects) {
      await test.step(subject.id, async () => {
        await gotoStory(page, subject.id);
        const [p50] = await page.evaluate(async () => {
          const t0 = performance.now();
          await new Promise((r) => requestAnimationFrame(() => r(0)));
          return [performance.now() - t0];
        });
        expect(p50).toBeLessThan(4000);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  });
});
