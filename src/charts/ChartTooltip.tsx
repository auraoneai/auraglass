'use client';
/* ChartTooltip — client crosshair island (SURF-247): tooltip + focus cursor
   announcement shared across series. */
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
    <div data-ag-part="chart-tooltip" className="ag-chart__tooltip" role="status" style={{ insetInlineStart: x }}>
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
