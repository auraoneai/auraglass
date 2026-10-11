// chart-frame types (SURF-180): ChartAdapter is a TYPE, never a runtime registry.
import * as React from 'react';

export interface ChartSeries {
  key: string;
  label: string;
  colorIndex?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | undefined;
  format?: Intl.NumberFormatOptions | undefined;
}

export interface ChartContext<TRow> {
  width: number | undefined;
  height: number;
  data: readonly TRow[];
  visibleSeries: readonly ChartSeries[];
  color: (seriesKey: string) => string;
  formatX: (v: unknown) => string;
  formatY: (v: unknown, series?: ChartSeries) => string;
  reducedMotion: boolean;
  dir: 'ltr' | 'rtl';
}

export type ChartAdapter<TRow> = (ctx: ChartContext<TRow>) => React.ReactNode;
