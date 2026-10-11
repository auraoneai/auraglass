// command-5000.spec.ts — SURF-089 / REQ-SURF-63 (REQ-FIN-82): a 5,000-item
// Command keeps input->paint p95 <= 50 ms while typing and renders <= 30
// option nodes (virtualized above 100 visible). Remote perf lane only; a
// missing subject fails the test. The timing is measured in the page (event
// timeStamp -> the frame after the commit), never hand-entered.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

const STORY = 'surf-command--five-thousand';
const BUDGET_P95_MS = 50;

test.describe('command-5000.spec.ts (SURF)', () => {
  test('5,000 items: input->paint p95 <= 50 ms and <= 30 option nodes', async ({ page }, testInfo) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.id === STORY);
    if (!subject) throw new Error(`${STORY} subject not registered`);
    await gotoStory(page, subject.id);
    const input = page.getByRole('combobox');
    await expect(input).toBeVisible();
    const optionCount = () => page.locator('[role="option"]').count();
    expect(await optionCount()).toBeGreaterThan(0);
    expect(await optionCount()).toBeLessThanOrEqual(30);

    await page.evaluate(() => {
      const samples: number[] = [];
      (window as unknown as { __agInputPaint: number[] }).__agInputPaint = samples;
      const el = document.querySelector<HTMLInputElement>('[role="combobox"]')!;
      el.addEventListener(
        'input',
        (e) => {
          const t0 = e.timeStamp;
          // next frame after React's commit = first paint that can show it
          requestAnimationFrame(() => setTimeout(() => samples.push(performance.now() - t0), 0));
        },
        { capture: true },
      );
    });

    await input.focus();
    const queries = ['c', 'co', 'com', 'comm', 'comma', 'comman', 'command', 'command ', 'command 4', 'command 49'];
    for (let round = 0; round < 3; round++) {
      for (const q of queries) {
        await input.fill(q);
        await page.waitForTimeout(30);
      }
      await input.fill('');
      await page.waitForTimeout(30);
    }
    await page.waitForTimeout(200);
    const samples = await page.evaluate(() => (window as unknown as { __agInputPaint: number[] }).__agInputPaint);
    expect(samples.length).toBeGreaterThanOrEqual(30);
    const sorted = [...samples].sort((a, b) => a - b);
    const p95 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))]!;
    await testInfo.attach('command-5000.json', {
      body: JSON.stringify({ samples: samples.length, p95Ms: p95, budgetMs: BUDGET_P95_MS }),
      contentType: 'application/json',
    });
    expect(p95).toBeLessThanOrEqual(BUDGET_P95_MS);

    // keyboard to the last item keeps the active descendant resolvable
    await input.fill('');
    await input.press('ArrowDown');
    await input.press('ArrowUp');
    const id = await input.getAttribute('aria-activedescendant');
    expect(id).toMatch(/item-cmd-4999$/);
    await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
    expect(await optionCount()).toBeLessThanOrEqual(30);
  });
});
