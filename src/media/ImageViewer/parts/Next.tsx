'use client';
import { useImageViewer } from '../ivContext';

export function Next() {
  const c = useImageViewer('Next');
  return <button type="button" data-ag-part="image-viewer-next" aria-label="Next image" aria-disabled={!c.loop && c.index === c.items.length - 1} onClick={() => c.next()}>›</button>;
}
