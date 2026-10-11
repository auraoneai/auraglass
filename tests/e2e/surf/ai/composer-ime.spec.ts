// composer-ime.spec.ts — SURF-353: IME composition never submits mid-string.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('ai composer IME (SURF-353)', () => {
  test('composition events + keyCode 229 submit nothing; next Enter submits once', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Composer');
    if (!subject) throw new Error('AI/Composer subject not registered');
    await gotoStory(page, subject.id);
    const input = page.locator('[data-ag-part="input"], textarea').first();
    await expect(input).toBeVisible();
    const submits = page.evaluate(() => {
      (window as unknown as { __agSubmits: number }).__agSubmits = 0;
      document.querySelector('form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        (window as unknown as { __agSubmits: number }).__agSubmits += 1;
      });
      return true;
    });
    expect(submits).toBe(true);
    await input.focus();
    await input.evaluate((el) => {
      el.dispatchEvent(new CompositionEvent('compositionstart', { data: '' }));
      (el as HTMLTextAreaElement).value = 'nihongo';
      el.dispatchEvent(new CompositionEvent('compositionupdate', { data: 'nihongo' }));
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 229, bubbles: true }));
      el.dispatchEvent(new CompositionEvent('compositionend', { data: 'nihongo' }));
    });
    const during = await page.evaluate(() => (window as unknown as { __agSubmits: number }).__agSubmits);
    expect(during).toBe(0);
    await input.press('Enter');
    const after = await page.evaluate(() => (window as unknown as { __agSubmits: number }).__agSubmits);
    expect(after).toBe(1);
  });
});
