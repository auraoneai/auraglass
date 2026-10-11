'use client';
import * as React from 'react';

export interface NowPlayingContext {
  playing: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  artwork?: string | undefined;
  toggle(): void;
  sampleTone: boolean;
}
export const NowPlayingBarContext = React.createContext<NowPlayingContext | null>(null);
export function useNowPlaying(part: string): NowPlayingContext {
  const c = React.useContext(NowPlayingBarContext);
  if (!c) throw new Error(`NowPlayingBar.${part} must render inside <NowPlayingBar.Root>`);
  return c;
}
