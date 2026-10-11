/* CMP-117 compat: CircularProgress (4.x) -> Progress appearance="ring" (5.0).
   DEP-C0243 is the id #313 assigned on release/4.x (fragments/deprecations/cmp.ts);
   it reaches next's generated table through the REQ-FIN-13 sync.
   warnDeprecated fires at call time, once per page load per symbol; never throws.
   Mapping (4.x data-display/GlassProgress.tsx):
   - size sm|md|lg|xl -> ring diameter 40|60|80|120 px, default stroke 3|4|5|6;
   - strokeWidth -> thickness; indeterminate -> value={null};
   - value (4.x default 0), max, showValue (4.x default false), className and
     DOM attributes pass through.
   Dropped (no 5.0 equivalent; each warns once as DEP-C0243.prop.<name>):
   `variant` (Progress has no intent) and `children` (the ring has no centre slot). */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Progress } from '../../../components/progress/Progress.client';
import type { ProgressProps } from '../../../components/progress/Progress.client';

const DEP = 'DEP-C0243';

export type CircularProgressSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE: Record<CircularProgressSize, { size: number; stroke: number }> = {
  sm: { size: 40, stroke: 3 },
  md: { size: 60, stroke: 4 },
  lg: { size: 80, stroke: 5 },
  xl: { size: 120, stroke: 6 },
};

export interface CircularProgressProps
  extends Omit<ProgressProps, 'appearance' | 'size' | 'thickness' | 'value'> {
  /** 0..max (4.x default 0). */
  value?: number | undefined;
  size?: CircularProgressSize | undefined;
  strokeWidth?: number | undefined;
  indeterminate?: boolean | undefined;
  /** 4.x colour variant; no 5.0 equivalent. */
  variant?: 'default' | 'success' | 'warning' | 'error' | undefined;
  ref?: React.Ref<HTMLDivElement> | undefined;
}

export function CircularProgress({
  value = 0,
  size = 'md',
  strokeWidth,
  indeterminate = false,
  showValue = false,
  variant,
  children,
  ...rest
}: CircularProgressProps) {
  warnDeprecated(DEP);
  if (variant !== undefined) warnDeprecated(`${DEP}.prop.variant`);
  if (children !== undefined && children !== null) warnDeprecated(`${DEP}.prop.children`);
  const cfg = SIZE[size] ?? SIZE.md;
  return (
    <Progress
      {...rest}
      appearance="ring"
      value={indeterminate ? null : value}
      size={cfg.size}
      thickness={strokeWidth ?? cfg.stroke}
      showValue={showValue}
    />
  );
}
