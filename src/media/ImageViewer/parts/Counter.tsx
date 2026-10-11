'use client';
import { VIEWER_CONTROL_MATERIAL } from './controlMaterial';
import { useImageViewer } from '../ivContext';

export function Counter() {
  const c = useImageViewer('Counter');
  return (
    <span
      data-ag-part="image-viewer-counter"
      {...VIEWER_CONTROL_MATERIAL}
    >{c.index + 1} of {c.items.length}</span>
  );
}
