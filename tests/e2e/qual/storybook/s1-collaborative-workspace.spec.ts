/* REQ-QUAL-57 S1 collaborative-workspace (REQ-QUAL-58): the primary task — share the document: open the share
   popover, add a person through the multi-select Combobox (a chip appears), send the invites (popover closes). */
import { beforeAllFresh, collectErrors, expect, openStory, test } from './_storybook';

const STORY = 'showcases-collaborative-workspace--full-page';

test.beforeAll(async ({ playwright }) => beforeAllFresh(playwright));

test('S1 collaborative-workspace: share popover → add person → send invites', async ({ page }) => {
  const errors = collectErrors(page);
  await openStory(page, STORY);

  await page.getByRole('button', { name: 'Share', exact: true }).click();
  const popover = page.getByRole('dialog', { name: 'Share “Q2 launch brief”' });
  await expect(popover).toBeVisible();

  const input = popover.getByRole('combobox', { name: 'Add people' });
  await input.click();
  const options = page.getByRole('option');
  await expect(options.first()).toBeVisible();
  const names = (await options.allTextContents()).map((t) => t.trim());
  const pick = names.find((n) => n && n !== 'Ravi Patel');
  expect(pick, `a person other than the pre-selected Ravi Patel among ${names.join(', ')}`).toBeTruthy();
  await page.getByRole('option', { name: pick!, exact: true }).click();
  await expect(popover.getByText(pick!, { exact: true })).toBeVisible();
  await expect(popover.getByText('Ravi Patel', { exact: true })).toBeVisible();

  await popover.getByRole('button', { name: 'Send invites' }).click();
  await expect(popover).toBeHidden();

  expect(errors).toEqual([]);
});
