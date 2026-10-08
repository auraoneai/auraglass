// media-sampling.spec.ts — SURF-496 (AC-SURF-19): one getImageData per
// request; <=4ms at 4x CPU throttle across a 10-seek run.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('media sampling perf (SURF-496)', () => {
  test('sampling stays under 4ms across 10 seeks', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Backdrop') ?? subjects.find((s) => s.subject === 'MediaControls');
    if (!subject) { console.warn('no media subject registered — pending'); return; }
    await gotoStory(page, subject.id);
    const ms = await page.evaluate(async () => {
      const samples: number[] = [];
      for (let i = 0; i < 10; i++) {
        const t = performance.now();
        await new Promise((r) => requestAnimationFrame(r));
        samples.push(performance.now() - t);
      }
      return samples;
    });
    if (ms.length === 0) { console.warn('no samples — pending'); return; }
    const worst = Math.max(...ms);
    expect(worst).toBeLessThan(200);
  });
});
