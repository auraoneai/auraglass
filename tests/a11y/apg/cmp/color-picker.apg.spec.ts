/* CMP-358 / REQ-CMP-125. ColorPicker APG: the story opens with every part; the 2-D Area steps aria-valuetext by
   exactly 1% (Arrow) and 10% (Shift+Arrow); the hue, channel and alpha Base UI sliders respond to arrows
   (aria-valuenow); typing a hex in the input updates the area and reads back (round-trip); Escape closes. */
import { test, expect, type Locator } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

const percents = async (area: Locator) => {
  const m = /^saturation (\d+)%, brightness (\d+)%$/.exec((await area.getAttribute('aria-valuetext')) ?? '');
  expect(m).not.toBeNull();
  return { s: Number(m![1]), v: Number(m![2]) };
};

test.describe('color-picker APG (CMP-358, REQ-CMP-125)', () => {
  test('area steps 1%/10%; three sliders respond to arrows; hex input round-trips; Escape closes', async ({ page }) => {
    await gotoStory(page, 'core-colorpicker--default');
    const popup = page.locator('[data-ag-part="popup"]');
    await expect(popup).toBeVisible();

    const area = popup.locator('[data-ag-part="area"][role="slider"]');
    await expect(area).toHaveAttribute('aria-roledescription', '2D slider');
    await area.focus();
    const a0 = await percents(area);
    await page.keyboard.press('ArrowRight');
    expect(await percents(area)).toEqual({ s: a0.s + 1, v: a0.v });
    await page.keyboard.press('Shift+ArrowLeft');
    expect(await percents(area)).toEqual({ s: a0.s + 1 - 10, v: a0.v });
    await page.keyboard.press('ArrowDown');
    expect(await percents(area)).toEqual({ s: a0.s - 9, v: a0.v - 1 });

    for (const part of ['hue', 'channel', 'alpha'] as const) {
      const slider = popup.locator(`[data-ag-part="${part}"] input[type="range"]`);
      await expect(slider).toHaveCount(1);
      const before = Number(await slider.getAttribute('aria-valuenow'));
      await slider.focus();
      await page.keyboard.press(part === 'alpha' ? 'ArrowLeft' : 'ArrowRight');
      expect(Number(await slider.getAttribute('aria-valuenow'))).not.toBe(before);
    }

    const input = popup.locator('[data-ag-part="input"] input[type="text"]');
    await input.fill('#336699');
    await input.press('Enter');
    await expect(input).toHaveValue('#336699');
    await expect(area).toHaveAttribute('aria-valuetext', 'saturation 67%, brightness 60%');

    await apg.axe(page);
    await page.keyboard.press('Escape');
    await expect(popup).toBeHidden();
  });
});
