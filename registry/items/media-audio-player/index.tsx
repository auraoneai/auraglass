'use client';
import * as React from 'react';
import { MediaControls, useMediaElement } from 'aura-glass/media';

export interface MediaAudioPlayerProps {
  src: string;
  /** Captions/subtitle tracks — real <track kind="captions"> children. */
  captions?: Array<{ src: string; srclang: string; label: string; default?: boolean }>;
  'aria-label'?: string;
}

/** media-audio-player (REQ-SURF-134): consumer-owned <audio> + useMediaElement;
 * no visual element — controls carry the whole surface. */
export function MediaAudioPlayer({ src, captions = [], 'aria-label': ariaLabel = 'Audio player' }: MediaAudioPlayerProps) {
  const ref = React.useRef<HTMLAudioElement | null>(null);
  const media = useMediaElement(ref);
  return (
    <div data-ag-media-root data-ag-part="media-audio-player">
      <audio ref={ref} src={src} aria-label={ariaLabel}>
        {captions.map((t) => (
          <track key={t.srclang} kind="captions" src={t.src} srcLang={t.srclang} label={t.label} default={t.default} />
        ))}
      </audio>
      <MediaControls.Root media={media}>
        <MediaControls.PlayButton />
        <MediaControls.Scrubber />
        <MediaControls.Time />
        <MediaControls.Spacer />
        <MediaControls.Volume />
        <MediaControls.Mute />
        <MediaControls.Rate />
      </MediaControls.Root>
    </div>
  );
}
