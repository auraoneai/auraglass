// REQ-SURF-87 (remote Playwright, L5): FilterBar APG/keyboard script on the
// WithQuickFilters story (src/data/filter-bar/FilterBar.stories.tsx, 6 seeded
// rules). Fails — never skips — when the story is not in the built Storybook.
// 600 px: inline chips, two-line clamp with an exact "+n more", Popover
// editor focus in/out, ToggleGroup aria-pressed. 375 px: chips collapse into
// "Filters (n)", which opens a bottom CMP Sheet and returns focus on Escape.
import { test, expect, type Page } from '@playwright/test';
import { gotoStory, listSubjects } from '../../../helpers';

const RULES = 6;

async function gotoQuickStory(page: Page) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const story = subjects.find((s) => s.subject === 'FilterBar' && s.id.endsWith('--with-quick-filters'));
  expect(story, 'FilterBar WithQuickFilters story must be registered').toBeDefined();
  await gotoStory(page, story!.id);
  await expect(page.locator('[data-ag-part="filter-bar"]')).toHaveCount(1);
}

test.describe('filter bar APG (REQ-SURF-87)', () => {
  test('600 px: chips, remove names, two-line clamp, popover editor focus, quick filters', async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 800 });
    await gotoQuickStory(page);
    const rules = page.locator('[data-ag-part="filter-rules"]');
    await expect(rules).toBeVisible();
    await expect(page.locator('[data-ag-part="filter-collapsed"]')).toBeHidden();

    const chips = rules.locator('[data-ag-part="filter-rule-chip"]');
    await expect(chips).toHaveCount(RULES);
    await expect(rules.getByRole('button', { name: /^Remove filter / })).toHaveCount(RULES);
    await expect(rules.getByRole('button', { name: 'Remove filter Name contains acme' })).toHaveCount(1);

    // Two-line clamp: the chip list is at most two chip rows tall, the chips
    // the clamp cuts are exactly the [data-ag-clamped] ones, and "+n more"
    // names that count.
    const clamp = await page.evaluate(() => {
      const list = document.querySelector<HTMLElement>('.ag-filter-bar__chips')!;
      const box = list.getBoundingClientRect();
      const all = Array.from(list.querySelectorAll<HTMLElement>(':scope > [data-ag-part="filter-rule-chip"]'));
      const below = all.filter((c) => c.getBoundingClientRect().bottom > box.bottom + 1).length;
      const chipH = all[0]!.getBoundingClientRect().height;
      return { height: box.height, chipH, below, clamped: list.querySelectorAll('[data-ag-clamped]').length };
    });
    expect(clamp.height).toBeLessThanOrEqual(2 * clamp.chipH + 8);
    expect(clamp.below).toBeGreaterThan(0);
    expect(clamp.clamped).toBe(clamp.below);
    const more = page.locator('[data-ag-part="filter-more"]');
    await expect(more).toBeVisible();
    await expect(more).toHaveText(`+${clamp.below} more`);
    await expect(more).toHaveAttribute('aria-expanded', 'false');
    await more.click();
    await expect(more).toHaveAttribute('aria-expanded', 'true');
    await expect(rules.locator('[data-ag-clamped]')).toHaveCount(0);
    for (let i = 0; i < RULES; i++) await expect(chips.nth(i)).toBeVisible();

    // Popover editor: Enter opens a dialog focused on its first field;
    // Escape closes it and focus returns to the chip.
    const edit = chips.first().locator('[data-ag-part="filter-rule-edit"]');
    await edit.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel('Operator')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(edit).toBeFocused();

    // Quick filters: Space toggles aria-pressed and the matching chip.
    const quick = page.getByRole('button', { name: 'Qty > 100' });
    await expect(quick).toHaveAttribute('aria-pressed', 'false');
    await quick.focus();
    await page.keyboard.press('Space');
    await expect(quick).toHaveAttribute('aria-pressed', 'true');
    await expect(chips).toHaveCount(RULES + 1);
    await page.keyboard.press('Space');
    await expect(quick).toHaveAttribute('aria-pressed', 'false');
    await expect(chips).toHaveCount(RULES);
  });

  test("375 px: chips collapse into 'Filters (n)' opening a bottom sheet; Escape returns focus", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await gotoQuickStory(page);
    await expect(page.locator('[data-ag-part="filter-rules"]')).toBeHidden();
    const trigger = page.locator('[data-ag-part="filter-collapsed"]');
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveText(`Filters (${RULES})`);
    const tb = (await trigger.boundingBox())!;
    expect(tb.height).toBeGreaterThanOrEqual(44);

    await trigger.focus();
    await page.keyboard.press('Enter');
    const sheet = page.locator('.ag-filter-bar__sheet');
    await expect(sheet).toBeVisible();
    await expect(sheet).toHaveAttribute('role', 'dialog');
    await expect(sheet).toHaveAttribute('data-ag-side', 'bottom');
    await expect(sheet.locator('[data-ag-part="filter-rule-chip"]')).toHaveCount(RULES);
    await expect(sheet.getByRole('button', { name: /^Remove filter / })).toHaveCount(RULES);
    await page.keyboard.press('Escape');
    await expect(sheet).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});
