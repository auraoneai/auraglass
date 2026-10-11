/* media-viewer (SURF-503): media detail page — Backdrop, consumer-owned media
 * element + useMediaElement, compound MediaControls, ImageViewer gallery, and
 * the transcript cues wired to the same handle. Consumers pass their own
 * media (src/poster/backdrop/images); the fixtures are only the defaults. */
'use client';
import * as React from 'react';
import { Backdrop } from 'aura-glass/backdrops';
import { ImageViewer, MediaControls, useMediaElement } from 'aura-glass/media';
import { ITEM_IMAGES, ITEM_TITLE, TRACKS } from './fixtures';

export interface MediaViewerImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export interface MediaViewerProps {
  src?: string;
  title?: string;
  /** Frame shown before playback (and when the source cannot load). Defaults to the first image. */
  poster?: string;
  /** Image painted behind the page. Defaults to the first image. */
  backdrop?: string;
  /** Gallery under the player; pass [] to omit the gallery. */
  images?: readonly MediaViewerImage[];
}

const stack: React.CSSProperties = { display: 'grid', gap: '1rem', minInlineSize: 0 };

export function MediaViewer({ src = TRACKS.video, title = ITEM_TITLE, poster, backdrop, images = ITEM_IMAGES }: MediaViewerProps) {
  const ref = React.useRef<HTMLVideoElement | null>(null);
  const media = useMediaElement(ref, { sampleTone: true });
  const first = images[0]?.src;
  return (
    <Backdrop preset="photo" src={backdrop ?? first ?? ITEM_IMAGES[0]!.src} tone="dark" data-ag-part="media-viewer">
      <main style={{ padding: '1.5rem', display: 'grid', gap: '1.25rem', minInlineSize: 0 }}>
        <h1 style={{ margin: 0, fontSize: 'var(--ag-type-title-2-size, 1.375rem)', lineHeight: 1.2, fontWeight: 600 }}>{title}</h1>
        <div data-ag-media-root style={stack}>
          <video ref={ref} src={src} poster={poster ?? first} crossOrigin="anonymous" playsInline aria-label={title}
            style={{ display: 'block', inlineSize: '100%', aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: 'var(--ag-radius-lg, 1rem)' }}>
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
        {images.length > 0 ? (
          <section aria-label="Screenshots">
            <ImageViewer.Root items={[...images]}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))', gap: '0.75rem' }}>
                {images.map((it) => (
                  <ImageViewer.Trigger key={it.id} id={it.id} className="ag-media-thumb">
                    <img src={it.src} alt={it.alt} loading="lazy" style={{ inlineSize: '100%', blockSize: 'auto' }} />
                  </ImageViewer.Trigger>
                ))}
              </div>
              <ImageViewer.Popup />
            </ImageViewer.Root>
          </section>
        ) : null}
      </main>
    </Backdrop>
  );
}
