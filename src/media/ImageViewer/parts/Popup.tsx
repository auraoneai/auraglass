'use client';
import * as React from 'react';
import { Dialog } from '../../../components/dialog';

type FC = React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const DialogRoot = Dialog.Root as FC;
const DialogContent = Dialog.Content as FC;
import { createPortal } from 'react-dom';
import { useAnnouncer, useLayer, usePortalContainer } from '../../../theme';
import { useImageViewer } from '../ivContext';
import type { toChangeDetails } from '../../../foundation';
import { Stage } from './Stage';
import { Toolbar } from './Toolbar';
import { Caption } from './Caption';
import { Prev } from './Prev';
import { Next } from './Next';
import { Counter } from './Counter';
import { Close } from './Close';
/** S-30 ChangeDetails, via the CMP foundation seam (no contracts/ specifier in src). */
type ChangeDetails = ReturnType<typeof toChangeDetails>;

export interface ImageViewerPopupProps {
  children?: React.ReactNode;
  className?: string | undefined;
}

export function Popup({ children, className }: ImageViewerPopupProps): React.ReactElement | null {
  const c = useImageViewer('Popup');
  const portal = usePortalContainer('overlay');
  const layer = useLayer({ id: 'image-viewer', kind: 'image-viewer', modal: true, open: c.open, onEscape: () => c.setOpen(false, { event: undefined, reason: 'escape-key' }) } as never);
  const { announce } = useAnnouncer();
  const announced = React.useRef<number>(-1);
  const closeRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (c.open && c.index !== announced.current) {
      announced.current = c.index;
      announce(`${c.index + 1} of ${c.items.length}`, { id: 'image-viewer-counter' });
      closeRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- index-only announce
  }, [c.open, c.index]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const details: ChangeDetails = { event: e.nativeEvent, reason: 'keyboard' };
    switch (e.key) {
      case 'ArrowLeft': c.prev(details); e.preventDefault(); break;
      case 'ArrowRight': c.next(details); e.preventDefault(); break;
      case 'Home': c.setIndex(0, details); e.preventDefault(); break;
      case 'End': c.setIndex(c.items.length - 1, details); e.preventDefault(); break;
      case '+': case '=': c.setZoom(c.zoom * 1.25); e.preventDefault(); break;
      case '-': c.setZoom(c.zoom / 1.25); e.preventDefault(); break;
      case '0': c.setZoom(1); e.preventDefault(); break;
      default: break;
    }
  };

  const label = c.current?.caption ?? c.current?.alt ?? 'Image viewer';
  if (!c.open || !portal) return null;
  return createPortal(
    <DialogRoot open={c.open} onOpenChange={(o: boolean, d?: ChangeDetails) => c.setOpen(o, d ?? { event: undefined, reason: 'none' })}>
      <DialogContent
        className={['ag-image-viewer', className].filter(Boolean).join(' ')}
        data-ag-part="image-viewer-popup"
        data-ag-backdrop="media"
        data-ag-layer={layer.id}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onKeyDown={onKeyDown}
      >
        <div className="ag-image-viewer-scrim" data-ag-part="image-viewer-scrim" aria-hidden="true" />
        <Stage />
        {children ?? (
          <>
            <Toolbar />
            <Caption />
            <Prev />
            <Next />
            <Counter />
            <Close ref={closeRef} />
          </>
        )}
      </DialogContent>
    </DialogRoot>,
    portal,
  );
}
