// composer.apg.spec.ts — SURF-384 / REQ-SURF-116, -117, -119: APG keyboard
// spec for AI/Composer through the shared apg harness (QUAL L5 imports these
// files). A missing story fails the spec.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory, apg } from '../../../helpers';

async function openStory(page: Page, id: string) {
  const subjects = await listSubjects();
  const subject = subjects.find((s) => s.id === id);
  expect(subject, `story ${id} must be registered in the Storybook index`).toBeDefined();
  await gotoStory(page, subject!.id);
  await expect(page.locator('[data-ag-part="composer"]')).toBeVisible();
}

test.describe('composer APG (SURF-384)', () => {
  test('textarea labelled by a <label>; Enter submits and focus stays; actions in tab order', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await openStory(page, 'ai-composer--with-actions');
    const input = page.getByLabel('Message');
    await expect(input).toHaveJSProperty('tagName', 'TEXTAREA');
    const labelled = await input.evaluate((el) => {
      const ta = el as HTMLTextAreaElement;
      return { viaLabel: Array.from(ta.labels ?? []).map((l) => l.textContent), ariaLabel: ta.getAttribute('aria-label') };
    });
    expect(labelled).toEqual({ viaLabel: ['Message'], ariaLabel: null });

    await apg.keyboard(page, [
      { press: 'Tab', expectFocus: 'textarea' },
      { type: 'draft' },
      { press: 'Enter', expectFocus: 'textarea' },
    ]);
    await expect(page.getByTestId('sent')).toHaveText('draft');
    await expect(input).toHaveValue('');

    await apg.keyboard(page, [
      { press: 'Tab', expectFocus: 'role=button[name=Attach file]' },
      { press: 'Tab', expectFocus: 'role=button[name=Insert template]' },
      { press: 'Tab', expectFocus: 'submit' },
    ]);
    await apg.axe(page);
  });

  test('below 480 px the actions menu opens from the keyboard and its items run the action', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openStory(page, 'ai-composer--with-actions');
    await apg.keyboard(page, [
      { press: 'Tab', expectFocus: 'textarea' },
      { press: 'Tab', expectFocus: 'composer-menu-trigger' },
    ]);
    await page.keyboard.press('Enter');
    await expect(page.getByRole('menu')).toBeVisible();
    await expect(page.getByRole('menuitem')).toHaveText(['Attach file', 'Insert template']);
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'Insert template' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('inserted')).toHaveText('1');
    await expect(page.getByRole('button', { name: 'More actions' })).toBeFocused();
    await apg.keyboard(page, [{ press: 'Tab', expectFocus: 'submit' }]);
    await apg.axe(page);
  });

  test('streaming: Stop replaces Submit; the textarea stays editable', async ({ page }) => {
    await openStory(page, 'ai-composer--streaming-stop');
    await expect(page.getByRole('button', { name: 'Stop generating' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send message' })).toHaveCount(0);
    await expect(page.getByLabel('Message')).toBeEditable();
    await apg.axe(page);
  });
});
