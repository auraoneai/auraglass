/* financial-dashboard copy and deterministic data (REQ-QUAL-58 / REQ-QUAL-59).
   The 10,000-row ledger is generated arithmetically: no randomness, no clock. */
import type { FilterField, TableColumnDef } from 'aura-glass/data';

/** Fixed showcase epoch: 2026-03-02T09:30:00Z. */
export const SHOWCASE_EPOCH = Date.UTC(2026, 2, 2, 9, 30, 0);

export const COPY = {
  product: 'Ledgerline Treasury',
  skip: 'Skip to dashboard',
  pageTitle: 'Q1 2026 cash position',
  pageDescription: 'Consolidated across 14 operating accounts in 6 currencies. Figures in USD at the 09:00 UTC fix.',
  periodLabel: 'Reporting period',
  currencyLabel: 'Reporting currency',
  granularityLabel: 'Chart granularity',
  kpiHeading: 'Key figures',
  chartTitle: 'Net cash flow by month',
  chartDescription: 'Operating inflows against outflows, January to June 2026.',
  ledgerHeading: 'Transaction ledger',
  ledgerCaption: 'Posted transactions, newest first',
  workspaceHeading: 'Reconciliation workspace',
  trendLabel: 'Daily closing balance, last 14 days',
  tabs: { overview: 'Overview', ledger: 'Ledger', reconciliation: 'Reconciliation' },
} as const;

export const KPIS = [
  { label: 'Cash on hand', value: 48_215_900, delta: 0.042, trend: 'up-is-good', spark: [41.2, 42.8, 43.1, 44.9, 45.6, 46.3, 48.2] },
  { label: 'Operating burn', value: 3_184_200, delta: -0.067, trend: 'down-is-good', spark: [3.6, 3.5, 3.5, 3.4, 3.3, 3.2, 3.18] },
  { label: 'Receivables > 60 days', value: 1_942_750, delta: 0.118, trend: 'down-is-good', spark: [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.94] },
  { label: 'Runway', value: 15.1, delta: 0.031, trend: 'up-is-good', spark: [13.8, 14.0, 14.3, 14.5, 14.7, 14.9, 15.1] },
] as const;

export const KPI_FORMATS = [
  { style: 'currency', currency: 'USD', maximumFractionDigits: 0 },
  { style: 'currency', currency: 'USD', maximumFractionDigits: 0 },
  { style: 'currency', currency: 'USD', maximumFractionDigits: 0 },
  { style: 'unit', unit: 'month', unitDisplay: 'long', maximumFractionDigits: 1 },
] as const satisfies readonly Intl.NumberFormatOptions[];

export const BALANCE_TREND = [46.1, 46.4, 46.0, 46.9, 47.3, 47.1, 47.6, 47.9, 47.5, 47.8, 48.0, 47.7, 48.1, 48.2];

export const CASH_FLOW = [
  { month: 'Jan', inflow: 12.4, outflow: 9.8 },
  { month: 'Feb', inflow: 11.9, outflow: 10.2 },
  { month: 'Mar', inflow: 13.6, outflow: 10.1 },
  { month: 'Apr', inflow: 14.2, outflow: 10.9 },
  { month: 'May', inflow: 13.8, outflow: 11.3 },
  { month: 'Jun', inflow: 15.1, outflow: 11.0 },
];

export const PERIODS = [
  { value: 'q1-2026', label: 'Q1 2026' },
  { value: 'q4-2025', label: 'Q4 2025' },
  { value: 'fy-2025', label: 'FY 2025' },
] as const;

export const CURRENCIES = [
  { value: 'USD', label: 'US dollar (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'GBP', label: 'Pound sterling (GBP)' },
  { value: 'JPY', label: 'Japanese yen (JPY)' },
] as const;

export interface LedgerRow {
  id: string;
  posted: string;
  counterparty: string;
  account: string;
  category: string;
  amount: number;
  status: 'Posted' | 'Pending' | 'Flagged';
}

const COUNTERPARTIES = ['Atlas Logistics', 'Brightwater Utilities', 'Corvid Software', 'Delta Freight', 'Evergreen Leasing',
  'Fjord Payroll', 'Granite Insurance', 'Harbor Cloud', 'Ivory Legal', 'Juniper Foods', 'Kestrel Media', 'Lumen Energy'];
const ACCOUNTS = ['Operating USD 0142', 'Payroll USD 0388', 'Reserve EUR 2210', 'Collections GBP 7731', 'Treasury JPY 5507'];
const CATEGORIES = ['Vendor payment', 'Payroll', 'Customer receipt', 'Tax remittance', 'Intercompany transfer', 'Card settlement'];
const STATUSES: LedgerRow['status'][] = ['Posted', 'Posted', 'Posted', 'Pending', 'Posted', 'Flagged', 'Posted'];

function ledgerRow(i: number): LedgerRow {
  const day = new Date(SHOWCASE_EPOCH - Math.floor(i / 120) * 86_400_000);
  const sign = i % 3 === 0 ? 1 : -1;
  const amount = sign * (((i * 7919) % 250_000) + 125) / 100;
  return {
    id: `TX-${String(100_000 + i)}`,
    posted: day.toISOString().slice(0, 10),
    counterparty: COUNTERPARTIES[i % COUNTERPARTIES.length]!,
    account: ACCOUNTS[(i * 3) % ACCOUNTS.length]!,
    category: CATEGORIES[(i * 5) % CATEGORIES.length]!,
    amount,
    status: STATUSES[i % STATUSES.length]!,
  };
}

/** 10,000 ledger rows for the virtualized table (REQ-QUAL-58 financial-dashboard). */
export const LEDGER: LedgerRow[] = Array.from({ length: 10_000 }, (_, i) => ledgerRow(i));

export const LEDGER_COLUMNS: TableColumnDef<LedgerRow>[] = [
  { accessorKey: 'id', header: 'Reference', meta: { headerLabel: 'Reference' } },
  { accessorKey: 'posted', header: 'Posted', meta: { headerLabel: 'Posted date' } },
  { accessorKey: 'counterparty', header: 'Counterparty', meta: { headerLabel: 'Counterparty' } },
  { accessorKey: 'account', header: 'Account', meta: { headerLabel: 'Account' } },
  { accessorKey: 'category', header: 'Category', meta: { headerLabel: 'Category' } },
  { accessorKey: 'amount', header: 'Amount (USD)', meta: { headerLabel: 'Amount in US dollars', numeric: true } },
  { accessorKey: 'status', header: 'Status', meta: { headerLabel: 'Status' } },
];

export const LEDGER_FILTERS: FilterField[] = [
  { id: 'counterparty', label: 'Counterparty', type: 'text' },
  { id: 'amount', label: 'Amount', type: 'number' },
  {
    id: 'status',
    label: 'Status',
    type: 'enum',
    options: [{ value: 'Posted', label: 'Posted' }, { value: 'Pending', label: 'Pending' }, { value: 'Flagged', label: 'Flagged' }],
  },
];

export const PAGE_SIZE = 20;
