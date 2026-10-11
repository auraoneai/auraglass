'use client';
import { useImageViewer } from '../ivContext';
import { MediaGlyph } from '../../glyphs';

export function ZoomIn() {
  const c = useImageViewer('ZoomIn');
  return (
    <button type="button" className="ag-media-btn" data-ag-part="image-viewer-zoom-in" aria-label="Zoom in" onClick={() => c.setZoom(c.zoom * 1.25)}>
      <MediaGlyph name="zoom-in" />
    </button>
  );
}
