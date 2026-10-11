/* REQ-CMP-131 compat: MobileGlassBottomSheet (4.x, REMOVE -> compat per archive
   R-17) -> Sheet side="bottom" (5.0). Mapping per the Sheet meta row:
   `snap` -> `detents`. warnDeprecated('DEP-C0132') fires at call time, once per
   page load, dev only. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Sheet } from '../../../components/sheet';
import type { SheetDetent } from '../../../components/sheet';
import type { OverlayOpenChangeDetails } from '../../../components/overlays/_shared';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0132';

export interface MobileGlassBottomSheetProps {
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  /** 4.x snap points (fractions of the viewport); mapped to Sheet `detents` */
  snap?: number | readonly number[];
  detents?: readonly SheetDetent[];
  children?: React.ReactNode;
  className?: string;
}

export function MobileGlassBottomSheet({ open, onClose, onOpenChange, snap, detents, children, className }: MobileGlassBottomSheetProps) {
  warnDeprecated(DEP);
  const d = detents ?? (snap !== undefined ? (Array.isArray(snap) ? [...snap] : [snap]) : undefined);
  return wrap('MobileGlassBottomSheet', (
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
