/* analytics-dashboard (REQ-SURF-171): StatCard row + Sparkline + ChartFrame
   + Timeline. */
import * as React from 'react';
import { ChartFrame, Sparkline, StatCard } from 'aura-glass/data';
import { Timeline } from 'aura-glass';
import { CHART_ROWS, EVENTS, SPARK, STATS } from './fixtures';

export function AnalyticsDashboard() {
  return (
    <div data-ag-part="analytics-dashboard" className="ag-analytics-dashboard" style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        {STATS.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} delta={s.delta} trendDirection="up-is-good" sparkline={[...SPARK]} />
        ))}
      </div>
      <Sparkline data={[...SPARK]} label="Weekly active" appearance="area" />
      <ChartFrame title="Product revenue" data={[...CHART_ROWS]} series={[{ key: 'alpha', label: 'Alpha' }, { key: 'beta', label: 'Beta' }]} x={{ key: 'm', label: 'Month' }}>
        {(ctx: import('aura-glass/data').ChartContext<typeof CHART_ROWS[number]>) => (
          <svg width="100%" height={ctx.height} role="img" aria-label="Revenue chart">
            {ctx.visibleSeries.map((s: { key: string; label: string }) => (
              <polyline key={s.key} fill="none" stroke={ctx.color(s.key)} strokeWidth={2}
                points={ctx.data.map((d: (typeof CHART_ROWS)[number], i: number) => `${(i + 0.5) * (640 / ctx.data.length)},${220 - ((d as unknown as Record<string, number>)[s.key] ?? 0) * 2}`).join(' ')} />
            ))}
          </svg>
        )}
      </ChartFrame>
      <Timeline items={[...EVENTS]} timeFormat="absolute" />
    </div>
  );
}
