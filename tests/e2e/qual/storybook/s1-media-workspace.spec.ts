/* REQ-QUAL-57 S1 media-workspace (REQ-QUAL-58): the primary task — play the take from the clear-over-media
   controls, then open and close the shot inspector Sheet. */
import { beforeAllFresh, collectErrors, expect, openStory, test } from './_storybook';

const STORY = 'showcases-media-workspace--full-page';

test.beforeAll(async ({ playwright }) => beforeAllFresh(playwright));

test('S1 media-workspace: play over media → shot inspector', async ({ page }) => {
  const errors = collectErrors(page);
  await openStory(page, STORY);

  const overMedia = page.getByRole('region', { name: 'Playback controls over the frame' });
  const play = overMedia.locator('[data-ag-part="media-play"]');
  await expect(play).toHaveAttribute('aria-pressed', 'false');
  await expect(play).toHaveAccessibleName('Play');
  await play.click();
  await expect(play).toHaveAttribute('aria-pressed', 'true');
  await expect(play).toHaveAccessibleName('Pause');
  await play.click();
  await expect(play).toHaveAttribute('aria-pressed', 'false');

  const trigger = page.getByRole('button', { name: 'Shot details' });
  await trigger.click();
  const sheet = page.locator('[data-ag-part="popup"][data-state="open"]');
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole('heading', { name: 'Shot details' })).toBeVisible();
  await expect(sheet.getByRole('heading', { name: 'Reviewer note' })).toBeVisible();
  await sheet.getByRole('button', { name: 'Close' }).click();
  await expect(page.locator('[data-ag-part="popup"][data-state="open"]')).toHaveCount(0);

  expect(errors).toEqual([]);
});
