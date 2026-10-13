/* User-app dependency model for docs snippet type-checking (REQ-PLAT-102).
   The ChartFrame adapter examples run in an app that installed the chart
   engine itself; this declared surface covers exactly the components and
   props the recharts example composes. It never ships. */
import type { ComponentType, ReactNode } from 'react';

export declare const LineChart: ComponentType<{
  data?: readonly Record<string, unknown>[];
  width?: number;
  height?: number;
  children?: ReactNode;
}>;
export declare const Line: ComponentType<{
  dataKey?: string;
  stroke?: string;
  dot?: boolean;
  isAnimationActive?: boolean;
}>;
export declare const XAxis: ComponentType<{
  dataKey?: string;
  tickFormatter?: (value: never) => string;
}>;
export declare const YAxis: ComponentType<{
  tickFormatter?: (value: number) => string;
}>;
export declare const Tooltip: ComponentType;
