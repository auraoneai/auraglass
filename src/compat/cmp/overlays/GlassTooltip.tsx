/* CMP-339 compat: GlassTooltip (4.x) -> Tooltip (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Tooltip } from '../../../components/tooltip';
import type { OverlayOpenChangeDetails } from '../../../components/overlays/_shared';
import { __compatWrap as wrap } from './_shared';
import { splitPlacement } from './GlassPopover';

const DEP = 'DEP-C0109';

export interface GlassTooltipProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  content?: React.ReactNode;
  label?: React.ReactNode;
  position?: string;
  placement?: string;
  delay?: number;
  children?: React.ReactNode;
  className?: string;
}

export function GlassTooltip({ open, onOpenChange, content, label, position, placement, delay, children, className }: GlassTooltipProps) {
  warnDeprecated(DEP);
  const pos = splitPlacement(position ?? placement);
  return wrap('GlassTooltip', (
    <Tooltip.Root
      {...(open !== undefined ? { open } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange: (o: boolean, _d: OverlayOpenChangeDetails) => onOpenChange(o) } : {})}
    >
      <Tooltip.Trigger>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner {...pos}>
          <Tooltip.Popup {...(className !== undefined ? { className } : {})}>
            {content ?? label}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  ));
}
