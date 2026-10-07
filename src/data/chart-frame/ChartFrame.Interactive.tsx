'use client';
/* ChartFrame.Interactive — the client island inside the ChartFrame server
   root: legend toggle buttons (last visible series protected), the
   ResizeObserver-measured plot context, reduced-motion detection and the
   three-mode table fallback. */
import * as React from 'react';
import type { ChartContext, ChartSeries } from './types';
import type { ChartFrameProps } from './ChartFrame';

export function ChartFrameInteractive<TRow extends Record<string, unknown>>({
  title,
  data,
  series,
  x,
  hiddenSeries,
  defaultHiddenSeries,
  onHiddenSeriesChange,
  legend = 'bottom',
  table = 'toggle',
  height = 240,
  children,
  locale = 'en-US',
  labels,
}: ChartFrameProps<TRow>) {
  const [innerHidden, setInnerHidden] = React.useState<readonly string[]>(defaultHiddenSeries ?? []);
  const hidden = hiddenSeries ?? innerHidden;
  const setHidden = (next: readonly string[]) => {
    if (hiddenSeries === undefined) setInnerHidden(next);
    onHiddenSeriesChange?.([...next]);
  };
  const [tableOpen, setTableOpen] = React.useState(table === 'always');
  const [width, setWidth] = React.useState<number | undefined>(undefined);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const plotRef = React.useRef<HTMLDivElement | null>(null);
  const tableId = React.useId();

  React.useEffect(() => {
    const el = plotRef.current;
    if (el === null || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver((entries) => {
      setWidth(entries[0]?.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    if (typeof matchMedia !== 'function') return undefined;
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReducedMotion(mq.matches);
    on();
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);

  const visible = series.filter((s) => !hidden.includes(s.key));
  const colorOf = (key: string) => {
    const i = series.findIndex((s) => s.key === key);
    const s = series[i];
    const idx = s?.colorIndex ?? ((i % 8) + 1);
    return `var(--_ag-chart-${idx})`;
  };
  const fmtX = (v: unknown) =>
    typeof v === 'number'
      ? new Intl.NumberFormat(locale, x.format as Intl.NumberFormatOptions | undefined).format(v)
      : v instanceof Date
        ? new Intl.DateTimeFormat(locale, x.format as Intl.DateTimeFormatOptions | undefined).format(v)
        : String(v ?? '');
  const fmtY = (v: unknown, s?: ChartSeries) =>
    typeof v === 'number' ? new Intl.NumberFormat(locale, s?.format).format(v) : String(v ?? '');

  const ctx: ChartContext<TRow> = {
    width,
    height,
    data,
    visibleSeries: visible,
    color: colorOf,
    formatX: fmtX,
    formatY: fmtY,
    reducedMotion,
    dir: 'ltr',
  };

  const legendNode = legend !== 'none' && (
    <div data-ag-part="chart-legend" className="ag-chart-frame__legend" role="group" aria-label="Series">
      {series.map((s) => {
        const isHidden = hidden.includes(s.key);
        const isLastVisible = !isHidden && visible.length === 1;
        return (
          <button
            key={s.key}
            type="button"
            aria-pressed={!isHidden}
            aria-disabled={isLastVisible || undefined}
            title={isLastVisible ? (labels?.lastSeries ?? 'At least one series must be visible') : undefined}
            data-ag-part="chart-legend-item"
            className="ag-chart-frame__legend-item"
            onClick={() => {
              if (isLastVisible) return;
              setHidden(isHidden ? hidden.filter((k) => k !== s.key) : [...hidden, s.key]);
            }}
          >
            <span aria-hidden="true" className="ag-chart-frame__swatch" style={{ background: colorOf(s.key) }} />
            {s.label}
          </button>
        );
      })}
    </div>
  );

  const tableNode = (
    <table data-ag-part="chart-table" className={table === 'visually-hidden' ? 'ag-visually-hidden' : 'ag-chart-frame__table'}>
      <caption>{title}</caption>
      <thead>
        <tr>
          <th scope="col">{x.label}</th>
          {visible.map((s) => (
            <th key={s.key} scope="col">
              {s.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <th scope="row">{fmtX(row[x.key])}</th>
            {visible.map((s) => (
              <td key={s.key}>{fmtY(row[s.key], s)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      {legend === 'top' ? legendNode : null}
      <div
        ref={plotRef}
        data-ag-part="chart-plot"
        className="ag-chart-frame__plot"
        style={{ blockSize: height }}
        aria-hidden={table === 'visually-hidden' ? true : undefined}
      >
        {typeof children === 'function' ? children(ctx) : children}
      </div>
      {table === 'toggle' ? (
        <>
          <button
            type="button"
            data-ag-part="chart-table-toggle"
            className="ag-chart-frame__toggle"
            aria-expanded={tableOpen}
            aria-controls={tableId}
            onClick={() => setTableOpen((o) => !o)}
          >
            {labels?.showTable ?? 'Show data table'}
          </button>
          <div id={tableId} hidden={!tableOpen}>
            {tableNode}
          </div>
        </>
      ) : (
        tableNode
      )}
      {legend === 'bottom' ? legendNode : null}
    </>
  );
}
