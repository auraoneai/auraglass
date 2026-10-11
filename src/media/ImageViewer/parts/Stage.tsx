'use client';
import { useEffect, useRef, useState } from 'react';
import { useImageViewer } from '../ivContext';
import { useZoomPan } from '../useZoomPan';
import { getOrSampleTone } from '../../sampling/toneCache';
import type { MediaTone } from '../../sampling/classifyTone';
import type { ImageViewerItem } from '../types';

/** The zoom/pan stage — renders ≤3 <img> (current + hidden prev/next).
 * REQ-SURF-145: declares data-ag-backdrop='media'; the current image is
 * sampled once per src (after decode()) through the tone LRU and the result
 * is written as data-ag-media-tone. */
export function Stage({ className }: { className?: string }) {
  const c = useImageViewer('Stage');
  const stageRef = useRef<HTMLDivElement | null>(null);
  const currentImg = useRef<HTMLImageElement | null>(null);
  const { panState, gesturing, handlers } = useZoomPan(stageRef);
  const { items, index, zoom, sampleTone } = c;
  const [tone, setTone] = useState<MediaTone>(undefined);
  const currentSrc = items[index]?.src;

  useEffect(() => {
    setTone(undefined);
    const img = currentImg.current;
    if (!sampleTone || !img || !currentSrc) return undefined;
    let live = true;
    const sample = () => {
      if (!live || img.naturalWidth === 0) return;
      getOrSampleTone(img, undefined, (t) => { if (live) setTone(t); });
    };
    const ctrl = new AbortController();
    if (typeof img.decode === 'function') {
      img.decode().then(sample, () => { /* broken image: no tone */ });
    } else if (img.complete) sample();
    else img.addEventListener('load', sample, { once: true, signal: ctrl.signal });
    return () => { live = false; ctrl.abort(); };
  }, [sampleTone, currentSrc]);

  const imgs = [
    items[index - 1] && { item: items[index - 1]!, hidden: true },
    items[index] && { item: items[index]!, hidden: false },
    items[index + 1] && { item: items[index + 1]!, hidden: true },
  ].filter(Boolean) as { item: ImageViewerItem; hidden: boolean }[];
  return (
    <div
      ref={stageRef}
      data-ag-part="image-viewer-stage"
      data-ag-backdrop="media"
      data-state={zoom > 1 ? 'zoomed' : 'fit'}
      {...(tone ? { 'data-ag-media-tone': tone } : {})}
      className={['ag-image-viewer-stage', className].filter(Boolean).join(' ')}
      {...handlers}
    >
      {imgs.map(({ item, hidden }) => (
        <img
          key={item.id}
          ref={hidden ? undefined : currentImg}
          src={item.src}
          srcSet={item.srcSet}
          alt={item.alt}
          crossOrigin={item.crossOrigin}
          loading="eager"
          decoding="async"
          fetchPriority={hidden ? 'low' : 'high'}
          width={item.width}
          height={item.height}
          {...(hidden ? { 'aria-hidden': 'true', hidden: true } : {})}
          style={hidden ? undefined : {
            transform: `translate3d(${panState.x}px, ${panState.y}px, 0) scale(${zoom})`,
            // a live pan/pinch follows the fingers; the CSS zoom transition
            // applies only to discrete steps (buttons, keys, wheel)
            ...(gesturing ? { transitionDuration: '0s' } : {}),
          }}
        />
      ))}
    </div>
  );
}
