'use client';
import * as React from 'react';
import type { MediaHandle } from '../useMediaElement';
import type { MediaTextTrack } from '../mediaStore';

/** Container-width class of the controls row (REQ-SURF-135):
 * full ≥480 px, compact 320–479 px, minimal <320 px. */
export type MediaControlsSize = 'full' | 'compact' | 'minimal';

/** Parts that register their presence with Root so siblings can adapt
 * (Time aria-hidden next to a Scrubber; Volume→Mute; Rate/PiP → "More"). */
export type RegisteredPart = 'scrubber' | 'mute' | 'rate' | 'pip';

/* Resolved per-Root media model: either a live MediaHandle or the controlled
 * prop set (REQ-SURF-134). All parts read this context. */
export interface MediaModel {
  playing: boolean;
  waiting: boolean;
  ended: boolean;
  error: boolean;
  currentTime: number;
  duration: number;
  buffered: [number, number][];
  volume: number;
  muted: boolean;
  playbackRate: number;
  textTracks: MediaTextTrack[];
  /** captions|subtitles tracks only, in element order. */
  captionTracks: MediaTextTrack[];
  pictureInPicture: boolean;
  toggle(): void;
  seek(seconds: number): void;
  seekBy(delta: number): void;
  setVolume(v: number): void;
  setMuted(m: boolean): void;
  setRate(r: number): void;
  requestPictureInPicture(): void;
  requestFullscreen(target?: Element | null): void;
  /** Flip the chosen captions|subtitles track between showing and disabled. */
  toggleCaptions(): void;
  /** Show exactly this captions|subtitles track (null = captions off). */
  selectCaptions(id: string | null): void;
  handle?: MediaHandle | undefined;
}

export interface MediaControlsLayout {
  size: MediaControlsSize;
  /** count of mounted parts per kind */
  parts: Readonly<Record<RegisteredPart, number>>;
  register(part: RegisteredPart): () => void;
}

export const MediaControlsContext = React.createContext<MediaModel | null>(null);
export const MediaControlsLayoutContext = React.createContext<MediaControlsLayout | null>(null);

export function useMediaModel(part: string): MediaModel {
  const ctx = React.useContext(MediaControlsContext);
  if (!ctx) throw new Error(`MediaControls.${part} must render inside <MediaControls.Root>`);
  return ctx;
}

const NO_PARTS: Record<RegisteredPart, number> = { scrubber: 0, mute: 0, rate: 0, pip: 0 };
const STANDALONE: MediaControlsLayout = { size: 'full', parts: NO_PARTS, register: () => () => {} };

export function useMediaLayout(): MediaControlsLayout {
  return React.useContext(MediaControlsLayoutContext) ?? STANDALONE;
}

const useIsoLayoutEffect = typeof document !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/** Register this part with Root for as long as it is mounted (rendered or not). */
export function useRegisterPart(part: RegisteredPart): void {
  const { register } = useMediaLayout();
  useIsoLayoutEffect(() => register(part), [register, part]);
}

export { useIsoLayoutEffect };
