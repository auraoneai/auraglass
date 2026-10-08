/* CMP-205 fixture: a REAL Base UI Popover driving the same _shared seam the
   lane-3f anchored overlay will consume (portal root, overlayMaterial,
   defaultPositionerProps, useOverlayLayer, useOverlayAnimating). Replaced by
   the real Popover in CMP-226 when 3f lands. */
'use client';
import * as React from 'react';
import { Popover as Base } from '@base-ui/react/popover';
import { usePortalContainer } from '../../../../foundation/portal';
import { overlayMaterial } from '../overlaySurface';
import { defaultPositionerProps } from '../positioning';
import { useOverlayLayer } from '../useOverlayLayer';
import { useOverlayAnimating } from '../useOverlayAnimating';
import { cn } from '../../../../internal';

export function FixturePopover({ onOpenChange }: {
  onOpenChange?: (open: boolean, details: { reason?: unknown }) => void;
}) {
  const [popupElement, setPopupElement] = React.useState<HTMLElement | null>(null);
  const [internalOpen, setInternalOpen] = React.useState(true);
  useOverlayLayer({
    kind: 'popover', modal: false, open: internalOpen,
    onOpenChange, element: popupElement,
  });
  const animatingRef = useOverlayAnimating();
  const container = usePortalContainer();
  return (
    <Base.Root open onOpenChange={(o) => { setInternalOpen(o); onOpenChange?.(o, { reason: 'imperative' }); }}>
      <Base.Trigger data-ag-part="trigger" className="ag-fixture-popover-trigger">anchor</Base.Trigger>
      <Base.Portal container={container}>
        <Base.Positioner data-ag-part="positioner" {...defaultPositionerProps} className="ag-fixture-popover-positioner">
          <Base.Popup
            data-ag-part="popup"
            {...overlayMaterial('popover')}
            className={cn('ag-fixture-popover-popup')}
            ref={(n: HTMLDivElement | null) => { setPopupElement(n); animatingRef(n); }}
          >
            <Base.Arrow data-ag-part="arrow" className="ag-fixture-popover-arrow" />
            fixture popover
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  );
}
export default FixturePopover;
