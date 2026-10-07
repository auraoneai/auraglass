'use client';
import * as React from 'react';
import { NowPlayingBar, useMediaElement } from 'aura-glass/media';

export interface MediaNowPlayingProps {
  src: string;
  title: string;
  subtitle?: string;
  artworkSrc?: string;
}

/** media-now-playing (REQ-SURF-142): mini-player — consumer-owned <audio> +
 * useMediaElement feeding the NowPlayingBar compound. */
export function MediaNowPlaying({ src, title, subtitle, artworkSrc }: MediaNowPlayingProps) {
  const ref = React.useRef<HTMLAudioElement | null>(null);
  const media = useMediaElement(ref, { mediaSession: { title, artist: subtitle } });
  return (
    <div data-ag-media-root data-ag-part="media-now-playing">
      <audio ref={ref} src={src} aria-label={title} />
      <NowPlayingBar.Root media={media}>
        <NowPlayingBar.Artwork src={artworkSrc} alt="" />
        <NowPlayingBar.Title>{title}</NowPlayingBar.Title>
        <NowPlayingBar.Subtitle>{subtitle}</NowPlayingBar.Subtitle>
        <NowPlayingBar.Progress />
        <NowPlayingBar.Actions />
      </NowPlayingBar.Root>
    </div>
  );
}
