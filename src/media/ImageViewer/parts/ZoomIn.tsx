'use client';
import { useImageViewer } from '../ivContext';

export function ZoomIn() {
  const c = useImageViewer('ZoomIn');
  return <button type="button" data-ag-part="image-viewer-zoom-in" aria-label="Zoom in" onClick={() => c.setZoom(c.zoom * 1.25)}>+</button>;
}
