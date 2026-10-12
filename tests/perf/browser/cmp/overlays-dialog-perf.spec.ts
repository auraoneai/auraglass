/* CMP-393 + CMP-396 + REQ-CMP-90 (lane 3i-Q). Remote perf lane only —
   AG_REMOTE_RUNNER=1. 4x CPU throttle; open_ms = click → first rAF with the
   popup painted (<=100ms); longtask windows A (enter: 0 tasks >50ms) and B
   (5s settle: <=2 tasks, total <=150ms, none >80ms). Real story ids.
   SURF palette row: REQ-CMP-79/82 over every palette subject listSubjects()
   finds; none found throws `pending:` (not skip-as-pass, not a failure). */
import { test, expect } from '@playwright/test';
import { gotoStory, perf, listSubjects } from '../../../helpers/index';

// Remote-only (machine policy): a local run fails loudly instead of skipping (PRD §18).
if (process.env.AG_REMOTE_RUNNER !== '1') throw new Error('remote perf lane only: run on the remote runner (AG_REMOTE_RUNNER=1)');

const PERF_STORY = 'cmp-fixtures-dialog-perf--dialog-over-dashboard';

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

  /* REQ-CMP-90: REQ-CMP-79 (one scrim, top blur <=12px) and REQ-CMP-82 (idle
     is free) run over every SURF palette story listSubjects() finds. None
     found = `pending:` (pw-verdict reports PENDING below release scope), never
     a CMP failure. */
  test('CommandPalette subjects: one scrim (blur <=12px), <=3 blurred, idle is free', async ({ page }) => {
    const subjects = await listSubjects();
    const cp = subjects.filter((s) => /command-?palette/i.test(s.id));
    if (cp.length === 0) {
      throw new Error('pending: no SURF CommandPalette story in the SubjectIndex (producer: SURF, REQ-OVL-04/-06)');
    }
    for (const subject of cp) {
      await gotoStory(page, subject.id);
      const scrims = await page.evaluate(() => {
        const nodes = [...new Set(document.querySelectorAll(
          '.ag-scrim, [data-ag-layer="scrim"], [data-scrim], [data-ag-part="scrim"], [data-ag-part="backdrop"]',
        ))];
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const blurPx = (el: Element) => {
          const m = /blur\(([\d.]+)px\)/u.exec(getComputedStyle(el).backdropFilter);
          return m ? Number(m[1]) : 0;
        };
        const spanning = nodes.filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width >= vw - 1 && r.height >= vh - 1;
        });
        return {
          open: !!document.querySelector('[data-ag-part="command-palette"], [role="dialog"]'),
          count: spanning.length,
          blurred: spanning.filter((el) => blurPx(el) > 0).length,
          maxBlur: Math.max(0, ...spanning.map(blurPx)),
        };
      });
      // REQ-CMP-79: one scrim when open (none when closed), only the top one blurs, at <=12px
      expect(scrims.count, `${subject.id}: full-viewport scrims`).toBe(scrims.open ? 1 : 0);
      expect(scrims.blurred, `${subject.id}: blurred scrims`).toBeLessThanOrEqual(1);
      expect(scrims.maxBlur, `${subject.id}: scrim blur px`).toBeLessThanOrEqual(12);
      expect(await perf.blurredSurfaces(page), `${subject.id}: blurred surfaces`).toBeLessThanOrEqual(3);
      // REQ-CMP-82: no infinite animation and no live interval once settled
      const idle = await perf.settledIdle(page, { afterMs: 400 });
      expect(idle.infiniteAnimations, `${subject.id}: infinite animations`).toBe(0);
      expect(idle.intervals, `${subject.id}: live intervals`).toBe(0);
    }
  });
});
