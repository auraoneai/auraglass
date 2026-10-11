/* analytics copy and deterministic data (REQ-QUAL-58 / REQ-QUAL-59). */
import type { FilterField, TableColumnDef } from 'aura-glass/data';

/** Fixed showcase epoch: 2026-03-02T09:30:00Z. */
export const SHOWCASE_EPOCH = Date.UTC(2026, 2, 2, 9, 30, 0);

export const COPY = {
  product: 'Signalboard',
  skip: 'Skip to report',
  title: 'Product analytics — February 2026',
  description: 'Web and mobile, all regions. Sessions are de-duplicated across devices for signed-in users.',
  rangeLabel: 'Date range',
  filtersHeading: 'Filters',
  chartTitle: 'Weekly active users by platform',
  chartDescription: 'Distinct users with at least one session, weeks 1 to 8.',
  pagesHeading: 'Top pages',
  pagesCaption: 'Top pages by sessions',
  overviewHeading: 'Account overview',
  definitionsTitle: 'Metric definitions',
  definitionsBody:
    'Active user: signed-in or device-identified user with at least one foreground session longer than 10 seconds. Conversion: completed checkout within 7 days of first session.',
  tabs: { overview: 'Overview', funnels: 'Funnels', retention: 'Retention' },
} as const;

export const WAU = [
  { week: 'W1', web: 41.2, ios: 28.4, android: 22.9 },
  { week: 'W2', web: 42.0, ios: 29.1, android: 23.4 },
  { week: 'W3', web: 43.7, ios: 29.8, android: 23.0 },
  { week: 'W4', web: 44.1, ios: 31.2, android: 24.6 },
  { week: 'W5', web: 43.5, ios: 31.9, android: 25.1 },
  { week: 'W6', web: 45.8, ios: 32.4, android: 25.8 },
  { week: 'W7', web: 46.9, ios: 33.0, android: 26.4 },
  { week: 'W8', web: 47.6, ios: 33.8, android: 27.1 },
];

export const FILTERS: FilterField[] = [
  { id: 'platform', label: 'Platform', type: 'enum', options: [{ value: 'web', label: 'Web' }, { value: 'ios', label: 'iOS' }, { value: 'android', label: 'Android' }] },
  { id: 'country', label: 'Country', type: 'text' },
  { id: 'sessions', label: 'Sessions', type: 'number' },
];

export const KPIS = [
  { label: 'Weekly active users', value: 108_500, delta: 0.046, trend: 'up-is-good', spark: [92.5, 94.5, 96.5, 99.9, 100.5, 104.0, 106.3, 108.5] },
  { label: 'Conversion rate', value: 0.0412, delta: 0.018, trend: 'up-is-good', spark: [3.6, 3.7, 3.8, 3.9, 3.9, 4.0, 4.1, 4.12] },
  { label: 'Median session', value: 312, delta: -0.021, trend: 'up-is-good', spark: [330, 326, 321, 318, 315, 314, 313, 312] },
  { label: 'Crash-free sessions', value: 0.9962, delta: 0.002, trend: 'up-is-good', spark: [99.3, 99.4, 99.5, 99.5, 99.6, 99.6, 99.6, 99.62] },
] as const;

export const KPI_FORMATS = [
  { maximumFractionDigits: 0 },
  { style: 'percent', maximumFractionDigits: 2 },
  { style: 'unit', unit: 'second', unitDisplay: 'short' },
  { style: 'percent', maximumFractionDigits: 2 },
] as const satisfies readonly Intl.NumberFormatOptions[];

export type PageRow = { id: string; path: string; sessions: number; users: number; bounce: string; conversion: string };

const PATHS = ['/pricing', '/checkout', '/docs/getting-started', '/blog/release-5', '/signup', '/account/billing', '/integrations/slack',
  '/docs/api/auth', '/compare/alternatives', '/careers', '/changelog', '/security', '/docs/sdk/ios', '/docs/sdk/android',
  '/customers/northwind', '/events/summit-2026', '/status', '/contact-sales', '/templates/onboarding', '/legal/privacy'];

export const PAGES: PageRow[] = PATHS.map((path, i) => ({
  id: `p-${i}`,
  path,
  sessions: 182_400 - i * 7_310,
  users: 121_900 - i * 4_870,
  bounce: `${(28 + ((i * 7) % 31)).toFixed(0)}%`,
  conversion: `${(6.4 - i * 0.27).toFixed(2)}%`,
}));

export const PAGE_COLUMNS: TableColumnDef<PageRow>[] = [
  { accessorKey: 'path', header: 'Page', meta: { headerLabel: 'Page path' } },
  { accessorKey: 'sessions', header: 'Sessions', meta: { headerLabel: 'Sessions', numeric: true } },
  { accessorKey: 'users', header: 'Users', meta: { headerLabel: 'Users', numeric: true } },
  { accessorKey: 'bounce', header: 'Bounce', meta: { headerLabel: 'Bounce rate' } },
  { accessorKey: 'conversion', header: 'Conversion', meta: { headerLabel: 'Conversion rate' } },
];
