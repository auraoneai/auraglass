/* ChartTooltip (SURF-247, REQ-SURF-161): the crosshair tooltip for the
   active datum (pointer crosshair or keyboard cursor), shared across series.
   Pure and server-safe; the pointer/keyboard state that drives it lives in
   the ChartPlot client island. It is a visual duplicate of the plot's polite
   live region, so it is aria-hidden and never announces on its own. */
import * as React from 'react';
import type { ChartContext } from '../data/chart-frame/types';

export interface ChartTooltipProps<TRow> {
  ctx: ChartContext<TRow>;
  index: number | null;
  x: number;
  xKey: string;
}

export function ChartTooltip<TRow>({ ctx, index, x, xKey }: ChartTooltipProps<TRow>) {
  if (index === null || ctx.data[index] === undefined) return null;
  const d = ctx.data[index]!;
  return (
    <div data-ag-part="chart-tooltip" className="ag-chart__tooltip" aria-hidden="true" style={{ insetInlineStart: x }}>
      <strong>{String(ctx.formatX((d as Record<string, unknown>)[xKey]))}</strong>
      <ul>
        {ctx.visibleSeries.map((s) => (
          <li key={s.key}>
            <span className="ag-chart__tooltip-swatch" style={{ background: ctx.color(s.key) }} aria-hidden="true" />
            {s.label}: {ctx.formatY((d as Record<string, unknown>)[s.key], s)}
          </li>
        ))}
      </ul>
    </div>
  );
}
