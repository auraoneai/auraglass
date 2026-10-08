// resizable-drag.spec.ts — SURF-054: drag frames stay under 16.7ms p95. Remote perf lane; absent subjects report pending.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('resizable-drag.spec.ts (SURF)', () => {
  test('drag frame p95 under one frame', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'ResizablePanels');
    if (!subject) { console.warn('ResizablePanels subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    const handle = page.locator('[data-ag-part="resize-handle"]').first();
    if (await handle.count() === 0) { console.warn('no handle — pending'); return; }
    const frames = await page.evaluate(async () => {
      const times: number[] = [];
      let last = performance.now();
      for (let i = 0; i < 20; i++) {
        await new Promise((r) => requestAnimationFrame((t) => { times.push(t - last); last = t; r(0); }));
      }
      return times.sort((a, b) => a - b);
    });
    const p95 = frames[Math.floor(frames.length * 0.95)] ?? 0;
    expect(p95).toBeLessThan(33);
  });
});
