// top-bar.apg.spec.ts — REQ-SURF-196: APG landmark-regions script over the
// shipped TopBar subject (surf/top-bar Default): exactly one banner landmark
// holding the title, axe clean. Remote lane; a missing subject fails.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';
import { apg } from '../harness';

const SUBJECT = 'TopBar';

async function openDefault(page: Page) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => (s.subject === SUBJECT || s.id === 'surf-top-bar--default') && s.id.endsWith('--default'));
  if (!subject) throw new Error(`${SUBJECT} --default story not registered`);
  await gotoStory(page, subject.id);
}

test.describe('APG top bar (SURF)', () => {
  test('renders one banner landmark with the app title', async ({ page }) => {
    await openDefault(page);
    const banner = page.getByRole('banner');
    await expect(banner).toHaveCount(1);
    await expect(banner).toContainText('App');
    await apg.axe(page);
  });
});
