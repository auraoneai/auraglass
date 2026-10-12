// chart-frame.apg.spec.ts — REQ-SURF-196: APG disclosure/text-alternative
// script over the shipped ChartFrame Default subject: the figure is captioned
// by its title and the "Show data table" disclosure (aria-expanded) reveals a
// real data table with the same caption — the chart's text alternative.
// Remote lane; a missing subject or story fails the test.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';
import { apg } from '../harness';

const SUBJECT = 'ChartFrame';

async function openDefault(page: Page) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => (s.subject === SUBJECT || s.id === 'surf-chart-frame--default') && s.id.endsWith('--default'));
  if (!subject) throw new Error(`${SUBJECT} --default story not registered`);
  await gotoStory(page, subject.id);
}

test.describe('APG chart frame (SURF)', () => {
  test('captioned figure; the table toggle discloses the data table', async ({ page }) => {
    await openDefault(page);
    const figure = page.locator('figure[data-ag-part="chart-frame"]');
    await expect(figure).toHaveCount(1);
    await expect(figure.locator('figcaption')).toContainText('Monthly revenue');
    const toggle = page.getByRole('button', { name: 'Show data table' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'Hide data table' })).toHaveAttribute('aria-expanded', 'true');
    const table = figure.locator('table');
    await expect(table).toBeVisible();
    await expect(table.locator('caption')).toHaveText('Monthly revenue');
    await apg.axe(page);
  });
});
