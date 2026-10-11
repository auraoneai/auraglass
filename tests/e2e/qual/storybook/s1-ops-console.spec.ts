/* REQ-QUAL-57 S1 ops-console (REQ-QUAL-58): the primary task — open the destructive "Resolve incident"
   AlertDialog, back out with "Keep open" (focus returns to the trigger), then acknowledge the incident and see
   the confirmation toast. */
import { beforeAllFresh, collectErrors, expect, openStory, test } from './_storybook';

const STORY = 'showcases-ops-console--full-page';

test.beforeAll(async ({ playwright }) => beforeAllFresh(playwright));

test('S1 ops-console: resolve dialog → keep open → acknowledge', async ({ page }) => {
  const errors = collectErrors(page);
  await openStory(page, STORY);

  const resolve = page.getByRole('button', { name: 'Resolve incident' });
  await resolve.click();
  const dialog = page.getByRole('alertdialog', { name: 'Resolve INC-4821?' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Resolve incident' })).toBeVisible();
  await dialog.getByRole('button', { name: 'Keep open' }).click();
  await expect(dialog).toBeHidden();
  await expect(resolve).toBeFocused();

  await page.getByRole('button', { name: 'Acknowledge INC-4821' }).click();
  await expect(page.getByText('Escalation paused', { exact: true })).toBeVisible();
  await expect(page.getByText('INC-4821 acknowledged by Priya Raman.', { exact: true })).toBeVisible();

  expect(errors).toEqual([]);
});
