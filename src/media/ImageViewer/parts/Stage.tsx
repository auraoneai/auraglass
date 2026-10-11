'use client';
import * as React from 'react';
import { useImageViewer } from '../ivContext';
import { useZoomPan } from '../useZoomPan';
import type { ImageViewerItem } from '../types';

/** The zoom/pan stage — renders ≤3 <img> (current + hidden prev/next). */
export function Stage({ className }: { className?: string }) {
  const c = useImageViewer('Stage');
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const { panState, handlers } = useZoomPan(stageRef);
  const { items, index, zoom } = c;
  const imgs = [
    items[index - 1] && { item: items[index - 1]!, hidden: true },
    items[index] && { item: items[index]!, hidden: false },
    items[index + 1] && { item: items[index + 1]!, hidden: true },
  ].filter(Boolean) as { item: ImageViewerItem; hidden: boolean }[];
  return (
    <div
      ref={stageRef}
      data-ag-part="image-viewer-stage"
      data-state={zoom > 1 ? 'zoomed' : 'fit'}
      className={['ag-image-viewer-stage', className].filter(Boolean).join(' ')}
      {...handlers}
    >
      {imgs.map(({ item, hidden }) => (
        <img
          key={item.id}
          src={item.src}
          srcSet={item.srcSet}
          alt={item.alt}
          loading="eager"
          decoding="async"
          fetchPriority={hidden ? 'low' : 'high'}
          width={item.width}
          height={item.height}
          {...(hidden ? { 'aria-hidden': 'true', hidden: true } : {})}
          style={{ transform: hidden ? undefined : `translate3d(${panState.x}px, ${panState.y}px, 0) scale(${zoom})` }}
        />
      ))}
    </div>
  );
}
