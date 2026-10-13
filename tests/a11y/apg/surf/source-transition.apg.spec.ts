// source-transition.apg.spec.ts — REQ-SURF-196 / REQ-SURF-65: APG keyboard
// interface practice (managing focus) over the shipped Focusable subject:
// activating the focusable source moves focus to the destination's first
// focusable element. Remote lane; a missing subject or story fails.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';
import { apg } from '../harness';

const SUBJECT = 'SourceTransition';

async function openFocusable(page: Page) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => (s.subject === SUBJECT || s.id === 'surf-source-transition--focusable') && s.id.endsWith('--focusable'));
  if (!subject) throw new Error(`${SUBJECT} --focusable story not registered`);
  await gotoStory(page, subject.id);
}

test.describe('APG source transition (SURF)', () => {
  test('focus follows the morph from source to destination', async ({ page }) => {
    await openFocusable(page);
    const open = page.getByRole('button', { name: 'Open card' });
    await open.focus();
    await expect(open).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('link', { name: 'Card detail' })).toBeFocused();
    await apg.axe(page);
  });
});
