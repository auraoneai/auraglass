// REQ-SURF-83 (remote Playwright, SURF e2e lane): the TreeView Virtual5000
// story (5,000 nodes, virtualize, 480px viewport). After "Expand all" every
// node is in the collection but at most 40 rows are in the DOM, and scrolling
// to the end brings the last node in. Fails — never skips — when the story
// is not in the built Storybook.
import { test, expect, type Page } from '@playwright/test';
import { gotoStory, listSubjects } from '../../../helpers';
import { TREE_ITEM_SELECTOR, TREE_ROLE } from '../../../../src/data/tree-view/treeSemantics';

async function gotoVirtualStory(page: Page) {
  const subjects = await listSubjects({});
  const story = subjects.find((s) => (s.subject === 'TreeView' || s.subject === 'tree-view') && s.id.endsWith('--virtual-5000'));
  expect(story, 'TreeView Virtual5000 story must be registered').toBeDefined();
  await gotoStory(page, story!.id);
}

test.describe('tree virtual (REQ-SURF-83)', () => {
  test('expand all 5,000 nodes: <= 40 rows rendered in a 480px container', async ({ page }) => {
    await gotoVirtualStory(page);
    const tree = page.locator(`[role="${TREE_ROLE}"]`);
    await expect(tree).toHaveCount(1);
    const box = await page.getByTestId('tree-viewport').boundingBox();
    expect(box?.height).toBe(480);

    const rows = tree.locator(TREE_ITEM_SELECTOR);
    await expect(rows.first()).toHaveAttribute('data-key', 'folder-0');
    await page.getByTestId('tree-expand-all').click();
    await expect(rows.first()).toHaveAttribute('aria-expanded', 'true');
    await expect(rows.nth(1)).toHaveAttribute('aria-level', '2');
    const expandedCount = await rows.count();
    expect(expandedCount).toBeGreaterThan(0);
    expect(expandedCount).toBeLessThanOrEqual(40);
    // the tree is the scroll container and its content is 5,000 rows tall
    const scroll = await tree.evaluate((el) => ({ scrollHeight: el.scrollHeight, clientHeight: el.clientHeight }));
    expect(scroll.clientHeight).toBeLessThanOrEqual(480);
    expect(scroll.scrollHeight).toBeGreaterThan(5000 * 20);

    // scroll to the end: the last node renders, the DOM stays bounded
    await tree.evaluate((el) => { el.scrollTop = el.scrollHeight; });
    await expect(tree.locator(`${TREE_ITEM_SELECTOR}[data-key="file-49-98"]`)).toHaveCount(1);
    const endCount = await rows.count();
    expect(endCount).toBeLessThanOrEqual(40);
  });
});
