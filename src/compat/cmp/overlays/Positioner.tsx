/* CMP-339 compat: Positioner / GlassPositioner (4.x) -> Popover.Positioner (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Popover } from '../../../components/popover';
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
    <Popover.Positioner
      {...(side !== undefined ? { side } : pos.side !== undefined ? { side: pos.side } : {})}
      {...(align !== undefined ? { align } : pos.align !== undefined ? { align: pos.align } : {})}
      {...(sideOffset !== undefined ? { sideOffset } : {})}
      {...(className !== undefined ? { className } : {})}
    >
      {children}
    </Popover.Positioner>
  );
}

export function Positioner(props: PositionerProps) {
  return renderPositioner(DEP, props);
}

/** 4.x `GlassPositioner`: same mapping, its own id (one warning per symbol). */
export function GlassPositioner(props: PositionerProps) {
  return renderPositioner(DEP_GLASS, props);
}
