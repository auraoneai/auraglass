'use client';
import * as React from 'react';
import { MediaControls, useMediaElement } from 'aura-glass/media';

export interface MediaVideoPlayerProps {
  src: string;
  /** Caption tracks — shipped as <track kind="captions"> children of the
   * consumer-owned <video>. */
  captions?: Array<{ src: string; srclang: string; label: string; default?: boolean }>;
  poster?: string;
  'aria-label'?: string;
}

/** media-video-player (REQ-SURF-134/-156): the element stays consumer-owned —
 * the item wires useMediaElement + the compound MediaControls; captions are
 * real <track> children, never a simulated overlay. */
export function MediaVideoPlayer({ src, captions = [], poster, 'aria-label': ariaLabel = 'Video player' }: MediaVideoPlayerProps) {
  const ref = React.useRef<HTMLVideoElement | null>(null);
  const media = useMediaElement(ref);
  return (
    <div data-ag-media-root data-ag-part="media-video-player" style={{ position: 'relative' }}>
      <video ref={ref} src={src} poster={poster} aria-label={ariaLabel} playsInline style={{ inlineSize: '100%' }}>
        {captions.map((t) => (
          <track key={t.srclang} kind="captions" src={t.src} srcLang={t.srclang} label={t.label} default={t.default} />
        ))}
      </video>
      <MediaControls.Root media={media}>
        <MediaControls.PlayButton />
        <MediaControls.Scrubber />
        <MediaControls.Time />
        <MediaControls.Spacer />
        <MediaControls.Volume />
        <MediaControls.Mute />
        <MediaControls.Captions />
        <MediaControls.PictureInPicture />
        <MediaControls.Fullscreen />
      </MediaControls.Root>
    </div>
  );
}
