// sidebar.apg.spec.ts — SURF-33/043: APG sidebar keyboard script over the shipped
// subject (surf/sidebar Anatomy: links + a Sidebar.Collapsible group).
// Remote lane; a missing subject or story fails the test.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';
import { apg } from '../harness';

const SUBJECT = 'Sidebar';
const STORY_SUFFIX = '--anatomy';

async function openAnatomy(page: import('@playwright/test').Page) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => s.subject === SUBJECT && s.id.endsWith(STORY_SUFFIX));
  if (!subject) throw new Error(`${SUBJECT} ${STORY_SUFFIX} story not registered`);
  await gotoStory(page, subject.id);
}

test.describe('APG sidebar (SURF)', () => {
  test('keyboard contract: Tab between links, Enter/Space toggle the group', async ({ page }) => {
    await openAnatomy(page);
    await apg.keyboard(page, SCRIPT);
    // The current destination keeps aria-current through the keyboard pass.
    const inbox = page.getByRole('link', { name: /Inbox/ });
    await expect(inbox).toHaveAttribute('aria-current', 'page');
  });

  test('group toggle reveals and hides its links', async ({ page }) => {
    await openAnatomy(page);
    const trigger = page.getByRole('button', { name: 'Archive' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('link', { name: '2026' })).toBeVisible();
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('link', { name: '2026' })).toBeHidden();
    await page.keyboard.press('Space');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('link', { name: '2026' })).toBeVisible();
  });

  test('axe clean (throws on any violation)', async ({ page }) => {
    await openAnatomy(page);
    await apg.axe(page);
  });
});

const SCRIPT = [
  { press: 'Tab', expectFocus: 'sidebar-item' },
  { press: 'Tab', expectFocus: 'trigger', expectState: { 'aria-expanded': 'true' } },
  { press: 'Enter', expectState: { 'aria-expanded': 'false' } },
  { press: 'Space', expectState: { 'aria-expanded': 'true' } },
  { press: 'Tab', expectFocus: 'sidebar-item' },
];
