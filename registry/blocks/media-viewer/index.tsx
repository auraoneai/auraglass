/* media-viewer (SURF-503, REQ-SURF-171): media detail page — Backdrop photo,
 * consumer-owned media element + useMediaElement, compound MediaControls and
 * a NowPlayingBar bound to the same media handle, an ImageViewer gallery and
 * a CarouselRail over the same ITEM_IMAGES. */
'use client';
import * as React from 'react';
import { Backdrop } from 'aura-glass/backdrops';
import { CarouselRail, ImageViewer, MediaControls, NowPlayingBar, useMediaElement } from 'aura-glass/media';
import { ITEM_IMAGES, ITEM_SUBTITLE, ITEM_TITLE, TRACKS } from './fixtures';

export interface MediaViewerProps {
  src?: string;
  title?: string;
}

const SLIDES = ITEM_IMAGES.map((it) => ({
  id: it.id,
  label: it.alt,
  children: <img src={it.src} alt={it.alt} loading="lazy" style={{ inlineSize: '100%' }} className="rounded-lg" />,
}));

export function MediaViewer({ src = TRACKS.video, title = ITEM_TITLE }: MediaViewerProps) {
  const ref = React.useRef<HTMLVideoElement | null>(null);
  const media = useMediaElement(ref, { sampleTone: true });
  return (
    <Backdrop preset="photo" src={ITEM_IMAGES[0]!.src} tone="dark" data-ag-part="media-viewer">
      <main style={{ padding: '4rem 2rem', display: 'grid', gap: '1.5rem' }}>
        <h1>{title}</h1>
        <div data-ag-media-root style={{ maxInlineSize: '48rem' }}>
          <video ref={ref} src={src} crossOrigin="anonymous" playsInline aria-label={title}
            style={{ inlineSize: '100%' }} className="rounded-xl">
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
                  <img src={it.src} alt={it.alt} loading="lazy" style={{ inlineSize: '10rem' }} className="rounded-lg" />
                </ImageViewer.Trigger>
              ))}
            </div>
            <ImageViewer.Popup />
          </ImageViewer.Root>
        </section>
        <CarouselRail.Root label="Scenes" slides={SLIDES} slidesPerView={1} indicatorsAs="tabs" />
        {/* Same handle as MediaControls: play/pause and progress stay in sync. */}
        <NowPlayingBar.Root media={media} artwork={ITEM_IMAGES[0]!.src}>
          <NowPlayingBar.Artwork />
          <NowPlayingBar.Title>{title}</NowPlayingBar.Title>
          <NowPlayingBar.Subtitle>{ITEM_SUBTITLE}</NowPlayingBar.Subtitle>
          <NowPlayingBar.Actions />
          <NowPlayingBar.Progress />
        </NowPlayingBar.Root>
      </main>
    </Backdrop>
  );
}
