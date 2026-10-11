// ai-streaming.spec.ts — SURF-359 / REQ-SURF-113: L10 perf probes over the AI
// surfaces, remote run-perf harness only (mid-tier mobile + 120 Hz desktop).
// A missing story fails the spec.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory, perf } from '../../../helpers';

async function openStory(page: Page, id: string) {
  const subjects = await listSubjects();
  const subject = subjects.find((s) => s.id === id);
  expect(subject, `story ${id} must be registered in the Storybook index`).toBeDefined();
  await gotoStory(page, subject!.id);
}

test.describe('ai streaming perf (SURF-359)', () => {
  test('200 messages, last streaming at 60 updates/s for 30 s: 0 long tasks >50ms', async ({ page }) => {
    await openStory(page, 'ai-message--streaming-in-200');
    await expect(page.locator('[data-ag-part="message"]')).toHaveCount(200);
    await page.waitForFunction(() => '__agStreamingText' in window);
    const res = await perf.frames(page, {
      durationMs: 30000,
      during: async () => {
        // Tokens arrive through the StreamingText handle (React path), not by
        // DOM mutation: 1,800 updates at ~16 ms intervals.
        await page.evaluate(async () => {
          const sink = (window as unknown as { __agStreamingText: { append(c: string): void } }).__agStreamingText;
          for (let i = 0; i < 1800; i++) {
            sink.append(`u${i} `);
            await new Promise((r) => setTimeout(r, 16));
          }
        });
      },
    });
    const text = await page.locator('[data-ag-part="message"]').last().locator('[data-ag-part="text"]').textContent();
    expect(text?.endsWith('u1799 ')).toBe(true);
    expect(res.longTasks).toBe(0);
    expect(res.p95Ms).toBeLessThanOrEqual(16.7);
  });

  test('2,000-message fling ≥55fps desktop', async ({ page }) => {
    await openStory(page, 'ai-thread--long-2000-virtualized');
    const log = page.locator('[role="log"]');
    await expect(log).toHaveCount(1);
    const res = await perf.frames(page, {
      durationMs: 3000,
      during: async () => {
        // A 3 s fling: scroll from the top to the bottom, one step per frame.
        await log.evaluate((el) => new Promise<void>((resolve) => {
          el.scrollTop = 0;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / 3000);
            el.scrollTop = t * (el.scrollHeight - el.clientHeight);
            if (t < 1) requestAnimationFrame(tick); else resolve();
          };
          requestAnimationFrame(tick);
        }));
      },
    });
    expect(1000 / res.p95Ms).toBeGreaterThanOrEqual(55);
  });
});
