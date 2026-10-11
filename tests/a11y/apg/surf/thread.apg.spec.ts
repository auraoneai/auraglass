// thread.apg.spec.ts — SURF-382: APG keyboard spec for AI/Thread through the
// shared apg harness (QUAL L5 imports these files).
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory, apg } from '../../../helpers';

test.describe('thread log APG (SURF-382)', () => {
  test('log landmark + jump-to-latest keyboard path', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Thread');
    if (!subject) throw new Error('Thread subject not registered');
    await gotoStory(page, subject.id);
    await expect(page.locator('[role="log"]')).toHaveCount(1);
    await apg.keyboard(page, [
      { press: 'Tab' },
      { press: 'End' },
      { press: 'Home' },
    ]);
    await apg.axe(page);
  });
});
