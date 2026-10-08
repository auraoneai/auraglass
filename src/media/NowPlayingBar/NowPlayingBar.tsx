'use client';
/* REQ-SURF-139 — NowPlayingBar: Root/Artwork/Title/Subtitle/Progress/
 * Actions/Expand. media XOR controlled; progress reads --_ag-media-progress
 * (no inline width); Expand requires aria-controls. */
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
  /** 0..1 controlled progress (else read from --_ag-media-progress via CSS). */
  progress?: number | undefined;
  artwork?: string | undefined;
  onPlayingChange?: ((playing: boolean) => void) | undefined;
  onPrevious?: (() => void) | undefined;
  onNext?: (() => void) | undefined;
  expanded?: boolean | undefined;
  onExpandedChange?: ((expanded: boolean) => void) | undefined;
  variant?: 'regular' | 'clear' | undefined;
  sampleTone?: boolean | undefined;
  /** Id of the expandable region — required when Expand is rendered. */
  expandedId?: string | undefined;
  className?: string | undefined;
  children?: React.ReactNode;
}

function Root(props: NowPlayingBarRootProps): React.ReactElement {
  const {
    media, playing, progress, artwork,
    onPlayingChange, onPrevious, onNext, expanded, onExpandedChange,
    variant = 'regular', sampleTone = false, expandedId, className, children,
  } = props;
  if (process.env.NODE_ENV !== 'production' && media !== undefined && playing !== undefined) {
    throw new Error('[aura-glass] NowPlayingBar.Root: pass either `media` or controlled `playing`, not both.');
  }
  const st = media?.state;
  const model: NowPlayingContext = {
    playing: media ? !(st?.paused ?? true) : !!playing,
    currentTime: st?.currentTime ?? 0,
    duration: st?.duration ?? NaN,
    progress: progress ?? (st && Number.isFinite(st.duration) && st.duration > 0 ? st.currentTime / st.duration : 0),
    artwork,
    sampleTone,
    toggle() { if (media) media.toggle(); else onPlayingChange?.(!playing); },
  };
  return (
    <NowPlayingBarContext.Provider value={model}>
      <div
        className={['ag-now-playing', className].filter(Boolean).join(' ')}
        data-ag-part="now-playing"
        data-ag-variant={variant}
        data-ag-media-root=""
        data-ag-now-playing-container=""
        {...(expandedId ? { 'data-ag-expanded-id': expandedId } : {})}
        {...(expanded !== undefined ? { 'data-expanded': expanded ? '' : undefined } : {})}
      >
        {children ?? (
          <>
            <Artwork />
            <Title />
            <Actions onPrevious={onPrevious} onNext={onNext} />
            <Progress />
            <Expand expandedId={expandedId} expanded={expanded} onExpandedChange={onExpandedChange} />
          </>
        )}
      </div>
    </NowPlayingBarContext.Provider>
  );
}

export const NowPlayingBar = { Root, Artwork, Title, Subtitle, Progress, Actions, Expand } as const;
export type NowPlayingBar = typeof NowPlayingBar;
