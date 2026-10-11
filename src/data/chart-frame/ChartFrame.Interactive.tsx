'use client';
/* ChartFrame client islands (REQ-SURF-92..94). The server ChartFrame root
   renders <figure>/<figcaption> and composes these islands:
     - ChartFrameRoot   state owner (hidden series, table open, measured plot
                        width, dir, reduced motion); renders no DOM
     - ChartLegend      the legend in its slot ('top' | 'bottom'); a top legend
                        moves to the bottom slot once the measured plot is
                        narrower than 480px, so DOM order matches what is shown
     - ChartPlot        the plot box: one ResizeObserver, a `height`
                        placeholder until the width is known, then the adapter
     - ChartTableToggle the "Show/Hide data table" button (table='toggle')
     - ChartTable       the <table> fallback
   Every prop the server root passes here is serializable, except the ones a
   caller provides as functions (onHiddenSeriesChange, render-function
   children). RSC callers pass the adapter as an element that reads the
   context with ChartFrame.useContext(); function children are for callers
   that are already client components. */
import * as React from 'react';
import type { ChartContext, ChartSeries } from './types';

export interface ChartFrameLabels {
  showTable?: string | undefined;
  hideTable?: string | undefined;
  lastSeries?: string | undefined;
  legend?: string | undefined;
}

export interface ChartFrameRootProps<TRow> {
  title: string;
  data: readonly TRow[];
  series: readonly ChartSeries[];
  x: { key: string; label: string; format?: Intl.DateTimeFormatOptions | Intl.NumberFormatOptions | undefined };
  hiddenSeries?: readonly string[] | undefined;
  defaultHiddenSeries?: readonly string[] | undefined;
  onHiddenSeriesChange?: ((keys: string[]) => void) | undefined;
  legend?: 'top' | 'bottom' | 'none' | undefined;
  table?: 'toggle' | 'visually-hidden' | 'always' | undefined;
  height?: number | undefined;
  locale?: string | undefined;
  labels?: ChartFrameLabels | undefined;
  children?: React.ReactNode;
}

/** Below this measured plot width a top legend renders after the plot. */
export const CHART_NARROW_PX = 480;

interface FrameState {
  ctx: ChartContext<Record<string, unknown>>;
  title: string;
  series: readonly ChartSeries[];
  x: ChartFrameRootProps<Record<string, unknown>>['x'];
  hidden: readonly string[];
  toggleSeries: (key: string) => void;
  legend: 'top' | 'bottom' | 'none';
  table: 'toggle' | 'visually-hidden' | 'always';
  tableOpen: boolean;
  setTableOpen: (open: boolean) => void;
  tableId: string;
  lastSeriesId: string;
  labels: ChartFrameLabels | undefined;
  plotRef: React.RefCallback<HTMLDivElement>;
}

const FrameCtx = React.createContext<FrameState | null>(null);

function useFrame(part: string): FrameState {
  const v = React.useContext(FrameCtx);
  if (v === null) throw new Error(`[aura-glass] ChartFrame: <${part}> must render inside <ChartFrame>.`);
  return v;
}

/** The ChartContext of the nearest ChartFrame (for element adapters). */
export function useChartContext<TRow = Record<string, unknown>>(): ChartContext<TRow> {
  return useFrame('ChartFrame.useContext').ctx as unknown as ChartContext<TRow>;
}

function readDir(el: Element): 'ltr' | 'rtl' {
  const attr = el.closest('[dir]')?.getAttribute('dir');
  if (attr === 'rtl' || attr === 'ltr') return attr;
  const css = typeof getComputedStyle === 'function' ? getComputedStyle(el).direction : '';
  return css === 'rtl' ? 'rtl' : 'ltr';
}

export function ChartFrameRoot<TRow extends Record<string, unknown>>({
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
  locale = 'en-US',
  labels,
  children,
}: ChartFrameRootProps<TRow>) {
  const [innerHidden, setInnerHidden] = React.useState<readonly string[]>(defaultHiddenSeries ?? []);
  const hidden = hiddenSeries ?? innerHidden;
  const [tableOpen, setTableOpen] = React.useState(false);
  const [width, setWidth] = React.useState<number | undefined>(undefined);
  const [dir, setDir] = React.useState<'ltr' | 'rtl'>('ltr');
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const tableId = React.useId();
  const lastSeriesId = React.useId();

  // One ResizeObserver on the plot, created when the plot mounts and
  // disconnected when it unmounts. Without ResizeObserver the plot is
  // measured once.
  const plotRef = React.useCallback((el: HTMLDivElement | null) => {
    if (el === null) return undefined;
    setDir(readDir(el));
    if (typeof ResizeObserver === 'undefined') {
      setWidth(el.getBoundingClientRect().width);
      return undefined;
    }
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w !== undefined) setWidth(w);
      setDir(readDir(el));
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
  const color = React.useCallback(
    (key: string) => {
      const i = series.findIndex((s) => s.key === key);
      const idx = series[i]?.colorIndex ?? ((Math.max(i, 0) % 8) + 1);
      return `var(--_ag-chart-${idx})`;
    },
    [series],
  );
  const formatX = (v: unknown) =>
    typeof v === 'number'
      ? new Intl.NumberFormat(locale, x.format as Intl.NumberFormatOptions | undefined).format(v)
      : v instanceof Date
        ? new Intl.DateTimeFormat(locale, x.format as Intl.DateTimeFormatOptions | undefined).format(v)
        : String(v ?? '');
  const formatY = (v: unknown, s?: ChartSeries) =>
    typeof v === 'number' ? new Intl.NumberFormat(locale, s?.format).format(v) : String(v ?? '');

  const toggleSeries = (key: string) => {
    const isHidden = hidden.includes(key);
    if (!isHidden && visible.length === 1) return; // the last visible series stays
    const next = isHidden ? hidden.filter((k) => k !== key) : [...hidden, key];
    if (hiddenSeries === undefined) setInnerHidden(next);
    onHiddenSeriesChange?.([...next]);
  };

  const state: FrameState = {
    ctx: {
      width,
      height,
      data: data as readonly Record<string, unknown>[],
      visibleSeries: visible,
      color,
      formatX,
      formatY,
      reducedMotion,
      dir,
    },
    title,
    series,
    x,
    hidden,
    toggleSeries,
    legend,
    table,
    tableOpen: table === 'always' || tableOpen,
    setTableOpen,
    tableId,
    lastSeriesId,
    labels,
    plotRef,
  };
  return <FrameCtx.Provider value={state}>{children}</FrameCtx.Provider>;
}

export function ChartLegend({ slot }: { slot: 'top' | 'bottom' }) {
  const f = useFrame('ChartLegend');
  if (f.legend === 'none') return null;
  const narrow = f.ctx.width !== undefined && f.ctx.width < CHART_NARROW_PX;
  const placement = f.legend === 'top' && narrow ? 'bottom' : f.legend;
  if (placement !== slot) return null;
  const lastSeries = f.labels?.lastSeries ?? 'At least one series must be visible';
  return (
    <div
      data-ag-part="chart-legend"
      className="ag-chart-frame__legend"
      role="group"
      aria-label={f.labels?.legend ?? 'Series'}
      data-placement={placement}
    >
      {f.series.map((s) => {
        const isHidden = f.hidden.includes(s.key);
        const isLastVisible = !isHidden && f.ctx.visibleSeries.length === 1;
        return (
          <button
            key={s.key}
            type="button"
            aria-pressed={!isHidden}
            aria-disabled={isLastVisible || undefined}
            aria-describedby={isLastVisible ? f.lastSeriesId : undefined}
            title={isLastVisible ? lastSeries : undefined}
            data-ag-part="chart-legend-item"
            className="ag-chart-frame__legend-item"
            onClick={() => f.toggleSeries(s.key)}
          >
            <span aria-hidden="true" className="ag-chart-frame__swatch" style={{ background: f.ctx.color(s.key) }} />
            {s.label}
          </button>
        );
      })}
      <span id={f.lastSeriesId} className="ag-visually-hidden">
        {f.ctx.visibleSeries.length === 1 ? lastSeries : ''}
      </span>
    </div>
  );
}

export function ChartPlot({ children }: { children?: React.ReactNode | ((ctx: ChartContext<never>) => React.ReactNode) }) {
  const f = useFrame('ChartPlot');
  const { ctx } = f;
  // Server render and first client render: width is unknown, so the adapter
  // is not invoked; a `height` placeholder holds the box (CLS 0).
  const content =
    ctx.width === undefined ? (
      <div aria-hidden="true" className="ag-chart-frame__placeholder" style={{ blockSize: ctx.height }} />
    ) : typeof children === 'function' ? (
      (children as (c: ChartContext<Record<string, unknown>>) => React.ReactNode)(ctx)
    ) : (
      children
    );
  return (
    <div
      ref={f.plotRef}
      data-ag-part="chart-plot"
      className="ag-chart-frame__plot"
      style={{ blockSize: ctx.height }}
      aria-hidden={f.table === 'visually-hidden' ? true : undefined}
    >
      {content}
    </div>
  );
}

export function ChartTableToggle() {
  const f = useFrame('ChartTableToggle');
  if (f.table !== 'toggle') return null;
  return (
    <button
      type="button"
      data-ag-part="chart-table-toggle"
      className="ag-chart-frame__toggle"
      aria-expanded={f.tableOpen}
      aria-controls={f.tableId}
      onClick={() => f.setTableOpen(!f.tableOpen)}
    >
      {f.tableOpen ? (f.labels?.hideTable ?? 'Hide data table') : (f.labels?.showTable ?? 'Show data table')}
    </button>
  );
}

export function ChartTable() {
  const f = useFrame('ChartTable');
  const { ctx, x } = f;
  const node = (
    <table
      data-ag-part="chart-table"
      className={f.table === 'visually-hidden' ? 'ag-visually-hidden' : 'ag-chart-frame__table'}
    >
      <caption>{f.title}</caption>
      <thead>
        <tr>
          <th scope="col">{x.label}</th>
          {ctx.visibleSeries.map((s) => (
            <th key={s.key} scope="col">
              {s.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ctx.data.map((row, i) => (
          <tr key={i}>
            <th scope="row">{ctx.formatX(row[x.key])}</th>
            {ctx.visibleSeries.map((s) => (
              <td key={s.key}>{ctx.formatY(row[s.key], s)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
  if (f.table !== 'toggle') return node;
  return (
    <div id={f.tableId} hidden={!f.tableOpen}>
      {node}
    </div>
  );
}
