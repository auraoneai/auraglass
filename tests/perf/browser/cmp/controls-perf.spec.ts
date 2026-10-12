/* CMP-383 (lane 3i-Q). Remote perf lane only — runs under AG_REMOTE_RUNNER=1 on
   the PRD-PERF harness (tests/perf/harness/run-perf.mjs + grade.mjs). This file
   registers the cases; harness seam lands with PRD-PERF. */
import { test, expect } from '@playwright/test';
import { gotoStory, perf } from '../../../helpers/index';

// Remote-only (machine policy): a local run fails loudly instead of skipping (PRD §18).
if (process.env.AG_REMOTE_RUNNER !== '1') throw new Error('remote perf lane only: run on the remote runner (AG_REMOTE_RUNNER=1)');


test.describe('controls perf (CMP-383)', () => {
  const BUDGETS = { mobileInpP75: 100, desktopInpP75: 50 };
  const CASES = [
    { name: 'Button press', story: 'flagships-controls-button--default', sel: 'button' },
    { name: 'Switch toggle', story: 'flagships-controls-switch--default', sel: '[role="switch"]' },
    { name: 'Select open', story: 'flagships-controls-select--default', sel: '[data-ag-part="trigger"], button' },
    { name: 'Combobox type', story: 'flagships-controls-combobox--default', sel: 'input, [role="combobox"]' },
  ];

  for (const c of CASES) {
    test(`${c.name}: INP p75 within budget`, async ({ page }) => {
      await gotoStory(page, c.story);
      const target = page.locator(c.sel).first();
      const res = await perf.frames(page, {
        durationMs: 500,
        during: async () => {
          await target.click().catch(() => target.press('Enter'));
          await page.waitForTimeout(120);
        },
      });
      expect(res.p95Ms).toBeLessThanOrEqual(BUDGETS.desktopInpP75);
      expect(res.longTasks).toBe(0);
    });
  }
});

/* REQ-CMP-51: during a pointer drag the slider forwards onValueChange at most
   once per animation frame (S-13 subscribeFrame coalescing) and the drag
   causes no long tasks. The DragProbe story re-dispatches each forwarded
   change as an `ag-slider-change` window event; a rAF counter stamps each
   event with the frame it landed in. */
test.describe('slider drag perf (REQ-CMP-51)', () => {
  test('Slider drag: <= 1 onValueChange per frame, 0 long tasks', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-slider--drag-probe');
    const control = page.locator('.ag-slider [data-ag-part="control"]').first();
    const box = await control.boundingBox();
    expect(box).not.toBeNull();
    await page.evaluate(() => {
      const rec = { frame: 0, perFrame: new Map<number, number>(), total: 0, rafId: 0, released: false };
      const tick = () => { rec.frame += 1; rec.rafId = requestAnimationFrame(tick); };
      rec.rafId = requestAnimationFrame(tick);
      /* the pointerup commit flushes the last pending value synchronously
         (REQ-CMP-51 'after any pending flush'); only in-drag frames count */
      window.addEventListener('pointerup', () => { rec.released = true; }, { capture: true });
      window.addEventListener('ag-slider-change', () => {
        if (rec.released) return;
        rec.total += 1;
        rec.perFrame.set(rec.frame, (rec.perFrame.get(rec.frame) ?? 0) + 1);
      });
      (window as unknown as { __agSliderDrag: typeof rec }).__agSliderDrag = rec;
    });
    const y = box!.y + box!.height / 2;
    const res = await perf.frames(page, {
      durationMs: 800,
      during: async () => {
        await page.mouse.move(box!.x + 4, y);
        await page.mouse.down();
        /* 120 pointermoves: many land inside one frame */
        await page.mouse.move(box!.x + box!.width - 4, y, { steps: 120 });
        await page.mouse.up();
      },
    });
    const stats = await page.evaluate(() => {
      const rec = (window as unknown as { __agSliderDrag: { perFrame: Map<number, number>; total: number; rafId: number } }).__agSliderDrag;
      cancelAnimationFrame(rec.rafId);
      return { total: rec.total, maxPerFrame: Math.max(0, ...rec.perFrame.values()) };
    });
    expect(stats.total).toBeGreaterThan(0);
    expect(stats.maxPerFrame).toBeLessThanOrEqual(1);
    expect(res.longTasks).toBe(0);
  });
});

/* REQ-CMP-72: a 10,000-item Combobox opens, scrolls and filters with a
   bounded DOM (≤60 option nodes) and no long tasks. */
test.describe('combobox virtual perf (REQ-CMP-72)', () => {
  test('Combobox 10,000 items: <=60 option nodes, 0 long tasks while scrolling and typing', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-combobox--virtualized');
    const input = page.getByRole('combobox', { name: 'Ticket' });
    await input.focus();
    await page.keyboard.press('ArrowDown');
    const options = page.locator('[role="option"]');
    await expect(options.first()).toBeVisible();
    expect(await options.count()).toBeLessThanOrEqual(60);
    const scroller = page.locator('.ag-combobox-vscroll').first();
    const res = await perf.frames(page, {
      durationMs: 1000,
      during: async () => {
        for (let i = 1; i <= 10; i++) {
          await scroller.evaluate((el, top) => { el.scrollTop = top; }, i * 3000);
          await page.waitForTimeout(16);
        }
        await input.pressSequentially('Item 99', { delay: 20 });
      },
    });
    expect(await options.count()).toBeLessThanOrEqual(60);
    await expect(options.first()).toHaveAttribute('aria-setsize', String(Array.from({ length: 10_000 }, (_, i) => `Item ${i + 1}`).filter((s) => s.includes('Item 99')).length));
    expect(res.p95Ms).toBeLessThanOrEqual(50);
    expect(res.longTasks).toBe(0);
  });
});
