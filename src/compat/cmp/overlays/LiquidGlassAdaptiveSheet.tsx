/* CMP-338 compat: LiquidGlassAdaptiveSheet (4.x) -> Sheet detents (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Sheet } from '../../../components/sheet';
import type { SheetDetent } from '../../../components/sheet';
import type { OverlayOpenChangeDetails } from '../../../components/overlays/_shared';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0106';

export interface LiquidGlassAdaptiveSheetProps {
  open?: boolean;
  onClose?: () => void;
  snap?: number | readonly number[];
  detents?: readonly SheetDetent[];
  children?: React.ReactNode;
  className?: string;
}

/** @deprecated LiquidGlassAdaptiveSheet DEP-C0106 since 4.3.0, removed in 5.0.0. {@link Sheet} */
export function LiquidGlassAdaptiveSheet({ open, onClose, snap, detents, children, className }: LiquidGlassAdaptiveSheetProps) {
  warnDeprecated(DEP);
  const d = detents ?? (snap !== undefined ? (Array.isArray(snap) ? [...snap] : [snap]) : undefined);
  return wrap('LiquidGlassAdaptiveSheet', (
    <Sheet.Root
      side="bottom"
      {...(open !== undefined ? { open } : {})}
      onOpenChange={(o: boolean, _d: OverlayOpenChangeDetails) => { if (!o) onClose?.(); }}
      {...(d !== undefined ? { detents: [...d] as SheetDetent[] } : {})}
    >
      <Sheet.Content {...(className !== undefined ? { className } : {})}>{children}</Sheet.Content>
    </Sheet.Root>
  ));
}
