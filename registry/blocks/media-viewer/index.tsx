/* media-viewer (SURF-503): media detail page — Backdrop, consumer-owned media
 * element + useMediaElement, compound MediaControls, ImageViewer gallery, and
 * the transcript cues wired to the same handle. */
'use client';
import * as React from 'react';
import { Backdrop } from 'aura-glass/backdrops';
import { ImageViewer, MediaControls, useMediaElement } from 'aura-glass/media';
import { ITEM_IMAGES, ITEM_TITLE, TRACKS } from './fixtures';

export interface MediaViewerProps {
  src?: string;
  title?: string;
}

export function MediaViewer({ src = TRACKS.video, title = ITEM_TITLE }: MediaViewerProps) {
  const ref = React.useRef<HTMLVideoElement | null>(null);
  const media = useMediaElement(ref, { sampleTone: true });
  return (
    <Backdrop preset="photo" src={ITEM_IMAGES[0]!.src} tone="dark" data-ag-part="media-viewer">
      <main style={{ padding: '4rem 2rem', display: 'grid', gap: '1.5rem' }}>
        <h1>{title}</h1>
        <div data-ag-media-root style={{ maxInlineSize: '48rem' }}>
          <video ref={ref} src={src} crossOrigin="anonymous" playsInline aria-label={title}
            style={{ inlineSize: '100%', borderRadius: '0.75rem' }}>
            <track kind="captions" src={TRACKS.captions} srcLang="en" label="English" default />
          </video>
          <MediaControls.Root media={media}>
            <MediaControls.PlayButton />
            <MediaControls.Scrubber />
            <MediaControls.Time />
            <MediaControls.Spacer />
            <MediaControls.Volume />
            <MediaControls.Mute />
            <MediaControls.Fullscreen />
          </MediaControls.Root>
        </div>
        <section aria-label="Screenshots">
          <ImageViewer.Root items={ITEM_IMAGES}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {ITEM_IMAGES.map((it) => (
                <ImageViewer.Trigger key={it.id} id={it.id} className="ag-media-thumb">
                  <img src={it.src} alt={it.alt} loading="lazy" style={{ inlineSize: '10rem', borderRadius: '0.5rem' }} />
                </ImageViewer.Trigger>
              ))}
            </div>
            <ImageViewer.Popup />
          </ImageViewer.Root>
        </section>
      </main>
    </Backdrop>
  );
}
