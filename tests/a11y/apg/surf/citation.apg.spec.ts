// citation.apg.spec.ts — SURF-386 / REQ-SURF-124/125: APG keyboard spec for
// AI/Sources Citation through the shared apg harness (QUAL L5). A missing
// story fails the test.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory, apg } from '../../../helpers';

async function openStory(page: Page, id: string) {
  const subjects = await listSubjects();
  const subject = subjects.find((s) => s.id === id);
  expect(subject, `story ${id} must be registered in the Storybook index`).toBeDefined();
  await gotoStory(page, subject!.id);
  await expect(page.locator('[data-ag-part="citation"]').first()).toBeVisible();
}

test.describe('citation APG (SURF-386)', () => {
  test('focus opens the preview (no popup role); Escape closes it and focus stays on the citation', async ({ page }) => {
    await openStory(page, 'ai-sources--citation-in-message');
    const cite = page.getByRole('link', { name: 'Source 1: Reference 1' });
    await apg.keyboard(page, [{ press: 'Tab', expectFocus: 'citation' }]);
    await expect(cite).toBeFocused();
    const preview = page.locator('[data-ag-part="citation-preview"]');
    await expect(preview).toBeVisible();
    await expect(preview.locator('[data-ag-part="citation-preview-title"]')).toHaveText('Reference 1');
    await expect(preview.locator('[data-ag-part="citation-preview-snippet"]')).toContainText('Excerpt 1');
    await expect(preview.locator('[data-ag-part="citation-preview-host"]')).toHaveText('docs.internal');
    await expect(page.locator('[role="dialog"], [role="tooltip"]')).toHaveCount(0);
    await expect(cite).toHaveAttribute('aria-describedby', (await preview.getAttribute('id'))!);
    await apg.axe(page);
    await apg.keyboard(page, [{ press: 'Escape' }]);
    await expect(preview).toHaveCount(0);
    await expect(cite).toBeFocused();
  });

  test('Tab moves citation → citation → list trigger; blur closes the preview', async ({ page }) => {
    await openStory(page, 'ai-sources--citation-in-message');
    await apg.keyboard(page, [{ press: 'Tab', expectFocus: 'citation' }, { press: 'Tab', expectFocus: 'citation' }]);
    await expect(page.getByRole('link', { name: 'Source 4: Reference 4' })).toBeFocused();
    await apg.keyboard(page, [{ press: 'Tab', expectFocus: 'trigger' }]);
    await expect(page.locator('[data-ag-part="citation-preview"]')).toHaveCount(0);
  });

  test('Enter on a citation expands the collapsed SourceList and focuses the cited item', async ({ page }) => {
    await openStory(page, 'ai-sources--citation-in-message');
    const listTrigger = page.locator('[data-ag-part="source-list"] > [data-ag-part="trigger"]');
    await expect(listTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(listTrigger).toHaveText(/4 sources/);
    await apg.keyboard(page, [{ press: 'Tab' }, { press: 'Tab', expectFocus: 'citation' }, { press: 'Enter' }]);
    await expect(listTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#ag-src-cite-msg-s4')).toBeFocused();
    await apg.axe(page);
  });
});
