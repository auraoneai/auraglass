// date picker open perf (SURF L10 perf lane, REQ-SURF-101): frame p95 while
// the popover opens and the calendar mounts stays within the
// `surf/date-picker--default` frame-p95-ms budget, with no long task, and the
// popup is actually open at the end of the measurement.
import { test, expect } from '@playwright/test';
import { gotoStory, perf } from '../../../helpers';
import { requireStory } from '../../../e2e/surf/date/subjects';
import budgets from '../../../../fragments/perf-budgets/surf';

const BUDGET = budgets.find((b) => b.subject === 'surf/date-picker--default' && b.metric === 'frame-p95-ms');

test.describe('date picker open perf (REQ-SURF-101)', () => {
  test('popover open within the frame budget', async ({ page }) => {
    expect(BUDGET, 'surf/date-picker--default frame-p95-ms budget row').toBeTruthy();
    await gotoStory(page, await requireStory('DatePicker', 'default'));
    const trigger = page.getByRole('button', { name: 'Choose date' });
    await expect(trigger).toBeVisible();
    const dialog = page.getByRole('dialog', { name: 'Due date' });
    const res = await perf.frames(page, {
      durationMs: 1000,
      during: async () => {
        await trigger.click();
        await expect(dialog).toBeVisible();
        await expect(dialog.locator('.ag-calendar__cell[data-selected]')).toBeFocused();
        await page.waitForTimeout(500);
      },
    });
    await expect(dialog).toBeVisible();
    expect(res.longTasks).toBe(0);
    expect(res.p95Ms).toBeLessThanOrEqual(BUDGET!.max);
  });
});
