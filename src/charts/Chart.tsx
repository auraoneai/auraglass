/* Chart<TRow> (SURF-241, REQ-SURF-161..163): every ChartFrame prop + type/
   stacked/orientation/curve/yDomain/grid/tooltip. Renders inside a
   ChartFrame and implements ChartAdapter through its render-prop.
   This module is server-safe (no directive, no hooks): it forwards
   serialisable props to ChartClient, the client island that owns the
   ChartFrame render-prop, the keyboard cursor, the pointer crosshair and the
   live region. The marks are pure functions of the frame context, so the
   static output is server-renderable (ctx.width undefined → viewBox fallback). */
import * as React from 'react';
import { ChartClient } from './ChartPlot';
import type { ChartProps } from './types';

/**
 * SVG line/area/bar/donut chart rendered inside a ChartFrame. `./charts`
 * ships on 5.1; it is absent from every 5.0.x exports map.
 * @tier preview
 */
export function Chart<TRow extends Record<string, unknown>>(props: ChartProps<TRow>) {
  return <ChartClient {...props} />;
}
