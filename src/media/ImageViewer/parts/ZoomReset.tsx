'use client';
import { useImageViewer } from '../ivContext';

export function ZoomReset() {
  const c = useImageViewer('ZoomReset');
  return <button type="button" data-ag-part="image-viewer-zoom-reset" aria-label="Reset zoom" onClick={() => c.setZoom(1)}>1:1</button>;
}
