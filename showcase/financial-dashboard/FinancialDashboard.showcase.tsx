/* financial-dashboard showcase (REQ-QUAL-58, tier S1, default scene flat-white).
   Composes registry/blocks/data-workspace (contract §3.3) in the reconciliation tab,
   around an app-shell page with KPI cards, a chart and a 10,000-row virtualized ledger. */
import * as React from 'react';
import { Card, Field, Heading, Pagination, SegmentedControl, Select, Tabs } from 'aura-glass';
import { AppShell, TopBar } from 'aura-glass/app-shell';
import { ChartFrame, FilterBar, Sparkline, StatCard, Table, type ChartContext, type FilterGroup } from 'aura-glass/data';
import { DateRangePicker } from 'aura-glass/date';
import { DataWorkspace } from '../../registry/blocks/data-workspace/index';
import {
  BALANCE_TREND,
  CASH_FLOW,
  COPY,
  CURRENCIES,
  KPI_FORMATS,
  KPIS,
  LEDGER,
  LEDGER_COLUMNS,
  LEDGER_FILTERS,
  PAGE_SIZE,
  PERIODS,
  SHOWCASE_EPOCH,
  type LedgerRow,
} from './copy';
import logo from './assets/ledgerline-mark.avif';
import styles from './financial-dashboard.module.css';

export interface FinancialDashboardProps {
  /** Fixed epoch for every time-derived value (REQ-QUAL-59 determinism). */
  now?: number;
}

/** Fragment: the four KPI cards. */
export function FinancialDashboardKpis() {
  return (
    <section className={styles.kpis} aria-labelledby="fd-kpi-heading">
      <Heading level={2} size="title-3" id="fd-kpi-heading" className={styles.sectionHeading}>
        {COPY.kpiHeading}
      </Heading>
      <div className={styles.kpiRow}>
        {/* StatCard paints its own flat fill with no rim or depth, so on the flat-white
            scene the tiles had no edge. Each tile sits in a content-raised Card that
            supplies the material rim, shadow and radius; the card clips the tile. */}
        {KPIS.map((k, i) => (
          <Card.Root key={k.label} className={styles.kpiCard}>
            <StatCard
              label={k.label}
              value={k.value}
              format={KPI_FORMATS[i]}
              delta={k.delta}
              trendDirection={k.trend}
              sparkline={k.spark}
            />
          </Card.Root>
        ))}
      </div>
    </section>
  );
}

export interface FinancialDashboardLedgerHeadProps {
  /** 1-based page of PAGE_SIZE rows; omitted, the fragment shows the first page only. */
  page?: number;
  /** When set, a Pagination control pages through the full ledger. */
  onPageChange?: (page: number) => void;
}

/** Fragment: ledger header plus one page of 20 rows (no virtualization). The Ledger
    tab wires `onPageChange` so Pagination actually moves through the ledger. */
export function FinancialDashboardLedgerHead({ page = 1, onPageChange }: FinancialDashboardLedgerHeadProps) {
  const start = (page - 1) * PAGE_SIZE;
  return (
    <Card.Root className={styles.fragment} render={<section aria-labelledby="fd-ledger-head" />}>
      <Heading level={2} size="title-3" id="fd-ledger-head" className={styles.sectionHeading}>
        {COPY.ledgerHeading}
      </Heading>
      <Table<LedgerRow>
        data={LEDGER.slice(start, start + PAGE_SIZE)}
        columns={LEDGER_COLUMNS}
        getRowId={(r) => r.id}
        caption={COPY.ledgerCaption}
        stickyHeader
        defaultSorting={[{ id: 'posted', desc: true }]}
      />
      {onPageChange ? (
        <Pagination.Root
          aria-label="Ledger pages"
          page={page}
          pageCount={Math.ceil(LEDGER.length / PAGE_SIZE)}
          onPageChange={onPageChange}
        />
      ) : null}
    </Card.Root>
  );
}

/* Chart geometry in viewBox units: a fixed USD-millions domain with padding so
   both series use the plot height instead of bunching in the top third. */
const CHART_W = 640;
const CHART_H = 240;
const PLOT = { top: 12, right: 12, bottom: 28, left: 36 } as const;
const Y_DOMAIN = [8, 16] as const;
const Y_TICKS = [8, 10, 12, 14, 16] as const;
const xAt = (i: number, n: number) => PLOT.left + (i + 0.5) * ((CHART_W - PLOT.left - PLOT.right) / n);
const yAt = (v: number) => PLOT.top + (1 - (v - Y_DOMAIN[0]) / (Y_DOMAIN[1] - Y_DOMAIN[0])) * (CHART_H - PLOT.top - PLOT.bottom);

function CashFlowChart() {
  return (
    <ChartFrame
      title={COPY.chartTitle}
      description={COPY.chartDescription}
      data={CASH_FLOW}
      series={[
        { key: 'inflow', label: 'Inflow' },
        { key: 'outflow', label: 'Outflow' },
      ]}
      x={{ key: 'month', label: 'Month' }}
      yLabel="USD millions"
    >
      {(ctx: ChartContext<(typeof CASH_FLOW)[number]>) => (
        <svg width="100%" height={ctx.height} viewBox={`0 0 ${CHART_W} ${CHART_H}`} role="img" aria-label={COPY.chartTitle}>
          <g fill="currentColor" fontSize={11} opacity={0.62}>
            {Y_TICKS.map((t) => (
              <g key={t}>
                <line x1={PLOT.left} x2={CHART_W - PLOT.right} y1={yAt(t)} y2={yAt(t)} stroke="currentColor" strokeOpacity={0.18} />
                <text x={PLOT.left - 8} y={yAt(t)} textAnchor="end" dominantBaseline="middle">
                  {t}
                </text>
              </g>
            ))}
            {ctx.data.map((d: (typeof CASH_FLOW)[number], i: number) => (
              <text key={d.month} x={xAt(i, ctx.data.length)} y={CHART_H - 8} textAnchor="middle">
                {d.month}
              </text>
            ))}
          </g>
          {ctx.visibleSeries.map((s: { key: string; label: string }) => {
            const pts = ctx.data.map(
              (d: (typeof CASH_FLOW)[number], i: number) =>
                [xAt(i, ctx.data.length), yAt(d[s.key as 'inflow' | 'outflow'] ?? Y_DOMAIN[0])] as const
            );
            return (
              <g key={s.key} stroke={ctx.color(s.key)} fill={ctx.color(s.key)}>
                <polyline
                  fill="none"
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points={pts.map(([x, y]) => `${x},${y}`).join(' ')}
                />
                {pts.map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r={3.5} strokeWidth={0} />
                ))}
              </g>
            );
          })}
        </svg>
      )}
    </ChartFrame>
  );
}

export function FinancialDashboard({ now = SHOWCASE_EPOCH }: FinancialDashboardProps) {
  const [filters, setFilters] = React.useState<FilterGroup>({
    kind: 'group',
    id: 'root',
    combinator: 'and',
    children: [],
  });
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [granularity, setGranularity] = React.useState('month');
  const asOf = new Date(now).toISOString().slice(0, 10);
  const visible = React.useMemo(
    () => (query ? LEDGER.filter((r) => r.counterparty.toLowerCase().includes(query.toLowerCase())) : LEDGER),
    [query]
  );
  return (
    <>
      <AppShell.SkipLink>{COPY.skip}</AppShell.SkipLink>
      <AppShell.Root>
        <TopBar.Root>
          <TopBar.Leading>
            <img className={styles.mark} src={logo} alt="" width={28} height={28} />
            <TopBar.Title>{COPY.product}</TopBar.Title>
          </TopBar.Leading>
          <TopBar.Trailing>
            <div className={styles.toolbar}>
              <Field.Root>
                <Field.Label>{COPY.currencyLabel}</Field.Label>
                <Select.Root defaultValue="USD">
                  <Select.Trigger placeholder="USD" />
                  <Select.Content>
                    {CURRENCIES.map((c) => (
                      <Select.Item key={c.value} value={c.value} label={c.label} />
                    ))}
                  </Select.Content>
                </Select.Root>
              </Field.Root>
              <DateRangePicker label={COPY.periodLabel} />
            </div>
          </TopBar.Trailing>
        </TopBar.Root>
        <AppShell.Main>
          <div className={styles.page}>
          <AppShell.PageHeader
            title={COPY.pageTitle}
            description={`${COPY.pageDescription} As of ${asOf}.`}
            headingLevel={1}
          />
          <Tabs.Root defaultValue="overview">
            <Tabs.List aria-label="Dashboard sections">
              <Tabs.Tab value="overview">{COPY.tabs.overview}</Tabs.Tab>
              <Tabs.Tab value="ledger">{COPY.tabs.ledger}</Tabs.Tab>
              <Tabs.Tab value="reconciliation">{COPY.tabs.reconciliation}</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="overview">
              <div className={styles.overview}>
                <FinancialDashboardKpis />
                <Card.Root className={styles.chart} render={<section aria-labelledby="fd-chart-heading" />}>
                  <div className={styles.chartHeader}>
                    <Heading level={2} size="title-3" id="fd-chart-heading" className={styles.sectionHeading}>
                      {COPY.chartTitle}
                    </Heading>
                    <SegmentedControl.Root
                      name="fd-granularity"
                      aria-label={COPY.granularityLabel}
                      value={granularity}
                      onValueChange={(v: string) => setGranularity(v)}
                    >
                      <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
                      <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
                      <SegmentedControl.Item value="quarter">Quarter</SegmentedControl.Item>
                    </SegmentedControl.Root>
                  </div>
                  <CashFlowChart />
                  <Sparkline data={BALANCE_TREND} label={COPY.trendLabel} variant="area" showLastPoint />
                </Card.Root>
                <Card.Root className={styles.ledger} render={<section aria-labelledby="fd-ledger-heading" />}>
                  <Heading level={2} size="title-3" id="fd-ledger-heading" className={styles.sectionHeading}>
                    {COPY.ledgerHeading}
                  </Heading>
                  <FilterBar
                    schema={LEDGER_FILTERS}
                    value={filters}
                    onValueChange={(g: FilterGroup) => setFilters(g)}
                    search={{
                      value: query,
                      onValueChange: (v: string) => setQuery(v),
                      placeholder: 'Search counterparties',
                    }}
                    resultCount={visible.length}
                  />
                  <Table<LedgerRow>
                    data={visible}
                    columns={LEDGER_COLUMNS}
                    getRowId={(r) => r.id}
                    caption={COPY.ledgerCaption}
                    selectionMode="multiple"
                    defaultSorting={[{ id: 'posted', desc: true }]}
                    stickyHeader
                    virtualize
                    maxHeight={480}
                  />
                </Card.Root>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="ledger">
              <div className={styles.overview}>
                <FinancialDashboardLedgerHead page={page} onPageChange={setPage} />
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="reconciliation">
              <div className={styles.overview}>
                <Card.Root className={styles.fragment} render={<section aria-label={COPY.workspaceHeading} />}>
                  <DataWorkspace />
                </Card.Root>
              </div>
            </Tabs.Panel>
          </Tabs.Root>
          </div>
        </AppShell.Main>
      </AppShell.Root>
    </>
  );
}
