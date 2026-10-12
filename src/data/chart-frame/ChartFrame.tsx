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
  /** Chart title; also the accessible name. */
  title: string;
  /** Description of the chart, linked to it for assistive technology. */
  description?: React.ReactNode;
  /** Rows of data; one point per row and series. */
  data: readonly TRow[];
  /** Series plotted from the rows (key, label, colour). */
  series: readonly ChartSeries[];
  /** Row key, label and format of the x axis. */
  x: { key: string; label: string; format?: Intl.DateTimeFormatOptions | Intl.NumberFormatOptions | undefined };
  /** Label of the y axis. */
  yLabel?: string | undefined;
  /** Controlled keys of hidden series. Pair with `onHiddenSeriesChange`. */
  hiddenSeries?: readonly string[] | undefined;
  /** Initially hidden series keys when uncontrolled. */
  defaultHiddenSeries?: readonly string[] | undefined;
  /** Called with the hidden series keys when the legend toggles one. */
  onHiddenSeriesChange?: ((keys: string[]) => void) | undefined;
  /** Legend position, or none. */
  legend?: 'top' | 'bottom' | 'none' | undefined;
  /** Data table: behind a toggle, visually hidden (screen readers only) or always shown. */
  table?: 'toggle' | 'visually-hidden' | 'always' | undefined;
  /** Plot height in CSS pixels. */
  height?: number | undefined;
  /** An adapter element (RSC-safe) or, from client components, `(ctx) => ReactNode`. */
  children: React.ReactNode | ((ctx: ChartContext<TRow>) => React.ReactNode);
  /** BCP 47 locale used for formatting and parsing. */
  locale?: string | undefined;
  /** Overrides for the built-in, localizable UI strings. */
  labels?: ChartFrameLabels | undefined;
  /** Class name merged onto the root element. */
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
