'use client';
/* REQ-SURF-157 — BackdropTone: plays the sibling backdrop <video> only while
 * [data-ag-continuous="on"] resolves (allowContinuous), the layer intersects,
 * and the tab is visible; pauses within 250 ms otherwise. While playing it
 * renders the WCAG 2.2.2 pause toggle. */
import * as React from 'react';
import { useResolvedPreferences } from '../theme';

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
