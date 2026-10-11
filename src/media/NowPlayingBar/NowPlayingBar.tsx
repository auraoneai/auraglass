'use client';
/* REQ-SURF-139 — NowPlayingBar: Root/Artwork/Title/Subtitle/Progress/
 * Actions/Expand. media XOR controlled; progress reads --_ag-media-progress
 * (no inline width; the Root writes the var from a ref effect); Expand
 * requires aria-controls, so the default children render it only when
 * `expandedId` is set. */
import * as React from 'react';
import type { MediaHandle } from '../useMediaElement';
import { NowPlayingBarContext, type NowPlayingContext } from './npContext';
import { Artwork } from './parts/Artwork';
import { Title } from './parts/Title';
import { Subtitle } from './parts/Subtitle';
import { Actions } from './parts/Actions';
import { Progress } from './parts/Progress';
import { Expand } from './parts/Expand';

export interface NowPlayingBarRootProps {
  media?: MediaHandle | undefined;
  playing?: boolean | undefined;
  /** 0..1 controlled progress, written to --_ag-media-progress on the root. */
  progress?: number | undefined;
  artwork?: string | undefined;
  onPlayingChange?: ((playing: boolean) => void) | undefined;
  onPrevious?: (() => void) | undefined;
  onNext?: (() => void) | undefined;
  expanded?: boolean | undefined;
  onExpandedChange?: ((expanded: boolean) => void) | undefined;
  variant?: 'regular' | 'clear' | undefined;
  /** Sample the Artwork <img> once per src; writes data-ag-media-tone and --_ag-media-luma on the root. */
  sampleTone?: boolean | undefined;
  /** Pinned to the viewport edge: pads by env(safe-area-inset-bottom). */
  fixed?: boolean | undefined;
  /** Id of the expandable region — required when Expand is rendered. */
  expandedId?: string | undefined;
  className?: string | undefined;
  children?: React.ReactNode;
}

const useIsoLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

const clamp01 = (v: number) => (Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0);

function Root(props: NowPlayingBarRootProps): React.ReactElement {
  const {
    media, playing, progress, artwork,
    onPlayingChange, onPrevious, onNext, expanded, onExpandedChange,
    variant = 'regular', sampleTone = false, fixed = false, expandedId, className, children,
  } = props;
  if (process.env.NODE_ENV !== 'production' && media !== undefined && playing !== undefined) {
    throw new Error('[aura-glass] NowPlayingBar.Root: pass either `media` or controlled `playing`, not both.');
  }
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const st = media?.state;
  const mediaProgress = st && Number.isFinite(st.duration) && st.duration > 0 ? st.currentTime / st.duration : undefined;
  const value = progress ?? mediaProgress;
  const model: NowPlayingContext = {
    playing: media ? !(st?.paused ?? true) : !!playing,
    currentTime: st?.currentTime ?? 0,
    duration: st?.duration ?? NaN,
    progress: value ?? 0,
    artwork,
    sampleTone,
    toggle() { if (media) media.toggle(); else onPlayingChange?.(!playing); },
  };

  // Controlled (or media-derived) progress → --_ag-media-progress, 4 decimals,
  // written on the element so the fill never gets an inline width.
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (value === undefined) root.style.removeProperty('--_ag-media-progress');
    else root.style.setProperty('--_ag-media-progress', clamp01(value).toFixed(4));
  }, [value]);

  return (
    <NowPlayingBarContext.Provider value={model}>
      <div
        ref={rootRef}
        className={['ag-now-playing', className].filter(Boolean).join(' ')}
        data-ag-part="now-playing"
        data-ag-variant={variant}
        data-ag-media-root=""
        {...(variant === 'clear' ? { 'data-ag-backdrop': 'media' } : {})}
        {...(fixed ? { 'data-ag-now-playing-fixed': '' } : {})}
        {...(expanded !== undefined ? { 'data-expanded': expanded ? '' : undefined } : {})}
      >
        {children ?? (
          <>
            <Artwork />
            <Title />
            <Actions onPrevious={onPrevious} onNext={onNext} />
            <Progress />
            {expandedId !== undefined
              ? <Expand expandedId={expandedId} expanded={expanded} onExpandedChange={onExpandedChange} />
              : null}
          </>
        )}
      </div>
    </NowPlayingBarContext.Provider>
  );
}

export const NowPlayingBar = { Root, Artwork, Title, Subtitle, Progress, Actions, Expand } as const;
export type NowPlayingBar = typeof NowPlayingBar;
