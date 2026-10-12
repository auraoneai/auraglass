// pagination.apg.spec.ts — REQ-SURF-196: APG landmark/breadcrumb-style
// navigation script over the shipped Pagination subjects. Link mode exposes
// one aria-current="page" link and ?page= hrefs; button mode (Buttons story)
// moves aria-current with the Next/Previous buttons. Remote lane; a missing
// subject or story fails the test.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';
import { apg } from '../harness';

const SUBJECT = 'Pagination';

async function openStory(page: Page, suffix: string) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => (s.subject === SUBJECT || s.id.startsWith('surf-pagination--')) && s.id.endsWith(suffix));
  if (!subject) throw new Error(`${SUBJECT} ${suffix} story not registered`);
  await gotoStory(page, subject.id);
}

test.describe('APG pagination (SURF)', () => {
  test('link mode: labelled nav, one current page, page hrefs', async ({ page }) => {
    await openStory(page, '--default');
    const nav = page.getByRole('navigation');
    await expect(nav).toHaveCount(1);
    const current = nav.locator('[aria-current="page"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveText('5');
    await expect(nav.getByRole('link', { name: '6', exact: true })).toHaveAttribute('href', '?page=6');
    await apg.axe(page);
  });

  test('button mode: Next and Previous move aria-current', async ({ page }) => {
    await openStory(page, '--buttons');
    const nav = page.getByRole('navigation', { name: 'Results pages' });
    await expect(nav.locator('[aria-current="page"]')).toHaveText('5');
    const next = nav.getByRole('button', { name: /next/i });
    await next.focus();
    await expect(next).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(nav.locator('[aria-current="page"]')).toHaveText('6');
    await nav.getByRole('button', { name: /previous/i }).click();
    await expect(nav.locator('[aria-current="page"]')).toHaveText('5');
    await apg.axe(page);
  });
});
