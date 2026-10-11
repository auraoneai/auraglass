/* financial-dashboard showcase (REQ-QUAL-58, tier S1, default scene flat-white).
   Composes registry/blocks/data-workspace (contract §3.3) in the reconciliation tab,
   around an app-shell page with KPI cards, a chart and a 10,000-row virtualized ledger. */
import * as React from 'react';
import { Field, Pagination, SegmentedControl, Select, Tabs } from 'aura-glass';
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
      <h2 id="fd-kpi-heading" className={styles.sectionHeading}>{COPY.kpiHeading}</h2>
      <div className={styles.kpiRow}>
        {KPIS.map((k, i) => (
          <StatCard
            key={k.label}
            label={k.label}
            value={k.value}
            format={KPI_FORMATS[i]}
            delta={k.delta}
            trendDirection={k.trend}
            sparkline={k.spark}
          />
        ))}
      </div>
    </section>
  );
}

/** Fragment: ledger header plus the first 20 rows (no virtualization). */
export function FinancialDashboardLedgerHead() {
  return (
    <section className={styles.fragment} aria-labelledby="fd-ledger-head">
      <h2 id="fd-ledger-head" className={styles.sectionHeading}>{COPY.ledgerHeading}</h2>
      <Table<LedgerRow>
        data={LEDGER.slice(0, 20)}
        columns={LEDGER_COLUMNS}
        getRowId={(r) => r.id}
        caption={COPY.ledgerCaption}
        stickyHeader
        defaultSorting={[{ id: 'posted', desc: true }]}
      />
    </section>
  );
}

function CashFlowChart() {
  return (
    <ChartFrame
      title={COPY.chartTitle}
      description={COPY.chartDescription}
      data={CASH_FLOW}
      series={[{ key: 'inflow', label: 'Inflow' }, { key: 'outflow', label: 'Outflow' }]}
      x={{ key: 'month', label: 'Month' }}
      yLabel="USD millions"
    >
      {(ctx: ChartContext<(typeof CASH_FLOW)[number]>) => (
        <svg width="100%" height={ctx.height} viewBox="0 0 640 240" preserveAspectRatio="none" role="img" aria-label={COPY.chartTitle}>
          {ctx.visibleSeries.map((s: { key: string; label: string }) => (
            <polyline
              key={s.key}
              fill="none"
              stroke={ctx.color(s.key)}
              strokeWidth={2}
              points={ctx.data
                .map((d: (typeof CASH_FLOW)[number], i: number) => `${(i + 0.5) * (640 / ctx.data.length)},${230 - (d[s.key as 'inflow' | 'outflow'] ?? 0) * 14}`)
                .join(' ')}
            />
          ))}
        </svg>
      )}
    </ChartFrame>
  );
}

export function FinancialDashboard({ now = SHOWCASE_EPOCH }: FinancialDashboardProps) {
  const [filters, setFilters] = React.useState<FilterGroup>({ kind: 'group', id: 'root', combinator: 'and', children: [] });
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [granularity, setGranularity] = React.useState('month');
  const asOf = new Date(now).toISOString().slice(0, 10);
  const visible = React.useMemo(
    () => (query ? LEDGER.filter((r) => r.counterparty.toLowerCase().includes(query.toLowerCase())) : LEDGER),
    [query],
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
                <section className={styles.chart} aria-labelledby="fd-chart-heading">
                  <div className={styles.chartHeader}>
                    <h2 id="fd-chart-heading" className={styles.sectionHeading}>{COPY.chartTitle}</h2>
                    <SegmentedControl.Root aria-label={COPY.granularityLabel} value={granularity} onValueChange={(v: string) => setGranularity(v)}>
                      <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
                      <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
                      <SegmentedControl.Item value="quarter">Quarter</SegmentedControl.Item>
                    </SegmentedControl.Root>
                  </div>
                  <CashFlowChart />
                  <Sparkline data={BALANCE_TREND} label={COPY.trendLabel} variant="area" showLastPoint />
                </section>
                <section className={styles.ledger} aria-labelledby="fd-ledger-heading">
                  <h2 id="fd-ledger-heading" className={styles.sectionHeading}>{COPY.ledgerHeading}</h2>
                  <FilterBar
                    schema={LEDGER_FILTERS}
                    value={filters}
                    onValueChange={(g: FilterGroup) => { setFilters(g); setPage(1); }}
                    search={{ value: query, onValueChange: (v: string) => { setQuery(v); setPage(1); }, placeholder: 'Search counterparties' }}
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
                  <Pagination.Root
                    aria-label="Ledger pages"
                    page={page}
                    pageCount={Math.ceil(visible.length / PAGE_SIZE)}
                    onPageChange={setPage}
                  />
                </section>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="ledger">
              <FinancialDashboardLedgerHead />
            </Tabs.Panel>
            <Tabs.Panel value="reconciliation">
              <section className={styles.fragment} aria-label={COPY.workspaceHeading}>
                <DataWorkspace />
              </section>
            </Tabs.Panel>
          </Tabs.Root>
        </AppShell.Main>
      </AppShell.Root>
    </>
  );
}
