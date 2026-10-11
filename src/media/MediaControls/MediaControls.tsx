'use client';
/* REQ-SURF-134..138 — MediaControls: CMP Toolbar root (Base UI Toolbar: one
 * tab stop, Left/Right/Home/End roving among items) with media parts.
 * media?: MediaHandle XOR the controlled prop set (both = dev error).
 * A container wrapper (container-type:inline-size, name ag-media-controls)
 * drives the full/compact/minimal row. Shortcuts are element listeners on
 * Root and shortcutTarget only, never on window/document. */
import * as React from 'react';
import { Toolbar } from '../../components/toolbar';
import type { MediaHandle } from '../useMediaElement';
import type { MediaTextTrack } from '../mediaStore';
import {
  MediaControlsContext, MediaControlsLayoutContext, useIsoLayoutEffect,
  type MediaControlsLayout, type MediaControlsSize, type MediaModel, type RegisteredPart,
} from './mediaContext';
import { handleMediaShortcut, isActivationKeyOnControl, isTextEntry } from './shortcuts';
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
import { More } from './parts/More';

type FC = React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const ToolbarRoot = Toolbar.Root as unknown as FC;

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
  /** Controlled text tracks (captions|subtitles drive the Captions part). */
  textTracks?: MediaTextTrack[] | undefined;
  onPlayingChange?: ((playing: boolean) => void) | undefined;
  onSeek?: ((seconds: number) => void) | undefined;
  onVolumeChange?: ((volume: number) => void) | undefined;
  onMutedChange?: ((muted: boolean) => void) | undefined;
  onRateChange?: ((rate: number) => void) | undefined;
  /** Controlled captions: the track id to show, or null for off. */
  onCaptionsChange?: ((trackId: string | null) => void) | undefined;
  variant?: 'regular' | 'clear' | undefined;
  /** Material refraction on the toolbar chrome (data-ag-refraction). */
  refraction?: boolean | undefined;
  label?: string | undefined;
  /** keyboard shortcuts bound on Root (and shortcutTarget) only; default true */
  shortcuts?: boolean | undefined;
  shortcutTarget?: HTMLElement | null | undefined;
  children?: React.ReactNode | undefined;
  className?: string | undefined;
}

const COMPACT_MAX = 480;
const MINIMAL_MAX = 320;

export function sizeForWidth(width: number): MediaControlsSize {
  if (width < MINIMAL_MAX) return 'minimal';
  if (width < COMPACT_MAX) return 'compact';
  return 'full';
}

const isCaptionTrack = (t: MediaTextTrack) => t.kind === 'captions' || t.kind === 'subtitles';

function useContainerSize(ref: React.RefObject<HTMLElement | null>): MediaControlsSize {
  const [size, setSize] = React.useState<MediaControlsSize>('full');
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const e = entries[entries.length - 1];
      if (!e) return;
      const box = Array.isArray(e.contentBoxSize) ? e.contentBoxSize[0] : undefined;
      const width = box ? box.inlineSize : e.contentRect.width;
      setSize(sizeForWidth(width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

function usePartRegistry(): [Record<RegisteredPart, number>, (p: RegisteredPart) => () => void] {
  const [parts, setParts] = React.useState<Record<RegisteredPart, number>>({ scrubber: 0, mute: 0, rate: 0, pip: 0 });
  const register = React.useCallback((p: RegisteredPart) => {
    setParts((s) => ({ ...s, [p]: s[p] + 1 }));
    return () => setParts((s) => ({ ...s, [p]: Math.max(0, s[p] - 1) }));
  }, []);
  return [parts, register];
}

function Root(props: MediaControlsRootProps): React.ReactElement {
  const {
    media, playing, currentTime = 0, duration = NaN, buffered = [], volume = 1,
    muted = false, playbackRate = 1, textTracks = [],
    onPlayingChange, onSeek, onVolumeChange, onMutedChange, onRateChange, onCaptionsChange,
    variant = 'clear', refraction, label = 'Media controls', shortcuts = true,
    shortcutTarget, children, className,
  } = props;

  if (process.env.NODE_ENV !== 'production' && media !== undefined && playing !== undefined) {
    throw new Error('[aura-glass] MediaControls.Root: pass either `media` or controlled `playing`, not both.');
  }

  // last captions track the user chose; C / the toggle re-shows this one
  const chosenTrack = React.useRef<string | null>(null);

  const st = media?.state;
  const model: MediaModel = React.useMemo(() => {
    const tracks = media ? st?.textTracks ?? [] : textTracks;
    const captionTracks = tracks.filter(isCaptionTrack);
    const selectCaptions = (id: string | null) => {
      if (id !== null) chosenTrack.current = id;
      if (media) {
        for (const t of captionTracks) {
          const mode = t.id === id ? 'showing' : 'disabled';
          if (t.mode !== mode) media.setTextTrackMode(t.id, mode);
        }
      } else onCaptionsChange?.(id);
    };
    const rate = media ? st?.playbackRate ?? 1 : playbackRate;
    return {
      playing: media ? !(st?.paused ?? true) : !!playing,
      waiting: st?.waiting ?? false,
      ended: st?.ended ?? false,
      error: !!st?.error,
      currentTime: media ? st?.currentTime ?? 0 : currentTime,
      duration: media ? st?.duration ?? NaN : duration,
      buffered: media ? st?.buffered ?? [] : buffered,
      volume: media ? st?.volume ?? 1 : volume,
      muted: media ? st?.muted ?? false : muted,
      playbackRate: rate,
      textTracks: tracks,
      captionTracks,
      pictureInPicture: st?.pictureInPicture ?? false,
      toggle() { if (media) media.toggle(); else onPlayingChange?.(!playing); },
      seek(s) { if (media) media.seek(s); else onSeek?.(s); },
      seekBy(d) { if (media) media.seekBy(d); else onSeek?.(currentTime + d); },
      setVolume(v) { if (media) media.setVolume(v); else onVolumeChange?.(v); },
      setMuted(m) { if (media) media.setMuted(m); else onMutedChange?.(m); },
      setRate(r) { if (media) media.setRate(r); else onRateChange?.(r); },
      requestPictureInPicture() { media?.requestPictureInPicture(); },
      requestFullscreen(t) { media?.requestFullscreen(t); },
      selectCaptions,
      toggleCaptions() {
        if (captionTracks.length === 0) return;
        if (captionTracks.some((t) => t.mode === 'showing')) { selectCaptions(null); return; }
        const chosen = captionTracks.find((t) => t.id === chosenTrack.current) ?? captionTracks[0]!;
        selectCaptions(chosen.id);
      },
      handle: media,
    };
  }, [media, st, playing, currentTime, duration, buffered, volume, muted, playbackRate, textTracks,
      onPlayingChange, onSeek, onVolumeChange, onMutedChange, onRateChange, onCaptionsChange]);

  const dataState = model.error ? 'error' : model.waiting ? 'waiting' : model.ended ? 'ended' : model.playing ? 'playing' : 'paused';

  const frameRef = React.useRef<HTMLDivElement | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const size = useContainerSize(frameRef);
  const [parts, register] = usePartRegistry();
  const layout: MediaControlsLayout = React.useMemo(() => ({ size, parts, register }), [size, parts, register]);

  // Shortcuts: one AbortController per binding; listeners on Root and on
  // shortcutTarget (element only). A key acts only when focus is inside the
  // element the listener is on; nested bindings handle an event once.
  const modelRef = React.useRef(model);
  modelRef.current = model;
  React.useEffect(() => {
    if (!shortcuts) return;
    const root = rootRef.current;
    const targets = [root, shortcutTarget ?? null].filter((t): t is HTMLElement => !!t);
    const unique = [...new Set(targets)];
    if (unique.length === 0) return;
    const ac = new AbortController();
    for (const target of unique) {
      target.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
        const active = target.ownerDocument.activeElement;
        if (!active || !target.contains(active)) return;
        const origin = e.target instanceof Element ? e.target : active;
        if (isTextEntry(origin) || isActivationKeyOnControl(e.key, origin)) return;
        if (handleMediaShortcut(e.key, modelRef.current)) e.preventDefault();
      }, { signal: ac.signal });
    }
    return () => ac.abort();
  }, [shortcuts, shortcutTarget]);

  // Base UI Toolbar roves on Left/Right only; Home/End (APG toolbar) jump to
  // the first/last item here. A focused slider keeps Home/End (its thumb
  // stops their propagation).
  const onToolbarKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key !== 'Home' && e.key !== 'End') || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const items = [...e.currentTarget.querySelectorAll<HTMLElement>('button[tabindex], input[type="range"][tabindex]')]
      .filter((el) => !(el as HTMLButtonElement).disabled);
    const next = e.key === 'Home' ? items[0] : items[items.length - 1];
    if (!next || next === e.target) return;
    e.preventDefault();
    next.focus();
  };

  return (
    <MediaControlsContext.Provider value={model}>
      <MediaControlsLayoutContext.Provider value={layout}>
        <div ref={frameRef} className="ag-media-controls-frame" data-size={size}>
          <ToolbarRoot
            ref={rootRef}
            variant={variant}
            {...(refraction === true ? { refraction: true } : {})}
            aria-label={label}
            render={
              <div
                className={['ag-media-controls', className].filter(Boolean).join(' ')}
                data-ag-part="media-controls"
                data-state={dataState}
                onKeyDown={onToolbarKeyDown}
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
            <More />
          </ToolbarRoot>
        </div>
      </MediaControlsLayoutContext.Provider>
    </MediaControlsContext.Provider>
  );
}

export const MediaControls = {
  Root, PlayButton, Scrubber, Time, Volume, Mute, Rate, Captions,
  PictureInPicture, Fullscreen, Spacer,
} as const;

export type MediaControls = typeof MediaControls;
