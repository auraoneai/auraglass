'use client';
import { useImageViewer } from '../ivContext';

export function ZoomOut() {
  const c = useImageViewer('ZoomOut');
  return <button type="button" data-ag-part="image-viewer-zoom-out" aria-label="Zoom out" onClick={() => c.setZoom(c.zoom / 1.25)}>−</button>;
}
