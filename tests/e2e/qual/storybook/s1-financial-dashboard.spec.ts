/* REQ-QUAL-57 S1 financial-dashboard (REQ-QUAL-58): the primary task — narrow the 10,000-row ledger to one
   counterparty from the FilterBar search, then sort it by amount. */
import { beforeAllFresh, collectErrors, expect, openStory, test } from './_storybook';

const STORY = 'showcases-financial-dashboard--full-page';
const COUNTERPARTY = 'Corvid Software';

test.beforeAll(async ({ playwright }) => beforeAllFresh(playwright));

test('S1 financial-dashboard: filter ledger by counterparty → sort by amount', async ({ page }) => {
  const errors = collectErrors(page);
  await openStory(page, STORY);

  const ledger = page.locator('section[aria-labelledby="fd-ledger-heading"]');
  const table = ledger.locator('table');
  const status = ledger.getByRole('status');
  await expect(status).toHaveText(/^\d[\d,]* results$/);
  const total = Number((await status.textContent())!.replace(/\D/g, ''));
  expect(total).toBeGreaterThan(1000);
  await expect(table).toHaveAttribute('aria-rowcount', String(total + 1));

  await ledger.getByRole('searchbox', { name: 'Search counterparties' }).fill(COUNTERPARTY);
  await expect(status).not.toHaveText(`${total} results`);
  const filtered = Number((await status.textContent())!.replace(/\D/g, ''));
  expect(filtered).toBeGreaterThan(0);
  expect(filtered).toBeLessThan(total);
  await expect(table).toHaveAttribute('aria-rowcount', String(filtered + 1));
  const counterpartyCol = await table.locator('thead th').evaluateAll((ths) => ths.findIndex((th) => /Counterparty/.test(th.textContent ?? '')));
  expect(counterpartyCol).toBeGreaterThanOrEqual(0);
  const cells = await table.locator(`tbody tr td:nth-child(${counterpartyCol + 1})`).allTextContents();
  expect(cells.length).toBeGreaterThan(0);
  for (const c of cells) expect(c).toContain(COUNTERPARTY);

  const amountHeader = table.locator('th[data-ag-part="table-header-cell"]', { hasText: 'Amount' });
  await expect(amountHeader).toHaveAttribute('aria-sort', 'none');
  await amountHeader.locator('[data-ag-part="table-sort-trigger"]').click();
  await expect(amountHeader).toHaveAttribute('aria-sort', /^(ascending|descending)$/);
  await expect(table.locator('th[aria-sort="ascending"], th[aria-sort="descending"]')).toHaveCount(1);

  expect(errors).toEqual([]);
});
