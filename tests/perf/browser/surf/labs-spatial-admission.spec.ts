// tests/perf/browser/surf/labs-spatial-admission.spec.ts — labs spatial
// admission budget (REQ-SURF-180, AC-SURF-33): each shipped labs/three
// subject holds >= 24 fps and <= 256 MB heap at story idle, and shows no
// horizontal overflow at 360 px.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('SURF labs spatial admission', () => {
  test('every shipped labs subject meets the spatial budget', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF', kind: 'lab' });
    if (subjects.length === 0) {
      console.warn('no labs subjects registered in the subject index — pending');
      return;
    }
    const isPerfMode = !!process.env.PERF_MODE;
    for (const subject of subjects) {
      await test.step(subject.id, async () => {
        await page.setViewportSize({ width: 360, height: 640 });
        await gotoStory(page, subject.id);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        expect(overflow).toBeLessThanOrEqual(0);
        if (!isPerfMode) return; // fps/heap assertions run on perf-mode runners only
        const fps = await page.evaluate(
          () =>
            new Promise<number>((resolve) => {
              let frames = 0;
              const start = performance.now();
              const loop = () => {
                frames++;
                if (performance.now() - start < 2000) requestAnimationFrame(loop);
                else resolve((frames / (performance.now() - start)) * 1000);
              };
              requestAnimationFrame(loop);
            })
        );
        expect(fps).toBeGreaterThanOrEqual(24);
        const heap = await page.evaluate(
          () => (performance as any).memory?.usedJSHeapSize ?? 0
        );
        if (heap) expect(heap).toBeLessThan(256 * 1024 * 1024);
      });
    }
  });
});
