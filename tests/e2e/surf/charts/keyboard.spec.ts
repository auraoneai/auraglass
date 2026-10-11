// charts keyboard (REQ-SURF-163, SURF e2e lane L5): remote Playwright only.
// The plot is exactly one tab stop; ArrowRight x3 yields ONE polite
// announcement (150 ms trailing debounce) carrying the x value and every
// visible series value. Fails when the story is not registered.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

async function storyId(suffix: string): Promise<string> {
  const subjects = await listSubjects({ owner: 'SURF' });
  const s = subjects.find((x) => x.subject === 'Chart' && x.id.endsWith(suffix));
  expect(s, `Chart story ${suffix} must be registered`).toBeDefined();
  return s!.id;
}

test.describe('charts keyboard (REQ-SURF-163)', () => {
  test('the plot is one tab stop: Tab focuses it once and the next Tab leaves it', async ({ page }) => {
    await gotoStory(page, await storyId('--announce'));
    const plot = page.locator('svg[data-ag-part="chart-plot-svg"]');
    await expect(plot).toHaveAttribute('role', 'group');
    await expect(plot).toHaveAttribute('aria-roledescription', 'chart');
    await expect(page.getByRole('group', { name: 'Monthly revenue' })).toHaveCount(1);
    // nothing inside the plot is focusable on its own
    await expect(plot.locator('[tabindex], a[href], button, input')).toHaveCount(0);

    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    let plotStops = 0;
    let wasOnPlot = false;
    let leftAfterPlot = false;
    for (let i = 0; i < 16 && !leftAfterPlot; i++) {
      await page.keyboard.press('Tab');
      const onPlot = await plot.evaluate((el) => el === document.activeElement);
      if (onPlot) plotStops++;
      if (wasOnPlot && !onPlot) leftAfterPlot = true;
      wasOnPlot = onPlot;
    }
    expect(plotStops).toBe(1);
    expect(leftAfterPlot).toBe(true);
  });

  test('ArrowRight x3 produces one polite announcement with Feb and both series values', async ({ page }) => {
    await gotoStory(page, await storyId('--announce'));
    const plot = page.locator('svg[data-ag-part="chart-plot-svg"]');
    const live = page.locator('.ag-chart__plot-inner [role="status"][aria-live="polite"]');
    await expect(live).toHaveCount(1);
    await live.evaluate((el) => {
      const w = window as unknown as { __agWrites: string[] };
      w.__agWrites = [];
      new MutationObserver(() => { if (el.textContent) w.__agWrites.push(el.textContent); })
        .observe(el, { childList: true, characterData: true, subtree: true });
    });
    await plot.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expect(live).toHaveText(/Feb/, { timeout: 2000 });
    await page.waitForTimeout(400); // well past the 150 ms window: no late second write
    const writes = await page.evaluate(() => (window as unknown as { __agWrites: string[] }).__agWrites);
    expect(writes).toHaveLength(1);
    expect(writes[0]).toContain('Feb');
    expect(writes[0]).toContain('Alpha 55');
    expect(writes[0]).toContain('Beta 40');
    await expect(page.locator('[data-ag-part="chart-focus-cursor"]')).toHaveCount(1);
  });
});
