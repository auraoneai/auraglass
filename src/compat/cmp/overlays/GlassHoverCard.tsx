/* CMP-339 compat: GlassHoverCard (4.x) -> Popover openOnHover (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Popover } from '../../../components/popover';
import type { OverlayOpenChangeDetails } from '../../../components/overlays/_shared';
import { __compatWrap as wrap } from './_shared';
import { splitPlacement } from './GlassPopover';

const DEP = 'DEP-C0108';

export interface GlassHoverCardProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  content?: React.ReactNode;
  placement?: string;
  openDelay?: number;
  closeDelay?: number;
  className?: string;
}

/** @deprecated GlassHoverCard DEP-C0108 since 4.3.0, removed in 5.0.0. {@link Popover} */
export function GlassHoverCard({ open, onOpenChange, trigger, content, placement, openDelay, closeDelay, className }: GlassHoverCardProps) {
  warnDeprecated(DEP);
  const pos = splitPlacement(placement);
  return wrap('GlassHoverCard', (
    <Popover.Root
      {...(open !== undefined ? { open } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange: (o: boolean, _d: OverlayOpenChangeDetails) => onOpenChange(o) } : {})}
    >
      <Popover.Trigger
        openOnHover
        {...(openDelay !== undefined ? { delay: openDelay } : {})}
        {...(closeDelay !== undefined ? { closeDelay } : {})}
      >
        {trigger}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner {...pos}>
          <Popover.Popup {...(className !== undefined ? { className } : {})}>{content}</Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  ));
}
