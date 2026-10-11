'use client';
import { VIEWER_CONTROL_MATERIAL } from './controlMaterial';
import { useImageViewer } from '../ivContext';
import { MediaGlyph } from '../../glyphs';

export function Prev() {
  const c = useImageViewer('Prev');
  return (
    <button
      type="button"
      className="ag-media-btn"
      data-ag-part="image-viewer-prev"
      {...VIEWER_CONTROL_MATERIAL}
      aria-label="Previous image"
      aria-disabled={!c.loop && c.index === 0}
      onClick={() => c.prev()}
    ><MediaGlyph name="chevron-left" size={20} /></button>
  );
}
