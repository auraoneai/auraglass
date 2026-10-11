/* CMP-393 + CMP-396 + REQ-CMP-90 (lane 3i-Q). Remote perf lane only —
   AG_REMOTE_RUNNER=1. 4x CPU throttle; open_ms = click → first rAF with the
   popup painted (<=100ms); longtask windows A (enter: 0 tasks >50ms) and B
   (5s settle: <=2 tasks, total <=150ms, none >80ms). Real story ids.
   SURF palette row stays 'pending' (not skip-as-pass) until its stories land. */
import { test, expect } from '@playwright/test';
import { gotoStory, perf, listSubjects } from '../../../helpers/index';

test.skip(!process.env.AG_REMOTE_RUNNER, 'remote perf lane only (AG_REMOTE_RUNNER=1)');

const PERF_STORY = 'overlays-dialog--perf-dashboard';

test.describe('dialog perf (REQ-CMP-90)', () => {
  test('perf-dashboard: open_ms <=100 under 4x throttle + longtask windows', async ({ page }) => {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await gotoStory(page, PERF_STORY);

    // instrument: open_ms (click → first painted rAF) + longtask windows
    await page.evaluate(() => {
      const w = window as unknown as {
        __agPerf: { openedAt: number | null; paintedAt: number | null; a: number[]; b: number[] };
      };
      w.__agPerf = { openedAt: null, paintedAt: null, a: [], b: [] };
      const obs = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          const rec = w.__agPerf;
          const sinceOpen = rec.openedAt === null ? -1 : e.startTime - rec.openedAt;
          if (rec.paintedAt === null) rec.a.push(e.duration);
          else if (sinceOpen <= 5000) rec.b.push(e.duration);
        }
      });
      try { obs.observe({ entryTypes: ['longtask'] }); } catch { /* unsupported */ }
      const probe = (t: number) => {
        const rec = w.__agPerf;
        if (rec.paintedAt === null) {
          const popup = document.querySelector('[data-ag-part="popup"]');
          if (popup && popup.getBoundingClientRect().width > 0) rec.paintedAt = t;
          else requestAnimationFrame(probe);
        }
      };
      requestAnimationFrame(probe);
    });

    const t0 = await page.evaluate(() => {
      const w = window as unknown as { __agPerf: { openedAt: number | null } };
      w.__agPerf.openedAt = performance.now();
      return w.__agPerf.openedAt;
    });
    await page.getByRole('button', { name: 'Open dialog' }).click();
    await expect(page.locator('[data-ag-part="popup"]')).toBeVisible();

    const res = await page.evaluate(() => new Promise<{ openMs: number }>((done) => {
      const w = window as unknown as {
        __agPerf: { openedAt: number | null; paintedAt: number | null };
      };
      const check = () => {
        const rec = w.__agPerf;
        if (rec.paintedAt !== null && rec.openedAt !== null) done({ openMs: rec.paintedAt - rec.openedAt });
        else requestAnimationFrame(check);
      };
      requestAnimationFrame(check);
    }));

    // window B collects for 5s post-open
    await page.waitForTimeout(5000);
    const windows = await page.evaluate(() => {
      const w = window as unknown as { __agPerf: { a: number[]; b: number[] } };
      return w.__agPerf;
    });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });

    expect(res.openMs).toBeLessThanOrEqual(100);
    expect(windows.a.filter((d) => d > 50)).toHaveLength(0);
    expect(windows.b.length).toBeLessThanOrEqual(2);
    expect(windows.b.reduce((s, d) => s + d, 0)).toBeLessThanOrEqual(150);
    expect(Math.max(0, ...windows.b)).toBeLessThanOrEqual(80);
    void t0;
  });

  test('perf-dashboard: <=2 blurred layers; settled frame diff 0', async ({ page }) => {
    await gotoStory(page, PERF_STORY);
    await page.getByRole('button', { name: 'Open dialog' }).click();
    await expect(page.locator('[data-ag-part="popup"]')).toBeVisible();
    const blurred = await perf.blurredSurfaces(page);
    expect(blurred).toBeLessThanOrEqual(2);
    const idle = await perf.settledIdle(page, { afterMs: 400 });
    expect(idle.infiniteAnimations).toBe(0);
  });

  test('CommandPalette row reports pending until SURF stories land', async ({ page }) => {
    const subjects = await listSubjects();
    const cp = subjects.filter((s) => /command-?palette/i.test(s.id));
    if (cp.length === 0) {
      test.info().annotations.push({
        type: 'status',
        description: "pending — SURF CommandPalette stories not in SubjectIndex (REQ-OVL-04/-06)",
      });
      test.skip(true, 'pending: SURF CommandPalette stories not in SubjectIndex');
      return;
    }
    await gotoStory(page, cp[0]!.id);
    expect(await perf.blurredSurfaces(page)).toBeLessThanOrEqual(3);
  });
});
