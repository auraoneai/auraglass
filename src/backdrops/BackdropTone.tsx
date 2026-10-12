'use client';
/* REQ-SURF-157 — BackdropTone: plays the sibling backdrop <video> only while
 * [data-ag-continuous="on"] resolves (allowContinuous), the layer intersects,
 * and the tab is visible; pauses within 250 ms otherwise. It renders the
 * WCAG 2.2.2 pause toggle only while the video plays or the user paused it.
 * REQ-SURF-159 — BackdropDriftLayer / useDriftPause: with motion="drift" the
 * .ag-backdrop root is observed by MAT observeOffscreen() (sole writer of
 * data-ag-offscreen) and gets data-backdrop-hidden while the tab is hidden;
 * backdrops.css pauses the drift keyframe under either attribute. */
import * as React from 'react';
import { useResolvedPreferences } from '../theme';
import { observeOffscreen } from '../motion';
import { sampleElementTone } from './sampling/sampleElementTone';

function useDriftPause(layerRef: React.RefObject<HTMLDivElement | null>, enabled: boolean): void {
  React.useEffect(() => {
    if (!enabled) return undefined;
    const root = layerRef.current?.closest('.ag-backdrop') as HTMLElement | null | undefined;
    if (!root) return undefined;
    const unobserve = observeOffscreen(root);
    const sync = () => {
      if (document.hidden) root.setAttribute('data-backdrop-hidden', '');
      else root.removeAttribute('data-backdrop-hidden');
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => {
      unobserve();
      document.removeEventListener('visibilitychange', sync);
      root.removeAttribute('data-backdrop-hidden');
    };
  }, [layerRef, enabled]);
}

/** The graphic-preset decorative layer when motion="drift" (REQ-SURF-159). */
export function BackdropDriftLayer(): React.ReactElement {
  const ref = React.useRef<HTMLDivElement>(null);
  useDriftPause(ref, true);
  return <div ref={ref} className="ag-backdrop-layer" data-ag-part="backdrop-layer" aria-hidden="true" />;
}

/* REQ-SURF-153 — BackdropMediaLayer: the photo/video layer as a client
 * island (Backdrop stays a server component and passes the <img>/<video> in
 * as children, so no extra DOM node is added). With `sample` — Backdrop sets
 * it only when no explicit `mediaTone` prop is given — it samples that element
 * (an <img> after decode(); a <video> by its poster first, else at the first
 * loadeddata) once per src through the tone LRU, and writes exactly two
 * things on the .ag-backdrop root: data-ag-media-tone and --_ag-media-luma. */
export function BackdropMediaLayer(
  { sample, source, video = false, drift = false, children }: {
    sample: boolean; source: string; video?: boolean; drift?: boolean; children: React.ReactNode;
  },
): React.ReactElement {
  const ref = React.useRef<HTMLDivElement>(null);
  useDriftPause(ref, drift);
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
  const layer = (
    <div ref={ref} className="ag-backdrop-layer" data-ag-part="backdrop-layer" aria-hidden="true">
      {children}
    </div>
  );
  return video ? <>{layer}<BackdropTone layerRef={ref} /></> : layer;
}

/** Video playback gate + pause toggle for the video layer behind `layerRef`. */
export function BackdropTone(
  { layerRef }: { layerRef: React.RefObject<HTMLDivElement | null> },
): React.ReactElement | null {
  const { allowContinuous } = useResolvedPreferences();
  const [playing, setPlaying] = React.useState(false);
  const [pausedByUser, setPausedByUser] = React.useState(false);

  // Latest gate inputs for the long-lived observer/listener below; the
  // intersection state survives re-renders (a new observer would only report
  // it again on its first callback).
  const gate = React.useRef({ allowContinuous, pausedByUser, intersecting: false });
  gate.current.allowContinuous = allowContinuous;
  gate.current.pausedByUser = pausedByUser;
  const syncRef = React.useRef<() => void>(() => {});

  React.useEffect(() => {
    const video = layerRef.current?.querySelector('video');
    if (!video) return undefined;
    let alive = true;
    const sync = () => {
      const g = gate.current;
      const mayPlay = g.allowContinuous && !g.pausedByUser && g.intersecting && !document.hidden;
      if (mayPlay && video.paused) {
        void video.play().then(() => { if (alive) setPlaying(true); }).catch(() => { if (alive) setPlaying(false); });
      } else if (!mayPlay && !video.paused) {
        video.pause();
        setPlaying(false);
      }
    };
    syncRef.current = sync;
    const io = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([e]) => { gate.current.intersecting = !!e?.isIntersecting; sync(); })
      : null;
    io?.observe(video);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      alive = false;
      syncRef.current = () => {};
      io?.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [layerRef]);

  // re-evaluate when the preference gate or the user's pause changes
  React.useEffect(() => { syncRef.current(); }, [allowContinuous, pausedByUser]);

  // WCAG 2.2.2: the control exists only while there is motion to stop, or
  // while the user's own pause holds (so it can be resumed). Its accessible
  // name stays "Pause background video"; aria-pressed carries the state.
  if (!playing && !pausedByUser) return null;
  return (
    <button
      type="button"
      data-ag-part="backdrop-pause"
      aria-pressed={pausedByUser}
      onClick={() => setPausedByUser((v) => !v)}
    >
      Pause background video
    </button>
  );
}
