import type { ChartContext } from '../data/chart-frame/types';
import type { ChartFrameProps } from '../data/chart-frame/ChartFrame';

/**
 * Chart mark type. `./charts` ships on 5.1 and is absent from 5.0.x.
 * @tier preview
 */
export type ChartType = 'line' | 'area' | 'bar' | 'donut';
/**
 * Line/area curve with d3-shape curveLinear / curveMonotoneX / curveStep semantics.
 * @tier preview
 */
export type ChartCurve = 'linear' | 'monotone' | 'step';

/**
 * Props of `Chart`: every ChartFrame prop plus the mark options.
 * @tier preview
 */
export interface ChartProps<TRow> extends Omit<ChartFrameProps<TRow>, 'children'> {
  type?: ChartType | undefined;
  stacked?: boolean | undefined;
  orientation?: 'horizontal' | 'vertical' | undefined;
  curve?: ChartCurve | undefined;
  /** Fixed y-scale extent [min, max] for line/area/bar, or 'auto' (data extent). */
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
  /** Frame title; the plot's aria-labelledby target carries this text. */
  title: string;
  xKey: string;
}
