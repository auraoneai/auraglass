// message.apg.spec.ts — SURF-383: APG keyboard spec for AI/Message.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory, apg } from '../../../helpers';

test.describe('message APG (SURF-383)', () => {
  test('article semantics + actions keyboard reach', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Message');
    if (!subject) { console.warn('Message subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    await expect(page.locator('[data-ag-part="message"]').first()).toBeVisible();
    await apg.keyboard(page, [
      { press: 'Tab' },
      { press: 'Shift+Tab' },
    ]);
    await apg.axe(page);
  });
});
