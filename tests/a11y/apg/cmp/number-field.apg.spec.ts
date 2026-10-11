
/* CMP-371 (lane 3i-Q). NumberField APG: ArrowUp/Down +-step, Shift+Arrow
   +-largeStep, Alt+Arrow +-smallStep, PageUp/PageDown. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('number-field APG (CMP-371)', () => {
  test('step/smallStep/largeStep keys change the value', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-number-field--default')
      .catch(() => gotoStory(page, 'flagships-controls-numberfield--default'));
    const input = page.locator('input[type="number"], [data-ag-part="input"], input').first();
    await input.focus();
    const v0 = Number(await input.inputValue() || '0');
    await apg.keyboard(page, [
      { press: 'ArrowUp' },        // +step
      { press: 'Shift+ArrowUp' },  // +largeStep
      { press: 'Alt+ArrowDown' },  // -smallStep
      { press: 'PageDown' },
    ]);
    const v = Number(await input.inputValue());
    expect(v).not.toBe(v0);
    await apg.axe(page);
  });
});
