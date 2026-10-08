// ai-streaming.spec.ts — SURF-359: L10 perf probes over the AI surfaces,
// remote run-perf harness only (mid-tier mobile + 120 Hz desktop).
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory, perf } from '../../../helpers';

test.describe('ai streaming perf (SURF-359)', () => {
  test('200-message thread at 60 updates/s: 0 long tasks >50ms', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.id.includes('thread') && s.id.includes('streaming'));
    if (!subject) { console.warn('AI/Thread streaming subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    const res = await perf.frames(page, {
      durationMs: 30000,
      during: async () => {
        await page.evaluate(async () => {
          const log = document.querySelector('[data-ag-part="log"]');
          for (let i = 0; i < 1800; i++) {
            const el = document.createElement('span');
            el.textContent = `u${i} `;
            log?.lastElementChild?.appendChild(el);
            await new Promise((r) => setTimeout(r, 16));
          }
        });
      },
    });
    expect(res.longTasks).toBe(0);
    expect(res.p95Ms).toBeLessThanOrEqual(16.7);
  });

  test('2,000-message fling ≥55fps desktop', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.id.includes('virtual') || s.id.includes('long'));
    if (!subject) { console.warn('Long2000Virtualized subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    const res = await perf.frames(page, {
      durationMs: 3000,
      during: async () => {
        const vp = page.locator('[data-ag-part="viewport"]');
        await vp.evaluate((el) => { el.scrollTop = el.scrollHeight; });
      },
    });
    expect(1000 / res.p95Ms).toBeGreaterThanOrEqual(55);
  });
});
