// REQ-SURF-86/87 (remote Playwright): FilterBar UrlSync story — chips render,
// removing a chip moves focus to the next chip and drops the rule from the
// serialized query; editing through the popover writes a typed JSON value.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

async function gotoUrlSync(page: Page) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const story = subjects.find((s) => s.subject === 'FilterBar' && s.id.endsWith('--url-sync'));
  expect(story, 'FilterBar UrlSync story must be registered').toBeDefined();
  await gotoStory(page, story!.id);
}

const query = (page: Page) => page.getByTestId('filter-query');

test.describe('filter bar e2e', () => {
  test('rule chips render; remove returns focus', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await gotoUrlSync(page);
    const rules = page.locator('[data-ag-part="filter-rules"]');
    const chips = rules.locator('[data-ag-part="filter-rule-chip"]');
    await expect(chips).toHaveCount(6);
    await expect(query(page)).toContainText(encodeURIComponent(JSON.stringify('acme')));

    await rules.getByRole('button', { name: 'Remove filter Name contains acme' }).click();
    await expect(chips).toHaveCount(5);
    await expect(rules.locator('[data-ag-part="filter-rule-edit"]').first()).toBeFocused();
    await expect(query(page)).not.toContainText('acme');
  });

  test('popover edit commits a typed value into the URL', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await gotoUrlSync(page);
    const chip = page.locator('[data-ag-part="filter-rules"] [data-ag-part="filter-rule-chip"]').filter({ hasText: 'Quantity between' });
    await chip.locator('[data-ag-part="filter-rule-edit"]').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByLabel('From').fill('1');
    await dialog.getByLabel('To').fill('2');
    await dialog.getByRole('button', { name: 'Apply' }).click();
    await expect(dialog).toBeHidden();
    await expect(chip.locator('[data-ag-part="filter-rule-edit"]')).toBeFocused();
    const params = new URLSearchParams((await query(page).textContent()) ?? '');
    const values = [...params.entries()].filter(([k]) => k.endsWith('.v')).map(([, v]) => JSON.parse(v) as unknown);
    expect(values).toContainEqual({ start: 1, end: 2 });
  });
});
