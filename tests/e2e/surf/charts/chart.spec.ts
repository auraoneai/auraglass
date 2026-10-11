// chart e2e (REQ-SURF-161, SURF e2e lane L5): remote Playwright only.
// Pointer crosshair island + labelled plot on the real Storybook build.
// Fails when the story is not registered.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

async function storyId(suffix: string): Promise<string> {
  const subjects = await listSubjects({ owner: 'SURF' });
  const s = subjects.find((x) => x.subject === 'Chart' && x.id.endsWith(suffix));
  expect(s, `Chart story ${suffix} must be registered`).toBeDefined();
  return s!.id;
}

test.describe('chart 5.1 e2e (REQ-SURF-161)', () => {
  test('the plot group is named by the frame title', async ({ page }) => {
    await gotoStory(page, await storyId('--line'));
    const plot = page.getByRole('group', { name: 'Monthly revenue' });
    await expect(plot).toHaveCount(1);
    await expect(plot).toHaveAttribute('aria-roledescription', 'chart');
  });

  test('pointermove moves the crosshair and shows the tooltip for the nearest datum; pointerleave hides it', async ({ page }) => {
    await gotoStory(page, await storyId('--tooltip'));
    const plot = page.locator('svg[data-ag-part="chart-plot-svg"]');
    const box = await plot.boundingBox();
    expect(box).not.toBeNull();
    const tooltip = page.locator('[data-ag-part="chart-tooltip"]');
    await expect(tooltip).toHaveCount(0);
    // Tooltip story has 5 months: the 2nd band (Feb) spans 20%..40% of the width.
    await page.mouse.move(box!.x + box!.width * 0.3, box!.y + box!.height / 2);
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Feb');
    await expect(tooltip).toContainText('Alpha: 55');
    await expect(tooltip).toContainText('Beta: 40');
    await expect(page.locator('[data-ag-part="chart-focus-cursor"]')).toHaveCount(1);
    // pointer moves never announce
    await expect(page.locator('.ag-chart__plot-inner [role="status"]')).toHaveText('');
    await page.mouse.move(box!.x + box!.width * 0.9, box!.y + box!.height / 2);
    await expect(tooltip).toContainText('May');
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height + 200);
    await expect(tooltip).toHaveCount(0);
  });
});
