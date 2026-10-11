// composer-ime.spec.ts — REQ-SURF-117 (SURF-353): IME composition never
// submits mid-string; the next real Enter submits once, clears the draft and
// keeps focus. Remote lane only (WebKit + Chromium). A missing story fails.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('ai composer IME (REQ-SURF-117)', () => {
  test('composing Enter (isComposing / keyCode 229) submits nothing; next Enter submits once', async ({ page }) => {
    const id = 'ai-composer--with-actions';
    const subjects = await listSubjects();
    const subject = subjects.find((s) => s.id === id);
    expect(subject, `story ${id} must be registered in the Storybook index`).toBeDefined();
    await gotoStory(page, subject!.id);
    const input = page.getByLabel('Message');
    await expect(input).toBeVisible();
    await input.focus();
    await input.evaluate((el) => {
      el.dispatchEvent(new CompositionEvent('compositionstart', { data: '', bubbles: true }));
    });
    await page.keyboard.insertText('にほんご');
    const prevented = await input.evaluate((el) => {
      el.dispatchEvent(new CompositionEvent('compositionupdate', { data: 'にほんご', bubbles: true }));
      const composing = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', isComposing: true, bubbles: true, cancelable: true });
      el.dispatchEvent(composing);
      // Safari reports the committing Enter as keyCode 229 without isComposing.
      const legacy = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true, cancelable: true });
      Object.defineProperty(legacy, 'keyCode', { value: 229 });
      el.dispatchEvent(legacy);
      el.dispatchEvent(new CompositionEvent('compositionend', { data: 'にほんご', bubbles: true }));
      return [composing.defaultPrevented, legacy.defaultPrevented];
    });
    expect(prevented).toEqual([false, false]);
    await expect(page.getByTestId('sent')).toHaveText('');
    await expect(input).toHaveValue('にほんご');

    await input.press('Enter');
    await expect(page.getByTestId('sent')).toHaveText('にほんご');
    await expect(input).toHaveValue('');
    await expect(input).toBeFocused();
  });
});
