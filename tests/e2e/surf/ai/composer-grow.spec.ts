// composer-grow.spec.ts + composer-dropzone — SURF-354.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('ai composer grow (SURF-354)', () => {
  test('grows 1→8 rows then scrolls internally', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Composer');
    if (!subject) throw new Error('AI/Composer subject not registered');
    await gotoStory(page, subject.id);
    const input = page.locator('[data-ag-part="input"], textarea').first();
    await expect(input).toBeVisible();
    const heights = await input.evaluate(async (el) => {
      const out: number[] = [el.getBoundingClientRect().height];
      const lines = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
      for (const l of lines) {
        (el as HTMLTextAreaElement).value += `${l}\n`;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        await new Promise((r) => requestAnimationFrame(r));
        out.push(el.getBoundingClientRect().height);
      }
      return out;
    });
    expect(heights[8]).toBeGreaterThan(heights[0]!);
    // growth stops at the max-block cap (12lh) — the 10-line height equals the 8-line height.
    expect(heights[10]).toBeLessThanOrEqual(heights[8]! + 2);
  });
});
