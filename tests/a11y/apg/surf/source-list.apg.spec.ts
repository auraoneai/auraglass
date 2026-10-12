// source-list.apg.spec.ts — REQ-SURF-196 / REQ-SURF-124: APG disclosure
// script over the shipped SourceList subjects. Three or fewer sources render
// open; more render closed behind a "{n} sources" trigger whose
// aria-expanded/aria-controls track the panel, opened from the keyboard.
// Remote lane; a missing subject or story fails the test.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';
import { apg } from '../harness';

const SUBJECT = 'SourceList';

async function openStory(page: Page, suffix: string) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => (s.subject === SUBJECT || s.id.startsWith('ai-sourcelist--')) && s.id.endsWith(suffix));
  if (!subject) throw new Error(`${SUBJECT} ${suffix} story not registered`);
  await gotoStory(page, subject.id);
}

test.describe('APG source list (SURF)', () => {
  test('three sources render open as links', async ({ page }) => {
    await openStory(page, '--three');
    const trigger = page.getByRole('button', { name: /3 sources/ });
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('[data-ag-part="source-link"]')).toHaveCount(3);
    await apg.axe(page);
  });

  test('twelve sources: keyboard disclosure opens the controlled panel', async ({ page }) => {
    await openStory(page, '--twelve');
    const trigger = page.getByRole('button', { name: /12 sources/ });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    const panelId = await trigger.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    const panel = page.locator(`#${panelId}`);
    await expect(panel.locator('[data-ag-part="source-link"]')).toHaveCount(12);
    await expect(panel).toBeHidden();
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
    await apg.axe(page);
  });
});
