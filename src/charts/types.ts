import type * as React from 'react';
import type { ChartContext } from '../data/chart-frame/types';
import type { ChartFrameProps } from '../data/chart-frame/ChartFrame';

export type ChartType = 'line' | 'area' | 'bar' | 'donut';
export type ChartCurve = 'linear' | 'monotone' | 'step';

export interface ChartProps<TRow> extends Omit<ChartFrameProps<TRow>, 'children'> {
  type?: ChartType | undefined;
  stacked?: boolean | undefined;
  orientation?: 'horizontal' | 'vertical' | undefined;
  curve?: ChartCurve | undefined;
  yDomain?: [number, number] | 'auto' | undefined;
  grid?: boolean | undefined;
  tooltip?: boolean | undefined;
}

export interface PlotProps<TRow> {
  ctx: ChartContext<TRow>;
  type: ChartType;
  stacked?: boolean | undefined;
  orientation?: 'horizontal' | 'vertical' | undefined;
  curve: ChartCurve;
  yDomain: [number, number] | 'auto';
  grid?: boolean | undefined;
  tooltip?: boolean | undefined;
  labelledBy: string;
}
