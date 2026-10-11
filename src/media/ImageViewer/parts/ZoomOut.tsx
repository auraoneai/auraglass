'use client';
import { useImageViewer } from '../ivContext';
import { MediaGlyph } from '../../glyphs';

export function ZoomOut() {
  const c = useImageViewer('ZoomOut');
  return (
    <button type="button" className="ag-media-btn" data-ag-part="image-viewer-zoom-out" aria-label="Zoom out" onClick={() => c.setZoom(c.zoom / 1.25)}>
      <MediaGlyph name="zoom-out" />
    </button>
  );
}
