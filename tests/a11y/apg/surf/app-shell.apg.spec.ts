// app-shell.apg.spec.ts — REQ-SURF-196: APG landmark/skip-link script over
// the shipped AppShell subjects (surf-app-shell SkipLink + Default). The
// skip link is the first tab stop and moves focus to Main; the default shell
// exposes exactly one banner, one navigation and one main landmark.
// Remote lane; a missing subject or story fails the test.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';
import { apg } from '../harness';

const SUBJECT = 'AppShell';

async function openStory(page: Page, suffix: string) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => (s.subject === SUBJECT || s.id.startsWith('surf-app-shell--')) && s.id.endsWith(suffix));
  if (!subject) throw new Error(`${SUBJECT} ${suffix} story not registered`);
  await gotoStory(page, subject.id);
}

test.describe('APG app shell (SURF)', () => {
  test('skip link is the first tab stop and moves focus to the main landmark', async ({ page }) => {
    await openStory(page, '--skip-link');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    const focusedMain = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      const main = document.querySelector('main, [data-ag-slot="main"]');
      return el !== null && main !== null && (el === main || main.contains(el));
    });
    expect(focusedMain).toBe(true);
  });

  test('landmark structure: one banner, one navigation, one main', async ({ page }) => {
    await openStory(page, '--default');
    await expect(page.getByRole('banner')).toHaveCount(1);
    await expect(page.getByRole('navigation', { name: 'Main' })).toHaveCount(1);
    await expect(page.getByRole('main')).toHaveCount(1);
    await apg.axe(page);
  });
});
