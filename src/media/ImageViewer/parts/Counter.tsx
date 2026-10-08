'use client';
import { useImageViewer } from '../ivContext';

export function Counter() {
  const c = useImageViewer('Counter');
  return <span data-ag-part="image-viewer-counter">{c.index + 1} of {c.items.length}</span>;
}
