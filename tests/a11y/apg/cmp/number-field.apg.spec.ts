/* CMP-371 / REQ-CMP-77. NumberField APG: each key asserted separately against
   an exact value — ArrowUp +step(1), ArrowDown -step, Shift+ArrowUp +largeStep(10),
   Alt+Arrow +smallStep(0.1), PageUp/PageDown ±largeStep(10), Home/End to
   min/max (Keyboard story: defaultValue 2, min -100, max 100), press-and-hold
   repeat at the NumberField.keys.ts timings, and a non-transparent group. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';
import { NUMBER_FIELD_KEYS } from '../../../../src/components/number-field/NumberField.keys';

const STORY = 'flagships-controls-numberfield--keyboard';
const MIN = -100;
const MAX = 100;

test.describe('number-field APG (CMP-371)', () => {
  test('each step key applies its exact increment', async ({ page }) => {
    await gotoStory(page, STORY);
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
    expect(Number(await input.inputValue())).toBe(v0 + 10);
    await input.press('PageDown');
    expect(Number(await input.inputValue())).toBe(v0);
    await input.press('PageDown');
    expect(Number(await input.inputValue())).toBe(v0 - 10);
    await input.press('PageUp');
    expect(Number(await input.inputValue())).toBe(v0);

    await input.press('Home');
    expect(Number(await input.inputValue())).toBe(MIN);
    await input.press('End');
    expect(Number(await input.inputValue())).toBe(MAX);
    await apg.axe(page);
  });

  test('press-and-hold on increment repeats at the recorded delay/interval', async ({ page }) => {
    await gotoStory(page, STORY);
    const input = page.locator('[data-ag-part="input"]').first();
    const inc = page.locator('[data-ag-part="increment"]').first();
    const v0 = Number(await input.inputValue());
    const holdMs = 1000;
    const box = (await inc.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(holdMs);
    await page.mouse.up();
    const delta = Number(await input.inputValue()) - v0;
    // 1 step on press, then one per interval once the repeat delay elapses.
    const { repeatDelayMs, repeatIntervalMs } = NUMBER_FIELD_KEYS;
    const expected = 1 + Math.floor((holdMs - repeatDelayMs) / repeatIntervalMs);
    // Timer jitter on a shared runner: allow ±30% around the recorded cadence,
    // but a hold must always repeat (> 1) and never exceed the max.
    expect(delta).toBeGreaterThan(1);
    expect(delta).toBeGreaterThanOrEqual(Math.floor(expected * 0.7));
    expect(delta).toBeLessThanOrEqual(Math.ceil(expected * 1.3));
    // Releasing stops the repeat.
    const after = Number(await input.inputValue());
    await page.waitForTimeout(repeatIntervalMs * 5);
    expect(Number(await input.inputValue())).toBe(after);
  });

  test('the content-sunken group paints a non-transparent fill', async ({ page }) => {
    await gotoStory(page, STORY);
    const group = page.locator('[data-ag-part="group"]').first();
    await expect(group).toHaveAttribute('data-ag-content', 'content-sunken');
    const bg = await group.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe('transparent');
    expect(bg).not.toMatch(/^rgba\(0, 0, 0, 0\)$/);
    // Any alpha channel the engine reports must be > 0 (no alpha → opaque).
    const m = /\/\s*([\d.]+)\)|rgba\([^)]*,\s*([\d.]+)\)/.exec(bg);
    const alpha = m ? Number(m[1] ?? m[2]) : 1;
    expect(alpha).toBeGreaterThan(0);
  });
});
