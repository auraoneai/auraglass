// tool-call.apg.spec.ts — SURF-385: APG keyboard spec for AI/ToolCall.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory, apg } from '../../../helpers';

test.describe('tool-call APG (SURF-385)', () => {
  test('approval buttons reachable and expandable regions labelled', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'ToolCall');
    if (!subject) throw new Error('ToolCall subject not registered');
    await gotoStory(page, subject.id);
    await expect(page.locator('[data-ag-part="tool-call"]').first()).toBeVisible();
    await apg.keyboard(page, [
      { press: 'Tab' },
      { press: 'Enter' },
      { press: 'Escape' },
    ]);
    await apg.axe(page);
  });
});
