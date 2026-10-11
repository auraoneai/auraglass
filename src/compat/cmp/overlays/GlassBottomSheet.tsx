/* CMP-338 compat: GlassBottomSheet (4.x) -> Sheet side=bottom (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Sheet } from '../../../components/sheet';
import type { SheetDetent } from '../../../components/sheet';
import type { OverlayOpenChangeDetails } from '../../../components/overlays/_shared';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0104';

export interface GlassBottomSheetProps {
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  snap?: number | readonly number[];
  height?: number | string;
  detents?: readonly SheetDetent[];
  children?: React.ReactNode;
  className?: string;
}

export function GlassBottomSheet({ open, onClose, onOpenChange, snap, height, detents, children, className }: GlassBottomSheetProps) {
  warnDeprecated(DEP);
  const d = detents ?? (snap !== undefined ? (Array.isArray(snap) ? [...snap] : [snap]) :
    typeof height === 'number' ? [height] : undefined);
  if (typeof height === 'string') warnDeprecated(`${DEP}.prop.height-string`);
  return wrap('GlassBottomSheet', (
    <Sheet.Root
      side="bottom"
      {...(open !== undefined ? { open } : {})}
      onOpenChange={(o: boolean, _d: OverlayOpenChangeDetails) => { onOpenChange?.(o); if (!o) onClose?.(); }}
      {...(d !== undefined ? { detents: [...d] as SheetDetent[] } : {})}
    >
      <Sheet.Content {...(className !== undefined ? { className } : {})}>{children}</Sheet.Content>
    </Sheet.Root>
  ));
}
