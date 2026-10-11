// resizable-drag.spec.ts — SURF-43/054: a real handle drag keeps frame p95 within
// the fragments/perf-budgets/surf.ts mid-mobile row (16.7 ms) and writes the
// panel flex-basis at most once per frame (rAF-coalesced, PRD §16).
// Remote perf lane; a missing subject fails the test.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory, perf } from '../../../helpers';

const FRAME_P95_MAX_MS = 16.7; // fragments/perf-budgets/surf.ts surf/resizablepanels--default mid-mobile

test.describe('resizable-drag.spec.ts (SURF)', () => {
  test('drag: frame p95 within budget, <=1 flex-basis write batch per frame', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'ResizablePanels' && s.id.endsWith('--default'));
    if (!subject) throw new Error('ResizablePanels --default story not registered');
    await gotoStory(page, subject.id);
    const handle = page.locator('[data-ag-part="resize-handle"]').first();
    await expect(handle).toHaveCount(1);
    const box = await handle.boundingBox();
    if (!box) throw new Error('no handle box');

    // Count style-mutation batches per animation frame on the group's panels.
    await page.evaluate(() => {
      const w = window as unknown as { __agWrites: { frame: number; perFrame: Map<number, number>; raf: number } };
      w.__agWrites = { frame: 0, perFrame: new Map(), raf: 0 };
      const rec = w.__agWrites;
      const tick = () => {
        rec.frame += 1;
        rec.raf = requestAnimationFrame(tick);
      };
      rec.raf = requestAnimationFrame(tick);
      const root = document.querySelector('.ag-panels')!;
      const mo = new MutationObserver((records) => {
        if (records.some((r) => r.attributeName === 'style')) {
          rec.perFrame.set(rec.frame, (rec.perFrame.get(rec.frame) ?? 0) + 1);
        }
      });
      mo.observe(root, { subtree: true, attributes: true, attributeFilter: ['style'] });
      (window as unknown as { __agWritesMo: MutationObserver }).__agWritesMo = mo;
    });

    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    const { p95Ms } = await perf.frames(page, {
      durationMs: 0,
      during: async () => {
        await page.mouse.move(cx, cy);
        await page.mouse.down();
        for (let i = 1; i <= 60; i++) await page.mouse.move(cx + i * 3, cy);
        await page.mouse.up();
      },
    });

    const writes = await page.evaluate(() => {
      const w = window as unknown as {
        __agWrites: { perFrame: Map<number, number>; raf: number };
        __agWritesMo: MutationObserver;
      };
      cancelAnimationFrame(w.__agWrites.raf);
      w.__agWritesMo.disconnect();
      const counts = [...w.__agWrites.perFrame.values()];
      return { frames: counts.length, maxPerFrame: counts.length ? Math.max(...counts) : 0 };
    });

    expect(writes.frames, 'drag produced no flex-basis writes').toBeGreaterThan(0);
    expect(writes.maxPerFrame).toBeLessThanOrEqual(1);
    expect(p95Ms).toBeGreaterThan(0);
    expect(p95Ms).toBeLessThanOrEqual(FRAME_P95_MAX_MS);
  });
});
