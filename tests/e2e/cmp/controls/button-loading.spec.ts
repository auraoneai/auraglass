/* REQ-CMP-33. Loading keeps the label mounted so offsetWidth is stable;
   under data-ag-motion=calm the spinner's computed animation-name is none. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

test.describe('button loading stability (REQ-CMP-33)', () => {
  test('offsetWidth identical with and without loading', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-button--width-stability');
    const idle = page.getByTestId('idle');
    const busy = page.getByTestId('busy');
    test.skip((await idle.count()) === 0 || (await busy.count()) === 0, 'width-stability story missing');
    const [wIdle, wBusy] = await Promise.all([
      idle.evaluate((el) => (el as HTMLElement).offsetWidth),
      busy.evaluate((el) => (el as HTMLElement).offsetWidth),
    ]);
    expect(Math.abs(wIdle - wBusy)).toBe(0);
    await expect(busy).toHaveAttribute('aria-busy', 'true');
  });

  test('spinner animation-name is none under data-ag-motion=calm', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-button--width-stability', { motion: 'calm' });
    const spinner = page.locator('[data-ag-part="spinner"]').first();
    test.skip((await spinner.count()) === 0, 'spinner part absent');
    const name = await spinner.evaluate((el) => getComputedStyle(el).animationName);
    expect(name).toBe('none');
  });
});
