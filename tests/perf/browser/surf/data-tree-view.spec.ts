// REQ-SURF-83 (remote Playwright, perf lane): expand-all of the 5,000-node
// TreeView Virtual5000 story, measured with performance marks from the click
// to the second animation frame after it (the frame after commit has
// painted). Budget: <= 150 ms on desktop. The measured duration is attached
// to the test result. Fails — never skips — when the story is not in the
// built Storybook.
import { test, expect, type Page } from '@playwright/test';
import { gotoStory, listSubjects } from '../../../helpers';
import { TREE_ITEM_SELECTOR, TREE_ROLE } from '../../../../src/data/tree-view/treeSemantics';

const EXPAND_ALL_BUDGET_MS = 150;

async function gotoVirtualStory(page: Page) {
  const subjects = await listSubjects({});
  const story = subjects.find((s) => (s.subject === 'TreeView' || s.subject === 'tree-view') && s.id.endsWith('--virtual-5000'));
  expect(story, 'TreeView Virtual5000 story must be registered').toBeDefined();
  await gotoStory(page, story!.id);
}

test.describe('tree view perf (REQ-SURF-83)', () => {
  test('expand-all of 5,000 nodes <= 150 ms (desktop)', async ({ page }, testInfo) => {
    await gotoVirtualStory(page);
    const tree = page.locator(`[role="${TREE_ROLE}"]`);
    await expect(tree.locator(TREE_ITEM_SELECTOR).first()).toHaveAttribute('aria-expanded', 'false');

    const durationMs = await page.evaluate(async () => {
      const button = document.querySelector<HTMLButtonElement>('[data-testid="tree-expand-all"]');
      if (button === null) throw new Error('expand-all control missing');
      performance.mark('ag-tree-expand-all:start');
      button.click();
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      performance.mark('ag-tree-expand-all:end');
      return performance.measure('ag-tree-expand-all', 'ag-tree-expand-all:start', 'ag-tree-expand-all:end').duration;
    });

    // the measurement covered a real expansion
    await expect(tree.locator(TREE_ITEM_SELECTOR).first()).toHaveAttribute('aria-expanded', 'true');
    await expect(tree.locator(TREE_ITEM_SELECTOR).nth(1)).toHaveAttribute('aria-level', '2');
    expect(await tree.locator(TREE_ITEM_SELECTOR).count()).toBeLessThanOrEqual(40);

    await testInfo.attach('tree-expand-all.json', {
      contentType: 'application/json',
      body: JSON.stringify({ subject: 'TreeView', story: 'Virtual5000', nodes: 5000, durationMs, budgetMs: EXPAND_ALL_BUDGET_MS, project: testInfo.project.name }),
    });
    expect(durationMs).toBeLessThanOrEqual(EXPAND_ALL_BUDGET_MS);
  });
});
