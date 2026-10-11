'use client';
/* REQ-SURF-157 — BackdropTone: plays the sibling backdrop <video> only while
 * [data-ag-continuous="on"] resolves (allowContinuous), the layer intersects,
 * and the tab is visible; pauses within 250 ms otherwise. While playing it
 * renders the WCAG 2.2.2 pause toggle. */
import * as React from 'react';
import { useResolvedPreferences } from '../theme';
import { sampleElementTone } from './sampling/sampleElementTone';

/* REQ-SURF-153 — BackdropMediaLayer: the photo/video layer as a client
 * island (Backdrop stays a server component and passes the <img>/<video> in
 * as children, so no extra DOM node is added). With `sample` — Backdrop sets
 * it only when no explicit `tone` prop is given — it samples that element
 * (an <img> after decode(); a <video> by its poster first, else at the first
 * loadeddata) once per src through the tone LRU, and writes exactly two
 * things on the .ag-backdrop root: data-ag-media-tone and --_ag-media-luma. */
export function BackdropMediaLayer(
  { sample, source, children }: { sample: boolean; source: string; children: React.ReactNode },
): React.ReactElement {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const layer = ref.current;
    const root = layer?.closest('.ag-backdrop') as HTMLElement | null | undefined;
    const media = layer?.querySelector(':scope > img, :scope > video') as HTMLImageElement | HTMLVideoElement | null | undefined;
    if (!sample || !root || !media) return undefined;
    return sampleElementTone(media, (tone, luma) => {
      if (tone) root.setAttribute('data-ag-media-tone', tone);
      else root.removeAttribute('data-ag-media-tone');
      if (luma !== null) root.style.setProperty('--_ag-media-luma', luma.toFixed(3));
      else root.style.removeProperty('--_ag-media-luma');
    });
  }, [sample, source]);
  return (
    <div ref={ref} className="ag-backdrop-layer" data-ag-part="backdrop-layer" aria-hidden="true">
      {children}
    </div>
  );
}

export function BackdropTone(): React.ReactElement | null {
  const { allowContinuous } = useResolvedPreferences();
  const [playing, setPlaying] = React.useState(false);
  const [pausedByUser, setPausedByUser] = React.useState(false);
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const btn = ref.current;
    const root = btn?.closest('.ag-backdrop');
    const video = root?.querySelector('video');
    if (!root || !video) return;
    let intersecting = false;
    const io = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([e]) => { intersecting = !!e?.isIntersecting; sync(); })
      : null;
    io?.observe(video);

    const sync = () => {
      const mayPlay = allowContinuous && !pausedByUser && intersecting && !document.hidden;
      if (mayPlay && video.paused) {
        void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      } else if (!mayPlay && !video.paused) {
        video.pause();
        setPlaying(false);
      }
    };
    const onVis = () => sync();
    document.addEventListener('visibilitychange', onVis);
    sync();
    return () => { io?.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  }, [allowContinuous, pausedByUser]);

  // visible only while playing (focus/hover handled in CSS)
  return (
    <button
      ref={ref}
      type="button"
      data-ag-part="backdrop-pause"
      aria-pressed={pausedByUser}
      data-ag-backdrop-pause-visible={playing ? '' : undefined}
      onClick={() => setPausedByUser((v) => !v)}
    >
      {pausedByUser ? 'Play background video' : 'Pause background video'}
    </button>
  );
}
