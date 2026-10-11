/* analytics showcase (REQ-QUAL-58, tier S2, default scene dense-text).
   Composes registry/blocks/analytics-dashboard (contract §3.3) as the account
   overview tab, with its own KPI row, filter bar, chart, top-pages table and a
   metric-definitions popover. */
import * as React from 'react';
import { Button, Popover, Tabs } from 'aura-glass';
import { AppShell, TopBar } from 'aura-glass/app-shell';
import { ChartFrame, FilterBar, Sparkline, StatCard, Table, type ChartContext, type FilterGroup } from 'aura-glass/data';
import { DateRangePicker } from 'aura-glass/date';
import { HelpCircleIcon } from 'aura-glass/icons';
import { AnalyticsDashboard } from '../../registry/blocks/analytics-dashboard/index';
import { COPY, FILTERS, KPI_FORMATS, KPIS, PAGE_COLUMNS, PAGES, SHOWCASE_EPOCH, WAU, type PageRow } from './copy';
import mark from './assets/insight-mark.avif';
import styles from './analytics.module.css';

export interface AnalyticsProps {
  /** Fixed epoch (REQ-QUAL-59 determinism). */
  now?: number;
}

type WauRow = (typeof WAU)[number];
const SERIES = [
  { key: 'web', label: 'Web' },
  { key: 'ios', label: 'iOS' },
  { key: 'android', label: 'Android' },
] as const;

function WauChart() {
  return (
    <ChartFrame
      title={COPY.chartTitle}
      description={COPY.chartDescription}
      data={WAU}
      series={[...SERIES]}
      x={{ key: 'week', label: 'Week' }}
      yLabel="Thousands of users"
      table="always"
    >
      {(ctx: ChartContext<WauRow>) => (
        <svg width="100%" height={ctx.height} viewBox="0 0 640 240" preserveAspectRatio="none" role="img" aria-label={COPY.chartTitle}>
          {ctx.visibleSeries.map((s: { key: string; label: string }) => (
            <polyline
              key={s.key}
              fill="none"
              stroke={ctx.color(s.key)}
              strokeWidth={2}
              points={ctx.data
                .map((d: WauRow, i: number) => `${(i + 0.5) * (640 / ctx.data.length)},${230 - (d[s.key as 'web' | 'ios' | 'android'] ?? 0) * 4}`)
                .join(' ')}
            />
          ))}
        </svg>
      )}
    </ChartFrame>
  );
}

/** Fragment: the filter bar above the weekly-active chart. */
export function AnalyticsFilterChart() {
  const [model, setModel] = React.useState<FilterGroup>({ kind: 'group', id: 'root', combinator: 'and', children: [] });
  const [query, setQuery] = React.useState('');
  return (
    <section className={styles.filterChart} aria-labelledby="an-filters">
      <h2 id="an-filters" className={styles.heading}>{COPY.filtersHeading}</h2>
      <FilterBar
        schema={FILTERS}
        value={model}
        onValueChange={setModel}
        search={{ value: query, onValueChange: setQuery, placeholder: 'Search pages' }}
        resultCount={PAGES.length}
      />
      <WauChart />
    </section>
  );
}

export function Analytics({ now = SHOWCASE_EPOCH }: AnalyticsProps) {
  const generated = new Date(now).toISOString().slice(0, 16).replace('T', ' ');
  return (
    <>
      <AppShell.SkipLink>{COPY.skip}</AppShell.SkipLink>
      <AppShell.Root>
        <TopBar.Root>
          <TopBar.Leading>
            <img className={styles.mark} src={mark} alt="" width={28} height={28} />
            <TopBar.Title>{COPY.product}</TopBar.Title>
          </TopBar.Leading>
          <TopBar.Trailing>
            <DateRangePicker label={COPY.rangeLabel} />
            <Popover.Root>
              <Popover.Trigger render={<Button startIcon={<HelpCircleIcon />} />}>{COPY.definitionsTitle}</Popover.Trigger>
              <Popover.Portal>
                <Popover.Positioner>
                  <Popover.Popup>
                    <Popover.Title>{COPY.definitionsTitle}</Popover.Title>
                    <Popover.Description>{COPY.definitionsBody}</Popover.Description>
                  </Popover.Popup>
                </Popover.Positioner>
              </Popover.Portal>
            </Popover.Root>
          </TopBar.Trailing>
        </TopBar.Root>
        <AppShell.Main>
          <AppShell.PageHeader title={COPY.title} description={`${COPY.description} Generated ${generated} UTC.`} headingLevel={1} />
          <Tabs.Root defaultValue="overview">
            <Tabs.List aria-label="Report sections">
              <Tabs.Tab value="overview">{COPY.tabs.overview}</Tabs.Tab>
              <Tabs.Tab value="funnels">{COPY.tabs.funnels}</Tabs.Tab>
              <Tabs.Tab value="retention">{COPY.tabs.retention}</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="overview">
              <div className={styles.page}>
                <div className={styles.kpis}>
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
                <AnalyticsFilterChart />
                <section className={styles.pages} aria-labelledby="an-pages">
                  <h2 id="an-pages" className={styles.heading}>{COPY.pagesHeading}</h2>
                  <Sparkline data={PAGES.map((p) => p.sessions)} label="Sessions across the top 20 pages" variant="bar" />
                  <Table<PageRow>
                    data={PAGES}
                    columns={PAGE_COLUMNS}
                    getRowId={(r) => r.id}
                    caption={COPY.pagesCaption}
                    defaultSorting={[{ id: 'sessions', desc: true }]}
                    size="sm"
                  />
                </section>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="funnels">
              <section className={styles.page} aria-label={COPY.overviewHeading}>
                <AnalyticsDashboard />
              </section>
            </Tabs.Panel>
            <Tabs.Panel value="retention">
              <section className={styles.page} aria-label={COPY.tabs.retention}>
                <WauChart />
              </section>
            </Tabs.Panel>
          </Tabs.Root>
        </AppShell.Main>
      </AppShell.Root>
    </>
  );
}
