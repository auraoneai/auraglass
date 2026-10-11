'use client';
import * as React from 'react';
import { VIEWER_CONTROL_MATERIAL } from './controlMaterial';
import { useImageViewer } from '../ivContext';
import { MediaGlyph } from '../../glyphs';

export const Close = function Close({className, ref}: { className?: string } & { ref?: React.Ref<HTMLButtonElement> }) {
  const c = useImageViewer('Close');
  return (
    <button
      ref={ref}
      type="button"
      data-ag-part="image-viewer-close"
      {...VIEWER_CONTROL_MATERIAL}
      aria-label="Close"
      className={['ag-media-btn', className].filter(Boolean).join(' ')}
      onClick={() => c.setOpen(false)}
    ><MediaGlyph name="close" /></button>
  );
};
