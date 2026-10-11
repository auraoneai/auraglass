'use client';
import { VIEWER_CONTROL_MATERIAL } from './controlMaterial';
import { useImageViewer } from '../ivContext';
import { MediaGlyph } from '../../glyphs';

export function Next() {
  const c = useImageViewer('Next');
  return (
    <button
      type="button"
      className="ag-media-btn"
      data-ag-part="image-viewer-next"
      {...VIEWER_CONTROL_MATERIAL}
      aria-label="Next image"
      aria-disabled={!c.loop && c.index === c.items.length - 1}
      onClick={() => c.next()}
    ><MediaGlyph name="chevron-right" size={20} /></button>
  );
}
