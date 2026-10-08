/* ChartFrame<TRow> (SURF-181, REQ-SURF-92..94): accessible shell around any
   chart adapter. The root is a SERVER module (REQ-SURF-07): <figure> +
   <figcaption> render in the RSC payload; legend toggles, the measured
   plot context and the table toggle live in ChartFrame.Interactive (the
   client island). render-prop children are invoked inside the island so
   they never cross the RSC boundary. */
import * as React from 'react';
import { ChartFrameInteractive } from './ChartFrame.Interactive';
import type { ChartContext, ChartSeries } from './types';

export interface ChartFrameProps<TRow> {
  title: string;
  description?: React.ReactNode;
  data: readonly TRow[];
  series: readonly ChartSeries[];
  x: { key: string; label: string; format?: Intl.DateTimeFormatOptions | Intl.NumberFormatOptions | undefined };
  yLabel?: string | undefined;
  hiddenSeries?: readonly string[] | undefined;
  defaultHiddenSeries?: readonly string[] | undefined;
  onHiddenSeriesChange?: ((keys: string[]) => void) | undefined;
  legend?: 'top' | 'bottom' | 'none' | undefined;
  table?: 'toggle' | 'visually-hidden' | 'always' | undefined;
  height?: number | undefined;
  children: React.ReactNode | ((ctx: ChartContext<TRow>) => React.ReactNode);
  locale?: string | undefined;
  labels?: { showTable?: string | undefined; hideTable?: string | undefined; lastSeries?: string | undefined } | undefined;
  className?: string | undefined;
}

export function ChartFrame<TRow extends Record<string, unknown>>(props: ChartFrameProps<TRow>) {
  const { title, description, yLabel, className } = props;
  return (
    <figure data-ag-part="chart-frame" className={`ag-chart-frame${className ? ` ${className}` : ''}`}>
      <figcaption className="ag-chart-frame__caption">
        <span data-ag-part="chart-title">{title}</span>
        {description !== undefined && description !== null ? (
          <span data-ag-part="chart-description" className="ag-chart-frame__description">
            {description}
          </span>
        ) : null}
        {yLabel !== undefined ? <span className="ag-visually-hidden">{yLabel}</span> : null}
      </figcaption>
      <ChartFrameInteractive {...props} />
    </figure>
  );
}
