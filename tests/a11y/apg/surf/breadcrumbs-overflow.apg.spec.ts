// breadcrumbs-overflow.apg.spec.ts — SURF-079 / REQ-SURF-56 (REQ-FIN-82): the
// overflow trigger opens a menu of link items with Enter, and Escape returns
// focus to the trigger. Remote lane only; a missing subject fails the test.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';
import { apg } from '../harness';

const STORY = 'surf-breadcrumbs--overflow';

async function openStory(page: import('@playwright/test').Page) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => s.id === STORY);
  if (!subject) throw new Error(`${STORY} subject not registered`);
  await gotoStory(page, subject.id);
}

test.describe('APG breadcrumbs overflow (SURF)', () => {
  test('Enter opens a menu of links; Escape restores focus to the trigger', async ({ page }) => {
    await openStory(page);
    const trigger = page.getByRole('button', { name: 'Show 3 more' });
    await trigger.focus();
    await page.keyboard.press('Enter');
    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    const items = menu.getByRole('menuitem');
    await expect(items).toHaveCount(3);
    for (let i = 0; i < 3; i++) await expect(items.nth(i)).toHaveAttribute('href', /^\/docs/);
    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test('axe clean', async ({ page }) => {
    await openStory(page);
    await apg.axe(page);
  });
});
