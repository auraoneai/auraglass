/* CMP-338 compat: GlassDrawer (4.x) -> Sheet (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Sheet } from '../../../components/sheet';
import type { SheetSide, SheetDetent } from '../../../components/sheet';
import type { OverlayOpenChangeDetails } from '../../../components/overlays/_shared';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0103';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface GlassDrawerProps {
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  position?: 'left' | 'right' | 'top' | 'bottom' | 'start' | 'end';
  placement?: 'left' | 'right' | 'top' | 'bottom' | 'start' | 'end';
  snap?: number | readonly number[];
  detents?: readonly SheetDetent[];
  modal?: boolean;
  closeOnOverlayClick?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/* 4.x position is the physical edge; Sheet side is logical (start resolves to
   the right edge in LTR per resolveSide). */
const SIDE_MAP: Record<string, SheetSide> = {
  left: 'end', right: 'start', start: 'start', end: 'end', top: 'top', bottom: 'bottom',
};

export function toSide(p?: string): SheetSide | undefined {
  return p !== undefined ? (SIDE_MAP[p] ?? 'start') : undefined;
}

export function GlassDrawer({ open, onClose, onOpenChange, position, placement, snap, detents, modal, closeOnOverlayClick, children, className }: GlassDrawerProps) {
  warnDeprecated(DEP);
  const side = toSide(position ?? placement) ?? 'end';
  const d = detents ?? (snap !== undefined
    ? (Array.isArray(snap) ? [...snap] : [0.25, snap])
    : undefined);
  return wrap('GlassDrawer', (
    <Sheet.Root
      {...(open !== undefined ? { open } : {})}
      onOpenChange={(o: boolean, _d: OverlayOpenChangeDetails) => { onOpenChange?.(o); if (!o) onClose?.(); }}
      side={side}
      {...(d !== undefined ? { detents: [...d] as SheetDetent[] } : {})}
      {...(modal !== undefined ? { modal } : {})}
      {...(closeOnOverlayClick !== undefined ? { dismissible: closeOnOverlayClick } : {})}
    >
      <Sheet.Content {...(className !== undefined ? { className } : {})}>{children}</Sheet.Content>
    </Sheet.Root>
  ));
}
