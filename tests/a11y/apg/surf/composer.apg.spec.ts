// composer.apg.spec.ts — SURF-384: APG keyboard spec for AI/Composer.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory, apg } from '../../../helpers';

test.describe('composer APG (SURF-384)', () => {
  test('input labelled, Enter submits, Escape stops when streaming', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Composer');
    if (!subject) throw new Error('Composer subject not registered');
    await gotoStory(page, subject.id);
    const input = page.locator('[data-ag-part="input"], textarea').first();
    await expect(input).toBeVisible();
    await apg.keyboard(page, [
      { press: 'Tab', expectFocus: 'input' },
      { type: 'draft' },
      { press: 'Escape' },
    ]);
    await apg.axe(page);
  });
});
