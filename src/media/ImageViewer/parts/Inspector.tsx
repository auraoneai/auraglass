'use client';
import { useLayoutEffect, type ReactNode } from 'react';
import { useImageViewer } from '../ivContext';

/** Inspector — a side region (320 px) when the popup container is ≥768 px,
 * otherwise a bottom region (≤50dvh). While mounted, the popup reserves its
 * space so the Stage never sits under it (REQ-SURF-145). */
export function Inspector({ children, label = 'Image details' }: { children?: ReactNode; label?: string }) {
  const { setHasInspector } = useImageViewer('Inspector');
  useLayoutEffect(() => {
    setHasInspector(true);
    return () => setHasInspector(false);
  }, [setHasInspector]);
  return <aside data-ag-part="image-viewer-inspector" aria-label={label} className="ag-image-viewer-inspector">{children}</aside>;
}
