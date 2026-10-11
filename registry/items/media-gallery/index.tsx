'use client';
import * as React from 'react';
import { Grid } from 'aura-glass';
import { ImageViewer } from 'aura-glass/media';

export interface MediaGalleryProps {
  items: Array<{ id: string; src: string; alt: string; caption?: string }>;
  label?: string;
}

/** media-gallery (REQ-SURF-141/-14, REQ-SURF-175): CMP Grid of triggers +
 * the shared ImageViewer popup; the viewer carries counter/keys/zoom — the
 * item is just composition. */
export function MediaGallery({ items, label = 'Gallery' }: MediaGalleryProps) {
  return (
    <ImageViewer.Root items={items}>
      <div data-ag-part="media-gallery" role="group" aria-label={label}>
        <Grid minItemWidth="10rem" gap="0.75rem">
          {items.map((it) => (
            <ImageViewer.Trigger key={it.id} id={it.id} className="ag-media-thumb">
              <img src={it.src} alt={it.alt} loading="lazy" style={{ inlineSize: '100%', borderRadius: '0.5rem' }} />
            </ImageViewer.Trigger>
          ))}
        </Grid>
      </div>
      <ImageViewer.Popup />
    </ImageViewer.Root>
  );
}
