/* analytics showcase (REQ-QUAL-58, tier S2, default scene dense-text).
   Composes registry/blocks/analytics-dashboard (contract §3.3) as the account
   overview tab, with its own KPI row, filter bar, chart, top-pages table and a
   metric-definitions popover.
   Material roles: the TopBar and the popover are the glass layers; the report is a
   content-sunken page with content-raised Cards for the chart and the table, so no
   figure or label is set straight on the busy text scene. */
import * as React from 'react';
import { Button, Card, Heading, Popover, Surface, Tabs, Text } from 'aura-glass';
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

/* Plot geometry: 0–50k users across the full 240-unit plot height. */
const PLOT_W = 640;
const PLOT_H = 240;
const Y_MAX = 50;
const yOf = (v: number) => PLOT_H - 8 - (v / Y_MAX) * (PLOT_H - 16);

function WauChart() {
  return (
    <ChartFrame
      title={COPY.chartTitle}
      description={COPY.chartDescription}
      data={WAU}
      series={[...SERIES]}
      x={{ key: 'week', label: 'Week' }}
      yLabel="Thousands of users"
      table="toggle"
    >
      {(ctx: ChartContext<WauRow>) => (
        <svg width="100%" height={ctx.height} viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} preserveAspectRatio="none" role="img" aria-label={COPY.chartTitle}>
          {[10, 20, 30, 40, 50].map((g) => (
            <line
              key={g}
              x1={0}
              x2={PLOT_W}
              y1={yOf(g)}
              y2={yOf(g)}
              stroke="currentColor"
              strokeOpacity={0.12}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {ctx.visibleSeries.map((s: { key: string; label: string }) => (
            <polyline
              key={s.key}
              fill="none"
              stroke={ctx.color(s.key)}
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              points={ctx.data
                .map((d: WauRow, i: number) => `${(i + 0.5) * (PLOT_W / ctx.data.length)},${yOf(d[s.key as 'web' | 'ios' | 'android'] ?? 0)}`)
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
    <Card.Root className={styles.card} render={<section aria-labelledby="an-filters" />}>
      <div className={styles.cardHead}>
        <Heading level={2} size="title-3" id="an-filters">
          {COPY.filtersHeading}
        </Heading>
        <Text type="caption" muted>{COPY.filtersBody}</Text>
      </div>
      <FilterBar
        schema={FILTERS}
        value={model}
        onValueChange={setModel}
        search={{ value: query, onValueChange: setQuery, placeholder: 'Search pages' }}
        resultCount={PAGES.length}
      />
      <WauChart />
    </Card.Root>
  );
}

export function Analytics({ now = SHOWCASE_EPOCH }: AnalyticsProps) {
  const generated = new Date(now).toISOString().slice(0, 16).replace('T', ' ');
  return (
    <AppShell.Root defaultSidebar="collapsed">
      <AppShell.SkipLink>{COPY.skip}</AppShell.SkipLink>
      <TopBar.Root>
        <TopBar.Leading>
          <img className={styles.mark} src={mark} alt="" width={28} height={28} />
          <TopBar.Title>{COPY.product}</TopBar.Title>
        </TopBar.Leading>
        <TopBar.Trailing>
          <DateRangePicker label={COPY.rangeLabel} />
          <Popover.Root>
            <Popover.Trigger render={<Button variant="clear" startIcon={<HelpCircleIcon />} />}>{COPY.definitionsTitle}</Popover.Trigger>
            <Popover.Content>
              <Popover.Title>{COPY.definitionsTitle}</Popover.Title>
              <Popover.Description>{COPY.definitionsBody}</Popover.Description>
            </Popover.Content>
          </Popover.Root>
        </TopBar.Trailing>
      </TopBar.Root>
      <AppShell.Main>
        <div className={styles.frame}>
          <Surface layer="content" content="content-sunken" className={styles.report}>
            <AppShell.PageHeader title={COPY.title} description={`${COPY.description} Generated ${generated} UTC.`} headingLevel={1} />
            <div className={styles.body}>
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
                    <Card.Root className={styles.card} render={<section aria-labelledby="an-pages" />}>
                      <div className={styles.cardHead}>
                        <Heading level={2} size="title-3" id="an-pages">
                          {COPY.pagesHeading}
                        </Heading>
                        <Text type="caption" muted>{COPY.pagesBody}</Text>
                      </div>
                      <Sparkline data={PAGES.map((p) => p.sessions)} label="Sessions across the top 20 pages" appearance="bar" />
                      <Table<PageRow>
                        data={PAGES}
                        columns={PAGE_COLUMNS}
                        getRowId={(r) => r.id}
                        caption={COPY.pagesCaption}
                        defaultSorting={[{ id: 'sessions', desc: true }]}
                        size="sm"
                      />
                    </Card.Root>
                  </div>
                </Tabs.Panel>
                <Tabs.Panel value="funnels">
                  <section className={styles.page} aria-label={COPY.overviewHeading}>
                    <Card.Root className={styles.card}>
                      <AnalyticsDashboard />
                    </Card.Root>
                  </section>
                </Tabs.Panel>
                <Tabs.Panel value="retention">
                  <section className={styles.page} aria-label={COPY.tabs.retention}>
                    <Card.Root className={styles.card}>
                      <WauChart />
                    </Card.Root>
                  </section>
                </Tabs.Panel>
              </Tabs.Root>
            </div>
          </Surface>
        </div>
      </AppShell.Main>
    </AppShell.Root>
  );
}
