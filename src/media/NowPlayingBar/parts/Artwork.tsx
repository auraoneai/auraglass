'use client';
import * as React from 'react';
import { useNowPlaying } from '../npContext';
import { getOrSampleTone } from '../../sampling/toneCache';

/* REQ-SURF-139 — <img alt=""> (decorative; no extra aria-hidden). With the
 * Root's `sampleTone`, the image is sampled once per src through the tone LRU
 * and the result is written on the Root: data-ag-media-tone + --_ag-media-luma. */
export const Artwork = function Artwork({src, className, ref}: { src?: string | undefined; className?: string } & { ref?: React.Ref<HTMLDivElement> }) {
    const m = useNowPlaying('Artwork');
    const s = src ?? m.artwork;
    const imgRef = React.useRef<HTMLImageElement | null>(null);
    const sampleTone = m.sampleTone;

    React.useEffect(() => {
      const img = imgRef.current;
      if (!sampleTone || !img || !s) return;
      const root = img.closest('[data-ag-part="now-playing"]') as HTMLElement | null;
      if (!root) return;
      let live = true;
      const apply = (tone: 'light' | 'dark' | undefined, luma: number | null) => {
        if (!live) return;
        if (tone) root.setAttribute('data-ag-media-tone', tone);
        else root.removeAttribute('data-ag-media-tone');
        if (luma !== null) root.style.setProperty('--_ag-media-luma', luma.toFixed(3));
        else root.style.removeProperty('--_ag-media-luma');
      };
      const sample = () => getOrSampleTone(img, undefined, apply);
      const ctrl = new AbortController();
      if (img.complete && img.naturalWidth > 0) sample();
      else img.addEventListener('load', sample, { once: true, signal: ctrl.signal });
      return () => { live = false; ctrl.abort(); };
    }, [sampleTone, s]);

    return (
      <div ref={ref} data-ag-part="now-playing-artwork" className={['ag-now-playing-artwork', className].filter(Boolean).join(' ')}>
        {s ? <img ref={imgRef} src={s} alt="" {...(sampleTone ? { crossOrigin: 'anonymous' as const } : {})} /> : null}
      </div>
    );
  };
