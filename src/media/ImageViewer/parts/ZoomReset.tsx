'use client';
import { useImageViewer } from '../ivContext';

export function ZoomReset() {
  const c = useImageViewer('ZoomReset');
  return <button type="button" className="ag-media-btn" data-ag-part="image-viewer-zoom-reset" aria-label="Reset zoom" onClick={() => c.setZoom(1)}>1:1<span data-ag-part="hit-area" aria-hidden="true" /></button>;
}
