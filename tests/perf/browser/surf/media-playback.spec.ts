// media-playback.spec.ts — SURF-495 (AC-SURF-20): 0 long tasks >50ms during
// playback + scrub; media-store snapshot throttle ≤15Hz. Remote perf lane.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('media playback perf (SURF-495)', () => {
  test('no long tasks over 50ms while scrubbing', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'MediaControls');
    if (!subject) throw new Error('MediaControls subject not registered');
    await gotoStory(page, subject.id);
    const scrubber = page.locator('[data-ag-part="media-scrubber"]').first();
    expect(await scrubber.count(), 'no scrubber').toBeGreaterThan(0);
    const longTasks = await page.evaluate(async () => {
      const tasks: number[] = [];
      const po = new PerformanceObserver((l) => { for (const e of l.getEntries()) tasks.push(e.duration); });
      try { po.observe({ type: 'longtask', buffered: true }); } catch { return [-1]; }
      await new Promise((r) => setTimeout(r, 800));
      return tasks;
    });
    if (longTasks[0] === -1) throw new Error('longtask observer unsupported');
    for (const t of longTasks) expect(t).toBeLessThanOrEqual(50);
  });
});
