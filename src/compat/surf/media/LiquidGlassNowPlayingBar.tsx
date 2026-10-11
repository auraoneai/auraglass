/* LiquidGlassNowPlayingBar — 4.x compat adapter (REQ-SURF-13, DEP-S0602) →
   NowPlayingBar. title/subtitle → Title/Subtitle parts, playing/progress
   map 1:1, onPlayPause() ← onPlayingChange, onExpand() ← Expand. 4.x
   `artwork` was a ReactNode: an image URL string becomes the Artwork src;
   other nodes render inside the Artwork slot. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { NowPlayingBar } from '../../../media/NowPlayingBar/NowPlayingBar';

export interface LiquidGlassNowPlayingBarProps {
  title?: string;
  subtitle?: string;
  artwork?: React.ReactNode;
  playing?: boolean;
  progress?: number;
  onPlayPause?: (playing: boolean) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  className?: string;
  [legacy: string]: unknown;
}

/**
 * 4.x `LiquidGlassNowPlayingBar` compat adapter (DEP-S0602).
 * @deprecated since 4.2.0, removed in 5.0.0. Use {@link NowPlayingBar from aura-glass/media}.
 */
export function LiquidGlassNowPlayingBar(props: LiquidGlassNowPlayingBarProps) {
  warnDeprecated('DEP-S0602');
  const { title, subtitle, artwork, playing = false, progress, onPlayPause, onPrevious, onNext, className } = props;
  const src = typeof artwork === 'string' ? artwork : undefined;
  return (
    <NowPlayingBar.Root
      playing={playing}
      {...(progress !== undefined ? { progress } : {})}
      {...(src ? { artwork: src } : {})}
      {...(onPlayPause ? { onPlayingChange: onPlayPause } : {})}
      {...(onPrevious ? { onPrevious } : {})}
      {...(onNext ? { onNext } : {})}
      {...(className ? { className } : {})}
    >
      {src || artwork == null ? <NowPlayingBar.Artwork /> : <div className="ag-now-playing-artwork">{artwork}</div>}
      <NowPlayingBar.Title>{title}</NowPlayingBar.Title>
      {subtitle !== undefined ? <NowPlayingBar.Subtitle>{subtitle}</NowPlayingBar.Subtitle> : null}
      <NowPlayingBar.Actions onPrevious={onPrevious} onNext={onNext} />
      <NowPlayingBar.Progress />
    </NowPlayingBar.Root>
  );
}
