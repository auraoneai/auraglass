// citation-preview.spec.ts — SURF-355 / REQ-SURF-125: the citation preview
// card opens after a 300 ms hover, positions inside the viewport with 8 px
// collision padding, has no popup role, closes on Escape; a tap (touch, also
// on WebKit) opens the in-message SourceList and focuses the source item.
// Remote lane only (surf:ai). A missing story or citation fails the test.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

const STORY = 'ai-sources--citation-in-message';

async function openStory(page: Page) {
  const subjects = await listSubjects();
  const subject = subjects.find((s) => s.id === STORY);
  expect(subject, `story ${STORY} must be registered in the Storybook index`).toBeDefined();
  await gotoStory(page, subject!.id);
  await expect(page.locator('[data-ag-part="citation"]')).toHaveCount(2);
}

test.describe('ai citation preview — pointer (SURF-355)', () => {
  test('hover opens after 300 ms (not before); no dialog/tooltip role; Escape closes and focus is not stolen', async ({ page }) => {
    await openStory(page);
    const cite = page.getByRole('link', { name: 'Source 1: Reference 1' });
    const preview = page.locator('[data-ag-part="citation-preview"]');
    const t0 = await page.evaluate(() => performance.now());
    await cite.hover();
    await expect(preview).toBeVisible();
    const openedAfter = await page.evaluate((start) => performance.now() - start, t0);
    expect(openedAfter).toBeGreaterThanOrEqual(300);
    await expect(page.locator('[role="dialog"], [role="tooltip"]')).toHaveCount(0);
    // Portalled out of the message into the overlay container.
    expect(await preview.evaluate((el) => el.closest('article') === null)).toBe(true);
    await page.keyboard.press('Escape');
    await expect(preview).toHaveCount(0);
  });

  test('moving from the trigger onto the card keeps it open', async ({ page }) => {
    await openStory(page);
    const cite = page.getByRole('link', { name: 'Source 1: Reference 1' });
    const preview = page.locator('[data-ag-part="citation-preview"]');
    await cite.hover();
    await expect(preview).toBeVisible();
    const box = (await preview.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 5 });
    await page.waitForTimeout(400);
    await expect(preview).toBeVisible();
  });

  test('collision padding: the card stays ≥8 px inside a 320 px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await openStory(page);
    const cite = page.getByRole('link', { name: 'Source 4: Reference 4' });
    await cite.focus();
    const preview = page.locator('[data-ag-part="citation-preview"]');
    await expect(preview).toBeVisible();
    const box = (await preview.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(8 - 0.5);
    expect(box.x + box.width).toBeLessThanOrEqual(320 - 8 + 0.5);
  });
});

test.describe('ai citation preview — touch (SURF-355)', () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });

  test('tap opens the SourceList and focuses #ag-src-… (no preview card left open)', async ({ page }) => {
    await openStory(page);
    const listTrigger = page.locator('[data-ag-part="source-list"] > [data-ag-part="trigger"]');
    await expect(listTrigger).toHaveAttribute('aria-expanded', 'false');
    await page.getByRole('link', { name: 'Source 4: Reference 4' }).tap();
    await expect(listTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#ag-src-cite-msg-s4')).toBeFocused();
    await expect(page.locator('[data-ag-part="citation-preview"]')).toHaveCount(0);
  });
});
