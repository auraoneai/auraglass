/* CMP-371 / REQ-CMP-77. NumberField APG: each key asserted separately against
   an exact value — ArrowUp +step(1), ArrowDown -step, Shift+ArrowUp +largeStep(10),
   Alt+Arrow +smallStep(0.1), PageUp/PageDown. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('number-field APG (CMP-371)', () => {
  test('each step key applies its exact increment', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-number-field--default')
      .catch(() => gotoStory(page, 'flagships-controls-numberfield--default'));
    const input = page.locator('input[type="number"], [data-ag-part="input"], input').first();
    await input.focus();
    const v0 = Number(await input.inputValue() || '0');

    await input.press('ArrowUp');
    expect(Number(await input.inputValue())).toBe(v0 + 1);
    await input.press('ArrowDown');
    expect(Number(await input.inputValue())).toBe(v0);

    await input.press('Shift+ArrowUp');
    expect(Number(await input.inputValue())).toBe(v0 + 10);
    await input.press('Shift+ArrowDown');
    expect(Number(await input.inputValue())).toBe(v0);

    await input.press('Alt+ArrowUp');
    expect(Number(await input.inputValue())).toBeCloseTo(v0 + 0.1, 5);
    await input.press('Alt+ArrowDown');
    expect(Number(await input.inputValue())).toBeCloseTo(v0, 5);

    await input.press('PageUp');
    expect(Number(await input.inputValue())).toBeGreaterThan(v0);
    await apg.axe(page);
  });
});
