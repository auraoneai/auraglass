// sparkline.apg.spec.ts — REQ-SURF-196: APG graphics (img role) script over
// the shipped Sparkline Line subject: the svg carries role="img" whose
// accessible name summarises the data (label, point count and range), and it
// is not in the tab order. Remote lane; a missing subject fails.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';
import { apg } from '../harness';

const SUBJECT = 'Sparkline';

async function openLine(page: Page) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => (s.subject === SUBJECT || s.id === 'surf-sparkline--line') && s.id.endsWith('--line'));
  if (!subject) throw new Error(`${SUBJECT} --line story not registered`);
  await gotoStory(page, subject.id);
}

test.describe('APG sparkline (SURF)', () => {
  test('role=img with a data-summary accessible name, not focusable', async ({ page }) => {
    await openLine(page);
    const img = page.getByRole('img');
    await expect(img).toHaveCount(1);
    await expect(img).toHaveAttribute('aria-label', 'Weekly signups: 8 points, from 2 to 12, low 2, high 12');
    await expect(img).not.toHaveAttribute('tabindex', '0');
    await apg.axe(page);
  });
});
