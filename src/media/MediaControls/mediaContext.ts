'use client';
import * as React from 'react';
import type { MediaHandle } from '../useMediaElement';

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
  textTracks: { id: string; label: string; language: string; kind: string; mode: string }[];
  pictureInPicture: boolean;
  toggle(): void;
  seek(seconds: number): void;
  seekBy(delta: number): void;
  setVolume(v: number): void;
  setMuted(m: boolean): void;
  setRate(r: number): void;
  requestPictureInPicture(): void;
  requestFullscreen(target?: Element | null): void;
  toggleCaptions(): void;
  handle?: MediaHandle | undefined;
}

export const MediaControlsContext = React.createContext<MediaModel | null>(null);

export function useMediaModel(part: string): MediaModel {
  const ctx = React.useContext(MediaControlsContext);
  if (!ctx) throw new Error(`MediaControls.${part} must render inside <MediaControls.Root>`);
  return ctx;
}
