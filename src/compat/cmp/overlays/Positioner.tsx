/* CMP-339 compat: Positioner / GlassPositioner (4.x) -> the Popover positioner (5.0: placement
   props on Popover.Content; the positioner is internal since REQ-CMP-06).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { PopoverPositioner } from '../../../components/popover/Popover.client';
import { splitPlacement } from './GlassPopover';

const DEP = 'DEP-C0110';
const DEP_GLASS = 'DEP-C0120';

export interface PositionerProps {
  placement?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  children?: React.ReactNode;
  className?: string;
}

function renderPositioner(dep: string, { placement, side, align, sideOffset, children, className }: PositionerProps) {
  warnDeprecated(dep);
  const pos = splitPlacement(placement);
  return (
    <PopoverPositioner
      {...(side !== undefined ? { side } : pos.side !== undefined ? { side: pos.side } : {})}
      {...(align !== undefined ? { align } : pos.align !== undefined ? { align: pos.align } : {})}
      {...(sideOffset !== undefined ? { sideOffset } : {})}
      {...(className !== undefined ? { className } : {})}
    >
      {children}
    </PopoverPositioner>
  );
}

/** @deprecated since 4.2.0, removed in 6.0.0. Use {@link Popover.Positioner}. */
export function Positioner(props: PositionerProps) {
  return renderPositioner(DEP, props);
}

/**
 * 4.x `GlassPositioner`: same mapping, its own id (one warning per symbol).
 * @deprecated since 4.2.0, removed in 6.0.0. Use {@link Popover.Positioner}.
 */
export function GlassPositioner(props: PositionerProps) {
  return renderPositioner(DEP_GLASS, props);
}
