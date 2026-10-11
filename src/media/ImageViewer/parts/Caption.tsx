'use client';
import { VIEWER_CONTROL_MATERIAL } from './controlMaterial';
import { useImageViewer } from '../ivContext';

export function Caption() {
  const c = useImageViewer('Caption');
  if (!c.current?.caption) return null;
  return (
    <figcaption
      data-ag-part="image-viewer-caption"
      {...VIEWER_CONTROL_MATERIAL}
    >{c.current.caption}</figcaption>
  );
}
