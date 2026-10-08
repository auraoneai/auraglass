'use client';
/* REQ-SURF-134/135/137/138 — MediaControls: Base UI Toolbar root with parts.
 * media?: MediaHandle XOR the controlled prop set (both = dev error). */
import * as React from 'react';
import { Toolbar } from '../../components/toolbar';

type FC = React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const ToolbarRoot = Toolbar.Root as unknown as FC;
import type { MediaHandle } from '../useMediaElement';
import { MediaControlsContext, useMediaModel, type MediaModel } from './mediaContext';
import { handleMediaShortcut } from './shortcuts';
import { formatMediaTime, formatMediaTimeIso } from '../formatMediaTime';
import { MediaScrubber } from '../MediaScrubber/MediaScrubber';
import { PlayButton } from './parts/PlayButton';
import { Scrubber } from './parts/Scrubber';
import { Time } from './parts/Time';
import { Volume } from './parts/Volume';
import { Mute } from './parts/Mute';
import { Rate } from './parts/Rate';
import { Captions } from './parts/Captions';
import { PictureInPicture } from './parts/PictureInPicture';
import { Fullscreen } from './parts/Fullscreen';
import { Spacer } from './parts/Spacer';


export interface MediaControlsRootProps {
  media?: MediaHandle | undefined;
  /* controlled props (mutually exclusive with media) */
  playing?: boolean | undefined;
  currentTime?: number | undefined;
  duration?: number | undefined;
  buffered?: [number, number][] | undefined;
  volume?: number | undefined;
  muted?: boolean | undefined;
  playbackRate?: number | undefined;
  onPlayingChange?: ((playing: boolean) => void) | undefined;
  onSeek?: ((seconds: number) => void) | undefined;
  onVolumeChange?: ((volume: number) => void) | undefined;
  onMutedChange?: ((muted: boolean) => void) | undefined;
  variant?: 'regular' | 'clear' | undefined;
  refraction?: number | undefined;
  label?: string | undefined;
  /** keyboard shortcuts bound on Root only; default true */
  shortcuts?: boolean | undefined;
  shortcutTarget?: HTMLElement | null | undefined;
  children?: React.ReactNode | undefined;
  className?: string | undefined;
}

const DEFAULT_CHILDREN = Symbol('default-children');

function Root(props: MediaControlsRootProps): React.ReactElement {
  const {
    media, playing, currentTime = 0, duration = NaN, buffered = [], volume = 1,
    muted = false, playbackRate = 1,
    onPlayingChange, onSeek, onVolumeChange, onMutedChange,
    variant = 'clear', label = 'Media controls', shortcuts = true,
    shortcutTarget, children, className,
  } = props;

  if (process.env.NODE_ENV !== 'production' && media !== undefined && playing !== undefined) {
    throw new Error('[aura-glass] MediaControls.Root: pass either `media` or controlled `playing`, not both.');
  }

  const st = media?.state;
  const model: MediaModel = React.useMemo(() => ({
    playing: media ? !(st?.paused ?? true) : !!playing,
    waiting: st?.waiting ?? false,
    ended: st?.ended ?? false,
    error: !!st?.error,
    currentTime: media ? st?.currentTime ?? 0 : currentTime,
    duration: media ? st?.duration ?? NaN : duration,
    buffered: media ? st?.buffered ?? [] : buffered,
    volume: media ? st?.volume ?? 1 : volume,
    muted: media ? st?.muted ?? false : muted,
    playbackRate: media ? st?.playbackRate ?? 1 : playbackRate,
    textTracks: media ? st?.textTracks ?? [] : [],
    pictureInPicture: st?.pictureInPicture ?? false,
    toggle() { if (media) media.toggle(); else onPlayingChange?.(!playing); },
    seek(s) { if (media) media.seek(s); else onSeek?.(s); },
    seekBy(d) { if (media) media.seekBy(d); else onSeek?.(currentTime + d); },
    setVolume(v) { if (media) media.setVolume(v); else onVolumeChange?.(v); },
    setMuted(m) { if (media) media.setMuted(m); else onMutedChange?.(m); },
    setRate(r) { media?.setRate(r); },
    requestPictureInPicture() { media?.requestPictureInPicture(); },
    requestFullscreen(t) { media?.requestFullscreen(t); },
    toggleCaptions() {
      const el = media ? (media.state as { textTracks?: unknown[] }) : null;
      void el;
    },
    handle: media,
  }), [media, st, playing, currentTime, duration, buffered, volume, muted, playbackRate,
      onPlayingChange, onSeek, onVolumeChange, onMutedChange]);

  const dataState = model.error ? 'error' : model.waiting ? 'waiting' : model.ended ? 'ended' : model.playing ? 'playing' : 'paused';

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!shortcuts) return;
    const target = shortcutTarget ?? (e.currentTarget as HTMLElement);
    if (!target.contains(e.target as Node)) return;
    const t = e.target as HTMLElement;
    if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable) return;
    if (handleMediaShortcut(e.key, model)) e.preventDefault();
  };

  return (
    <MediaControlsContext.Provider value={model}>
      {/* CMP Toolbar stamps its own data-ag-part ("root"/"button") and overrides render on
          buttons, so the media-controls part markers live on the render element + plain
          <button> parts inside this real CMP toolbar root. */}
      <ToolbarRoot
        render={
          <div
            className={['ag-media-controls', className].filter(Boolean).join(' ')}
            data-ag-part="media-controls"
            role="toolbar"
            data-ag-variant={variant}
            data-state={dataState}
            aria-label={label}
            onKeyDown={onKeyDown}
          />
        }
      >
        {children ?? (
          <>
            <PlayButton />
            <Scrubber />
            <Time />
            <Volume />
          </>
        )}
      </ToolbarRoot>
    </MediaControlsContext.Provider>
  );
}

export const MediaControls = {
  Root, PlayButton, Scrubber, Time, Volume, Mute, Rate, Captions,
  PictureInPicture, Fullscreen, Spacer,
} as const;

export type MediaControls = typeof MediaControls;
