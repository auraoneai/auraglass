// responsive cards — REQ-SURF-90: .ag-stat-card is an inline-size query
// container, so the sparkline hides when the card is <= 200px wide and shows
// otherwise. Remote L5 lane only; fails closed when the story is absent.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('responsive cards (REQ-SURF-90)', () => {
  test('StatCard hides its sparkline below a 200px container', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const story = subjects.find((s) => s.subject === 'StatCard' && s.id.endsWith('--narrow'));
    expect(story, 'StatCard Narrow story must be registered in the subject index').toBeTruthy();
    await gotoStory(page, story!.id);
    const narrow = page.locator('[data-testid="narrow"] [data-ag-part="stat-card"]');
    const wide = page.locator('[data-testid="wide"] [data-ag-part="stat-card"]');
    await expect(narrow).toBeVisible();
    await expect(wide).toBeVisible();
    const containerType = await narrow.evaluate((el) => getComputedStyle(el).containerType);
    expect(containerType).toBe('inline-size');
    await expect(narrow.locator('[data-ag-part="stat-card-sparkline"]')).toBeHidden();
    await expect(wide.locator('[data-ag-part="stat-card-sparkline"]')).toBeVisible();
  });
});
