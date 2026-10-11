// tool-call.apg.spec.ts — SURF-385 / REQ-SURF-120/121: APG Disclosure +
// approval keyboard spec for AI/ToolCall through the shared apg harness
// (QUAL L5 imports these files). A missing story fails the test.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory, apg } from '../../../helpers';

async function openStory(page: Page, id: string) {
  const subjects = await listSubjects();
  const subject = subjects.find((s) => s.id === id);
  expect(subject, `story ${id} must be registered in the Storybook index`).toBeDefined();
  await gotoStory(page, subject!.id);
  await expect(page.locator('[data-ag-part="tool-call"]')).toHaveCount(1);
}

test.describe('tool-call APG (SURF-385)', () => {
  test('disclosure: trigger is a button with aria-expanded/aria-controls; Enter and Space toggle; panel id always resolves', async ({ page }) => {
    await openStory(page, 'ai-toolcall--succeeded');
    const trigger = page.locator('[data-ag-part="tool-call"] [data-ag-part="trigger"]');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    const controls = await trigger.getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    // Collapsed panel stays in the DOM (hidden) so the idref is never dangling.
    await expect(page.locator(`[id="${controls}"]`)).toHaveCount(1);
    await expect(page.locator(`[id="${controls}"]`)).toBeHidden();
    await apg.keyboard(page, [{ press: 'Tab', expectFocus: 'trigger' }, { press: 'Enter' }]);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator(`[id="${controls}"]`)).toBeVisible();
    await expect(page.locator('[data-ag-part="tool-state"]')).toHaveText('Done');
    await expect(trigger.locator('svg[data-ag-part="state-icon"]')).toHaveAttribute('data-ag-icon', 'succeeded');
    await apg.keyboard(page, [{ press: 'Space' }]);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await apg.axe(page);
  });

  test('approval: Tab order trigger → input → Approve → Deny; Approve fires once, disables both and returns focus to the trigger', async ({ page }) => {
    await openStory(page, 'ai-toolcall--needs-approval-keyboard');
    const trigger = page.locator('[data-ag-part="tool-call"] [data-ag-part="trigger"]');
    // needs-approval is open by default.
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await apg.keyboard(page, [
      { press: 'Tab', expectFocus: 'trigger' },
      { press: 'Tab', expectFocus: 'io-pre' },
      { press: 'Tab', expectFocus: 'approve' },
      { press: 'Tab', expectFocus: 'deny' },
      { press: 'Shift+Tab', expectFocus: 'approve' },
      { press: 'Enter', expectFocus: 'trigger' },
    ]);
    await expect(page.getByTestId('responses')).toHaveText('ap-k:approved');
    await expect(page.getByRole('button', { name: 'Approve' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Deny' })).toBeDisabled();
    await page.getByRole('button', { name: 'Approve' }).click({ force: true });
    await expect(page.getByTestId('responses')).toHaveText('ap-k:approved');
    await apg.axe(page);
  });

  test('live flow: auto-opens on needs-approval; keyboard Deny with a reason; a new approval id re-enables the buttons', async ({ page }) => {
    await openStory(page, 'ai-toolcall--live-approval-flow');
    const trigger = page.locator('[data-ag-part="tool-call"] [data-ag-part="trigger"]');
    // Streams in collapsed (queued → running), then approval is requested.
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await page.getByTestId('advance').click();
    await expect(page.locator('[data-ag-part="tool-call"]')).toHaveAttribute('data-state', 'running');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await page.getByTestId('advance').click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('[data-ag-part="tool-call"]')).toHaveAttribute('data-state', 'needs-approval');
    const approve = page.getByRole('button', { name: 'Approve' });
    const deny = page.getByRole('button', { name: 'Deny' });
    await trigger.focus();
    await apg.keyboard(page, [
      { press: 'Tab', expectFocus: 'io-pre' },
      { press: 'Tab', expectFocus: 'approve' },
      { press: 'Tab', expectFocus: 'deny' },
      { press: 'Enter' },
    ]);
    const reason = page.getByLabel('Reason (optional)');
    await expect(reason).toBeVisible();
    await reason.focus();
    await page.keyboard.type('not in prod');
    await apg.keyboard(page, [{ press: 'Tab' }, { press: 'Enter' }]);
    await expect(page.getByTestId('responses')).toHaveText('ap-flow-1:denied:not in prod');
    await expect(trigger).toBeFocused();

    // approval-responded → approval-requested with a new id: controls re-enable.
    await page.getByTestId('advance').click();
    await expect(page.locator('[data-ag-part="tool-call"]')).toHaveAttribute('data-state', 'running');
    await page.getByTestId('advance').click();
    await expect(page.locator('[data-ag-part="tool-call"]')).toHaveAttribute('data-state', 'needs-approval');
    await expect(approve).toBeEnabled();
    await expect(deny).toBeEnabled();
    await approve.click();
    await expect(page.getByTestId('responses')).toHaveText('ap-flow-1:denied:not in prod,ap-flow-2:approved');

    // Failure: plain text, no role=alert inside the tool call; spoken via the announcer.
    await page.getByTestId('advance').click();
    await expect(page.locator('[data-ag-part="tool-call"]')).toHaveAttribute('data-state', 'failed');
    await expect(page.locator('[data-ag-part="error-text"]')).toHaveText('Upstream timed out');
    await expect(page.locator('[data-ag-part="tool-call"] [role="alert"], [data-ag-part="tool-call"] [aria-live]')).toHaveCount(0);
    await apg.axe(page);
  });
});
