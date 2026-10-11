'use client';
import { useImageViewer } from '../ivContext';

export function Caption() {
  const c = useImageViewer('Caption');
  if (!c.current?.caption) return null;
  return <figcaption data-ag-part="image-viewer-caption" data-ag-variant="clear">{c.current.caption}</figcaption>;
}
