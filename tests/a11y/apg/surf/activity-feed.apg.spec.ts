// REQ-SURF-97 (remote Playwright, L5): ActivityFeed semantics on the built
// Storybook (src/components/timeline/ActivityFeed.stories.tsx). Day headings
// are real headings at the configured level, every item is a list item
// exposing a machine-readable <time>, actors' avatars are decorative, Load
// more is a keyboard-operable button that appends without announcing, and
// prepends announce once per 2 s window. Fails — never skips — when a story
// is missing.
import { test, expect, type Page } from '@playwright/test';
import { gotoStory, listSubjects } from '../../../helpers';

async function gotoFeedStory(page: Page, suffix: string) {
  const subjects = await listSubjects({});
  const story = subjects.find((s) => (s.subject === 'ActivityFeed' || s.subject === 'activity-feed') && s.id.endsWith(`--${suffix}`));
  expect(story, `ActivityFeed story --${suffix} must be registered`).toBeDefined();
  await gotoStory(page, story!.id);
  const feed = page.locator('[data-ag-part="activity-feed"]');
  await expect(feed).toHaveCount(1);
  return feed;
}

test.describe('activity feed APG (REQ-SURF-97)', () => {
  test('day headings are level-3 headings; list items expose time', async ({ page }) => {
    const feed = await gotoFeedStory(page, 'grouped-by-day');
    const headings = feed.getByRole('heading', { level: 3 });
    await expect(headings).toHaveText(['Oct 2, 2026', 'Oct 1, 2026', 'Sep 30, 2026']);
    const lists = feed.getByRole('list');
    await expect(lists).toHaveCount(3);
    const items = feed.getByRole('listitem');
    await expect(items).toHaveCount(6);
    for (let i = 0; i < 6; i++) {
      const time = items.nth(i).locator('time');
      await expect(time).toHaveCount(1);
      await expect(time).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    }
    // intent by text: the success/danger items name their intent
    await expect(items.nth(0)).toContainText('Success: Merged PR 512');
    await expect(items.nth(2)).toContainText('Error: Pipeline failed');
    // avatars are decorative next to the visible name
    await expect(feed.locator('[data-ag-part="activity-actor"] .ag-avatar[aria-hidden="true"]')).toHaveCount(6);
    await expect(feed.getByRole('img')).toHaveCount(0);
  });

  test('Load more: Tab reaches it, Enter appends, no announcement', async ({ page }) => {
    const feed = await gotoFeedStory(page, 'load-more');
    const status = feed.getByRole('status');
    const more = feed.getByRole('button', { name: 'Load more' });
    await expect(feed.getByRole('listitem')).toHaveCount(4);
    await more.focus();
    await expect(more).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(feed.getByRole('listitem')).toHaveCount(6);
    await expect(more).toHaveCount(0); // no more pages
    await page.waitForTimeout(2500);
    await expect(status).toHaveText('');
  });

  test('prepends announce once per 2 s window: "3 new activities"', async ({ page }) => {
    const feed = await gotoFeedStory(page, 'default');
    const status = feed.getByRole('status');
    await expect(status).toHaveAttribute('aria-live', 'polite');
    await page.getByTestId('feed-prepend').click();
    await expect(feed.getByRole('listitem')).toHaveCount(7);
    await expect(status).toHaveText('');
    await expect(status).toHaveText('3 new activities', { timeout: 4000 });
  });
});
