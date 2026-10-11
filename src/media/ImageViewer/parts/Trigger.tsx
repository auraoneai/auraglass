'use client';
import * as React from 'react';
import { useImageViewer } from '../ivContext';

let warnedMissing = false;

/** REQ-SURF-143 — opens the popup on the item whose id matches. An id that is
 * not in `items` (e.g. filtered out) opens nothing: it never falls back to
 * index 0, which would show a different image. */
export const Trigger = function Trigger({ id, className, children, ref }: { id: string; className?: string; children?: React.ReactNode } & { ref?: React.Ref<HTMLButtonElement> }) {
  const c = useImageViewer('Trigger');
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const i = c.items.findIndex((it) => it.id === id);
    if (i === -1) {
      if (process.env.NODE_ENV !== 'production' && !warnedMissing) {
        warnedMissing = true;
        console.warn(`aura-glass: <ImageViewer.Trigger id="${id}"> has no matching item in <ImageViewer.Root items> — nothing opens.`);
      }
      return;
    }
    c.triggerRef.current = e.currentTarget;
    c.setIndex(i);
    c.setOpen(true);
  };
  return (
    <button ref={ref} type="button" data-ag-part="image-viewer-trigger" className={className} onClick={onClick}>
      {children}
    </button>
  );
};
