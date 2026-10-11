'use client';
import { useImageViewer } from '../ivContext';

export function Prev() {
  const c = useImageViewer('Prev');
  return <button type="button" data-ag-part="image-viewer-prev" aria-label="Previous image" aria-disabled={!c.loop && c.index === 0} onClick={(e) => c.prev({ event: e.nativeEvent, reason: 'trigger-press' })}>‹</button>;
}
