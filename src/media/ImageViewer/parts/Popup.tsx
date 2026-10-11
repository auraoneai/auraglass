'use client';
import * as React from 'react';
import { Dialog } from '../../../components/dialog';
import { useAnnouncer } from '../../../theme';
import { useImageViewer } from '../ivContext';
import { Stage } from './Stage';
import { Toolbar } from './Toolbar';
import { Caption } from './Caption';
import { Prev } from './Prev';
import { Next } from './Next';
import { Counter } from './Counter';
import { Close } from './Close';

export interface ImageViewerPopupProps {
  children?: React.ReactNode;
  className?: string | undefined;
}

/** REQ-SURF-142 — the popup is CMP Dialog: Dialog.Content portals exactly
 * once into the provider's overlay layer root and Dialog.Root registers the
 * single LayerStack entry (REQ-FIN-07 transfer), so the Dialog is the one
 * Escape owner (it reports reason 'escape-key' through onOpenChange) and the
 * background is inert while open. Focus moves to Close on the open
 * transition only (never on navigation) and returns to the Trigger on close.
 * The accessible name is the caption (aria-labelledby) or, without a caption,
 * a visually-hidden span holding the current image's alt text. */
export function Popup({ children, className }: ImageViewerPopupProps): React.ReactElement {
  const c = useImageViewer('Popup');
  const { announce } = useAnnouncer();
  const announced = React.useRef<number>(-1);
  const popupRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!c.open) { announced.current = -1; return; }
    if (c.index !== announced.current) {
      announced.current = c.index;
      announce(`${c.index + 1} of ${c.items.length}`, { id: 'image-viewer-counter' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- index-only announce
  }, [c.open, c.index]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft': c.prev(); e.preventDefault(); break;
      case 'ArrowRight': c.next(); e.preventDefault(); break;
      case 'Home': c.setIndex(0); e.preventDefault(); break;
      case 'End': c.setIndex(c.items.length - 1); e.preventDefault(); break;
      case '+': case '=': c.setZoom(c.zoom * 1.25); e.preventDefault(); break;
      case '-': c.setZoom(c.zoom / 1.25); e.preventDefault(); break;
      case '0': c.setZoom(1); e.preventDefault(); break;
      default: break;
    }
  };

  // Base UI runs these once per open/close transition.
  const initialFocus = React.useCallback(
    () => popupRef.current?.querySelector<HTMLElement>('[data-ag-part="image-viewer-close"]') ?? true,
    [],
  );
  const { triggerRef } = c;
  const finalFocus = React.useCallback(() => {
    const t = triggerRef.current;
    return t && t.isConnected ? t : true;
  }, [triggerRef]);

  const altLabelId = `${c.popupId}-label`;
  const labelledBy = c.captionId ?? altLabelId;

  return (
    <Dialog.Root open={c.open} onOpenChange={(o: boolean) => c.setOpen(o)}>
      <Dialog.Content
        backdrop={false}
        size="full"
        ref={popupRef}
        className={['ag-image-viewer', className].filter(Boolean).join(' ')}
        data-ag-part="image-viewer-popup"
        data-ag-backdrop="media"
        {...(c.hasInspector ? { 'data-ag-inspector': 'open' } : {})}
        aria-labelledby={labelledBy}
        initialFocus={initialFocus}
        finalFocus={finalFocus}
        onKeyDown={onKeyDown}
      >
        <div className="ag-image-viewer-scrim" data-ag-part="image-viewer-scrim" aria-hidden="true" />
        {c.captionId ? null : (
          <span id={altLabelId} className="ag-visually-hidden">{c.current?.alt ?? 'Image viewer'}</span>
        )}
        <Stage />
        {children ?? (
          <>
            <Toolbar />
            <Caption />
            <Prev />
            <Next />
            <Counter />
            <Close />
          </>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
