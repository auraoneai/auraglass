/* CMP-338 compat: LiquidGlassAdaptiveSheet (4.x) -> Sheet detents (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Sheet } from '../../../components/sheet';
import type { OverlayOpenChangeDetails } from '../../../components/overlays/_shared';
import { __compatWrap as wrap, __compatDetents as toDetents } from './_shared';
import type { CompatSheetDetent } from './_shared';

const DEP = 'DEP-C0106';

export interface LiquidGlassAdaptiveSheetProps {
  open?: boolean;
  onClose?: () => void;
  snap?: number | readonly number[];
  detents?: readonly CompatSheetDetent[];
  children?: React.ReactNode;
  className?: string;
}

export function LiquidGlassAdaptiveSheet({ open, onClose, snap, detents, children, className }: LiquidGlassAdaptiveSheetProps) {
  warnDeprecated(DEP);
  const d = detents ?? (snap !== undefined ? (Array.isArray(snap) ? [...snap] : [snap]) : undefined);
  const dets = toDetents(d);
  return wrap('LiquidGlassAdaptiveSheet', (
    <Sheet.Root
      side="bottom"
      {...(open !== undefined ? { open } : {})}
      onOpenChange={(o: boolean, _d: OverlayOpenChangeDetails) => { if (!o) onClose?.(); }}
      {...(dets !== undefined ? { detents: dets } : {})}
    >
      <Sheet.Content {...(className !== undefined ? { className } : {})}>{children}</Sheet.Content>
    </Sheet.Root>
  ));
}
