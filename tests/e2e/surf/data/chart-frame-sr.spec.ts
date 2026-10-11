// REQ-SURF-94 (remote Playwright, L5): the accessibility tree of ChartFrame
// per table mode, on the built Storybook stories in
// src/data/chart-frame/ChartFrame.stories.tsx. One ariaSnapshot assertion per
// mode (toggle closed, toggle open, visually-hidden, always) against the
// templates committed below (children match in order; extra nodes such as
// caption text are allowed). Fails — never skips — when a story is missing.
import { test, expect, type Page } from '@playwright/test';
import { gotoStory, listSubjects } from '../../../helpers';

async function gotoChartStory(page: Page, suffix: string) {
  const subjects = await listSubjects({});
  const story = subjects.find((s) => (s.subject === 'ChartFrame' || s.subject === 'chart-frame') && s.id.endsWith(`--${suffix}`));
  expect(story, `ChartFrame story --${suffix} must be registered`).toBeDefined();
  await gotoStory(page, story!.id);
  const figure = page.locator('figure[data-ag-part="chart-frame"]');
  await expect(figure).toHaveCount(1);
  return figure;
}

const TABLE = `
  - table "Monthly revenue":
    - rowgroup:
      - row "Month Alpha Beta"
    - rowgroup:
      - row "Jan 30 50"
      - row "Feb 55 40"
      - row "Mar 42 70"`;

const LEGEND = `
  - group "Series":
    - button "Alpha" [pressed]
    - button "Beta" [pressed]`;

test.describe('chart-frame accessibility tree per table mode (REQ-SURF-94)', () => {
  test("table='toggle': closed, then open", async ({ page }) => {
    const figure = await gotoChartStory(page, 'default');
    await expect(figure).toMatchAriaSnapshot(`
- figure /Monthly revenue/:
  - img "Line chart"
  - button "Show data table" [expanded=false]${LEGEND}
`);
    await expect(figure.getByRole('table')).toHaveCount(0);

    await figure.getByRole('button', { name: 'Show data table' }).click();
    await expect(figure).toMatchAriaSnapshot(`
- figure /Monthly revenue/:
  - img "Line chart"
  - button "Hide data table" [expanded]${TABLE}${LEGEND}
`);
  });

  test("table='visually-hidden': table in the tree, plot hidden, no toggle", async ({ page }) => {
    const figure = await gotoChartStory(page, 'table-visually-hidden');
    await expect(figure).toMatchAriaSnapshot(`
- figure /Monthly revenue/:${TABLE}${LEGEND}
`);
    await expect(figure.getByRole('img')).toHaveCount(0);
    await expect(figure.getByRole('button', { name: /data table/ })).toHaveCount(0);
    // visually hidden, not display:none
    const box = await figure.locator('[data-ag-part="chart-table"]').boundingBox();
    expect(box === null || box.width <= 1).toBe(true);
  });

  test("table='always': plot and table, no toggle", async ({ page }) => {
    const figure = await gotoChartStory(page, 'table-always');
    await expect(figure).toMatchAriaSnapshot(`
- figure /Monthly revenue/:
  - img "Line chart"${TABLE}${LEGEND}
`);
    await expect(figure.getByRole('button', { name: /data table/ })).toHaveCount(0);
  });

  test('last visible series: aria-disabled with its description', async ({ page }) => {
    const figure = await gotoChartStory(page, 'legend-toggle');
    const beta = figure.getByRole('button', { name: 'Beta' });
    await expect(beta).toHaveAttribute('aria-disabled', 'true');
    await expect(beta).toHaveAccessibleDescription('At least one series must be visible');
    await beta.click();
    await expect(beta).toHaveAttribute('aria-pressed', 'true');
  });

  test('narrow container: a top legend renders after the plot and wraps', async ({ page }) => {
    const figure = await gotoChartStory(page, 'narrow');
    const order = await figure.evaluate((f) => [...f.children].map((c) => c.getAttribute('data-ag-part') ?? c.tagName.toLowerCase()));
    expect(order.indexOf('chart-legend')).toBeGreaterThan(order.indexOf('chart-plot'));
    const legend = figure.locator('[data-ag-part="chart-legend"]');
    await expect(legend).toHaveAttribute('data-placement', 'bottom');
    await expect(legend).toHaveCSS('flex-wrap', 'wrap');
    const plot = await figure.locator('[data-ag-part="chart-plot"]').boundingBox();
    expect(plot!.height).toBeGreaterThanOrEqual(160);
  });
});
