// Timeline keyboard semantics (SURF L5 apg lane, REQ-SURF-96): a labelled
// ordered list of list items; the timeline adds no tab stops of its own, so
// Tab moves through the links inside its items in document order and skips
// the aria-hidden markers.
// Subject: src/components/timeline/Timeline.stories.tsx Keyboard (three linked items
// between a Before and an After button).
import { test, expect } from '@playwright/test';
import { gotoStory, listSubjects, apg } from '../../../helpers';

const KEYBOARD_STORY = 'surf-timeline--keyboard';

test.describe('timeline keyboard (REQ-SURF-96)', () => {
  test('list semantics; Tab visits only the item links, in order', async ({ page }) => {
    const subjects = await listSubjects({});
    expect(subjects.find((s) => s.subject === 'Timeline' && s.id === KEYBOARD_STORY), `${KEYBOARD_STORY} must be registered`).toBeDefined();
    await gotoStory(page, KEYBOARD_STORY);
    const list = page.getByRole('list', { name: 'Deploys' });
    await expect(list).toBeVisible();
    await expect(list.getByRole('listitem')).toHaveCount(3);
    await expect(list.locator('[data-ag-part="timeline-marker"][aria-hidden="true"]')).toHaveCount(3);
    await page.getByTestId('before-timeline').focus();
    for (const name of ['Build started', 'Deployed to staging', 'Error rate above 2%']) {
      await page.keyboard.press('Tab');
      await expect(page.getByRole('link', { name })).toBeFocused();
    }
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('after-timeline')).toBeFocused();
    await apg.axe(page);
  });
});
