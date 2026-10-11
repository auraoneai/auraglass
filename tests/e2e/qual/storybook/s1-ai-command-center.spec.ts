/* REQ-QUAL-57 S1-1 ai-command-center (REQ-QUAL-58): the primary task — send a message, then approve the
   tool call that needs approval. Story ids come from showcase/showcases.json (storyId). */
import { beforeAllFresh, collectErrors, expect, openStory, test } from './_storybook';

const STORY = 'showcases-ai-command-center--full-page';

test.beforeAll(async ({ playwright }) => beforeAllFresh(playwright));

test('S1-1 ai-command-center: send → tool-call approval', async ({ page }) => {
  const errors = collectErrors(page);
  await openStory(page, STORY);

  const conversation = page.getByRole('region', { name: 'Conversation' });
  const log = conversation.getByRole('log');
  await expect(log).toBeVisible();
  const before = await log.locator('[data-ag-part="message"]').count();

  const text = 'Roll back checkout-api to 7.14.1 in eu-west-1 and post the status update.';
  const input = conversation.getByRole('textbox', { name: 'Message' });
  await input.fill(text);
  await conversation.getByRole('button', { name: 'Send message' }).click();
  await expect(log.getByText(text, { exact: true })).toBeVisible();
  await expect(log.locator('[data-ag-part="message"]')).toHaveCount(before + 1);
  await expect(input).toHaveValue('');

  const pending = page.locator('[data-ag-part="tool-call"][data-state="needs-approval"]');
  await expect(pending).toHaveCount(1);
  const approve = pending.getByRole('button', { name: 'Approve' });
  await expect(approve).toBeEnabled();
  await approve.click();
  await expect(approve).toBeDisabled();
  await expect(pending.getByRole('button', { name: 'Deny' })).toBeDisabled();
  await expect(pending.locator('[data-ag-part="trigger"]')).toBeFocused();

  expect(errors).toEqual([]);
});
