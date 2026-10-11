/* ChartFrame<TRow> (SURF-181, REQ-SURF-92..94): accessible shell around any
   chart adapter. The root is a SERVER module (REQ-SURF-07): <figure> +
   <figcaption> render in the RSC payload, and it composes the client islands
   from ChartFrame.Interactive (Legend, Plot, TableToggle, Table under one
   state root that renders no DOM).

   Adapters, two supported patterns:
   - From a server component, pass the adapter as an ELEMENT of a client
     component (a module marked with the use-client directive) that reads
     the context:
       function RevenueLines() { const ctx = ChartFrame.useContext<Row>(); … }
       <ChartFrame …><RevenueLines /></ChartFrame>
     Only serializable props cross the RSC boundary.
   - From a client component, children may also be a render function
     `(ctx) => ReactNode` (ChartAdapter<TRow>). A function cannot cross the
     RSC boundary, so a server component never passes one. */
import * as React from 'react';
import {
  ChartFrameRoot,
  ChartLegend,
  ChartPlot,
  ChartTable,
  ChartTableToggle,
  useChartContext,
  type ChartFrameLabels,
} from './ChartFrame.Interactive';
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
  /** An adapter element (RSC-safe) or, from client components, `(ctx) => ReactNode`. */
  children: React.ReactNode | ((ctx: ChartContext<TRow>) => React.ReactNode);
  locale?: string | undefined;
  labels?: ChartFrameLabels | undefined;
  className?: string | undefined;
}

export function ChartFrame<TRow extends Record<string, unknown>>({
  title,
  description,
  yLabel,
  className,
  children,
  legend = 'bottom',
  table = 'toggle',
  ...state
}: ChartFrameProps<TRow>) {
  // Under the react-server condition React exports no client hooks, so this
  // is a Server Component render: a function child cannot be passed to the
  // Plot island (REQ-SURF-07). Dev error; the frame and table still render.
  let plot = children as React.ReactNode;
  if (typeof children === 'function' && typeof (React as { useState?: unknown }).useState !== 'function') {
    if (process.env['NODE_ENV'] !== 'production') {
      console.error(
        '[aura-glass] ChartFrame: a function child cannot cross the RSC boundary. From a Server Component pass the ' +
          'adapter as an element of a client component that reads the ChartFrame.useContext hook.',
      );
    }
    plot = null;
  }
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
      <ChartFrameRoot<TRow> {...state} title={title} legend={legend} table={table}>
        {legend === 'none' ? null : <ChartLegend slot="top" />}
        <ChartPlot>{plot}</ChartPlot>
        {table === 'toggle' ? <ChartTableToggle /> : null}
        <ChartTable />
        {legend === 'none' ? null : <ChartLegend slot="bottom" />}
      </ChartFrameRoot>
    </figure>
  );
}

/* Contract namespace (REQ-SURF-01 keeps ./data at its frozen names): the
   context hook for element adapters ships on the component. */
ChartFrame.useContext = useChartContext;
