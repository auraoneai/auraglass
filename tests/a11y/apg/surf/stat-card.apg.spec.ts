// stat-card.apg.spec.ts — REQ-SURF-196: APG link/text-alternative script
// over the shipped StatCard Basic subject: each card's label and formatted
// value are text, the delta direction is not colour-only, and the href card
// is a real link in the tab order. Remote lane; a missing subject fails.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';
import { apg } from '../harness';

const SUBJECT = 'StatCard';

async function openBasic(page: Page) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => (s.subject === SUBJECT || s.id === 'surf-stat-card--basic') && s.id.endsWith('--basic'));
  if (!subject) throw new Error(`${SUBJECT} --basic story not registered`);
  await gotoStory(page, subject.id);
}

test.describe('APG stat card (SURF)', () => {
  test('labels, values and deltas are text; the href card is a link', async ({ page }) => {
    await openBasic(page);
    const cards = page.locator('[data-ag-part="stat-card"]');
    await expect(cards).toHaveCount(3);
    await expect(cards.nth(0)).toContainText('Revenue');
    await expect(cards.nth(0)).toContainText('128,430');
    // Delta direction is announced as text, not conveyed by colour alone.
    await expect(cards.nth(0)).toContainText(/up|increase|▲|↑/i);
    const link = page.getByRole('link');
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAttribute('href', '/analytics');
    await link.focus();
    await expect(link).toBeFocused();
    await apg.axe(page);
  });
});
