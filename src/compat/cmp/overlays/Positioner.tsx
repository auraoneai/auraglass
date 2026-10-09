/* CMP-339 compat: Positioner / GlassPositioner (4.x) -> PopoverPositioner (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { PopoverPositioner, Popover } from '../../../components/popover';
import { splitPlacement } from './GlassPopover';

const DEP = 'DEP-C0110';

export interface PositionerProps {
  placement?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  children?: React.ReactNode;
  className?: string;
}

export function Positioner({ placement, side, align, sideOffset, children, className }: PositionerProps) {
  warnDeprecated(DEP);
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

export const GlassPositioner = Positioner;
