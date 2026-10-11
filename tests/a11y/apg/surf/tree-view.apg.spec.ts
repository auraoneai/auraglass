// REQ-SURF-82 (remote Playwright, L5): APG tree keyboard script on the
// TreeView Keyboard story (src/data/tree-view/TreeView.stories.tsx). Fails —
// never skips — when the story is not in the built Storybook. Roles come from
// src/data/tree-view/treeSemantics.ts (OD-20 default: treegrid / row).
import { test, expect, type Page } from '@playwright/test';
import { gotoStory, listSubjects } from '../../../helpers';
import { TREE_ITEM_SELECTOR, TREE_ROLE } from '../../../../src/data/tree-view/treeSemantics';

async function gotoKeyboardStory(page: Page) {
  const subjects = await listSubjects({});
  const story = subjects.find((s) => (s.subject === 'TreeView' || s.subject === 'tree-view') && s.id.endsWith('--keyboard'));
  expect(story, 'TreeView Keyboard story must be registered').toBeDefined();
  await gotoStory(page, story!.id);
}

const focusedKey = (page: Page) =>
  page.evaluate(() => (document.activeElement as HTMLElement | null)?.getAttribute('data-key') ?? null);

test.describe('tree view APG (REQ-SURF-82)', () => {
  test('tree: keyboard script', async ({ page }) => {
    await gotoKeyboardStory(page);
    const tree = page.locator(`[role="${TREE_ROLE}"]`);
    await expect(tree).toHaveCount(1);
    const item = (key: string) => tree.locator(`${TREE_ITEM_SELECTOR}[data-key="${key}"]`);
    await expect(tree.locator(TREE_ITEM_SELECTOR)).toHaveCount(4);

    // one tab stop: Before -> first item -> After
    await page.getByTestId('before-tree').focus();
    await page.keyboard.press('Tab');
    expect(await focusedKey(page)).toBe('apple');
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('after-tree')).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    expect(await focusedKey(page)).toBe('apple');

    // Down / Up / End / Home
    await page.keyboard.press('ArrowDown');
    expect(await focusedKey(page)).toBe('banana');
    await page.keyboard.press('ArrowUp');
    expect(await focusedKey(page)).toBe('apple');
    await page.keyboard.press('End');
    expect(await focusedKey(page)).toBe('date');
    await page.keyboard.press('Home');
    expect(await focusedKey(page)).toBe('apple');

    // Right expands, Right again enters the first child
    await expect(item('apple')).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('ArrowRight');
    await expect(item('apple')).toHaveAttribute('aria-expanded', 'true');
    expect(await focusedKey(page)).toBe('apple');
    await page.keyboard.press('ArrowRight');
    expect(await focusedKey(page)).toBe('apricot');
    await expect(item('apricot')).toHaveAttribute('aria-level', '2');

    // Left on a child goes to the parent, Left again collapses it
    await page.keyboard.press('ArrowLeft');
    expect(await focusedKey(page)).toBe('apple');
    await page.keyboard.press('ArrowLeft');
    await expect(item('apple')).toHaveAttribute('aria-expanded', 'false');
    expect(await focusedKey(page)).toBe('apple');

    // '*' expands every expandable sibling, leaves the leaf alone
    await page.keyboard.press('*');
    for (const k of ['apple', 'banana', 'date']) await expect(item(k)).toHaveAttribute('aria-expanded', 'true');
    expect(await item('cherry').getAttribute('aria-expanded')).toBeNull();
    await expect(item('avocado')).toHaveAttribute('aria-expanded', 'false');

    // every item: aria-level / aria-setsize / aria-posinset; parents: aria-expanded
    const attrs = await tree.locator(TREE_ITEM_SELECTOR).evaluateAll((rows) =>
      rows.map((r) => ({
        key: r.getAttribute('data-key'),
        level: r.getAttribute('aria-level'),
        posinset: r.getAttribute('aria-posinset'),
        setsize: r.getAttribute('aria-setsize'),
        expanded: r.getAttribute('aria-expanded'),
      })),
    );
    expect(attrs).toEqual([
      { key: 'apple', level: '1', posinset: '1', setsize: '4', expanded: 'true' },
      { key: 'apricot', level: '2', posinset: '1', setsize: '2', expanded: null },
      { key: 'avocado', level: '2', posinset: '2', setsize: '2', expanded: 'false' },
      { key: 'banana', level: '1', posinset: '2', setsize: '4', expanded: 'true' },
      { key: 'blueberry', level: '2', posinset: '1', setsize: '1', expanded: null },
      { key: 'cherry', level: '1', posinset: '3', setsize: '4', expanded: null },
      { key: 'date', level: '1', posinset: '4', setsize: '4', expanded: 'true' },
      { key: 'medjool', level: '2', posinset: '1', setsize: '1', expanded: null },
    ]);

    // type-ahead within 1000 ms; after a pause a new search starts
    await page.keyboard.press('c');
    expect(await focusedKey(page)).toBe('cherry');
    await page.waitForTimeout(1100);
    await page.keyboard.type('me');
    expect(await focusedKey(page)).toBe('medjool');
    await page.waitForTimeout(1100);

    // Enter fires onAction (the story logs it); Space toggles aria-selected
    await page.keyboard.press('Home');
    await page.keyboard.press('ArrowDown');
    expect(await focusedKey(page)).toBe('apricot');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('tree-action-log')).toHaveText('action:apricot');
    await expect(item('apricot')).toHaveAttribute('aria-selected', 'false');
    await page.keyboard.press('Space');
    await expect(item('apricot')).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Space');
    await expect(item('apricot')).toHaveAttribute('aria-selected', 'false');
    await expect(page.getByTestId('tree-action-log')).toHaveText('action:apricot');
  });
});
