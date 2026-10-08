'use client';
import * as React from 'react';
import { ImageViewer } from 'aura-glass/media';

export interface MediaGalleryProps {
  items: Array<{ id: string; src: string; alt: string; caption?: string }>;
  label?: string;
}

/** media-gallery (REQ-SURF-141/-14): grid of triggers + the shared ImageViewer
 * popup; the viewer carries counter/keys/zoom — the item is just composition. */
export function MediaGallery({ items, label = 'Gallery' }: MediaGalleryProps) {
  return (
    <ImageViewer.Root items={items} label={label}>
      <div data-ag-part="media-gallery" role="group" aria-label={label}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(10rem,1fr))', gap: '0.75rem' }}>
        {items.map((it) => (
          <ImageViewer.Trigger key={it.id} item={it.id} style={{ padding: 0, border: 0, background: 'none', cursor: 'zoom-in' }}>
            <img src={it.src} alt={it.alt} loading="lazy" style={{ inlineSize: '100%', borderRadius: '0.5rem' }} />
          </ImageViewer.Trigger>
        ))}
      </div>
      <ImageViewer.Popup />
    </ImageViewer.Root>
  );
}
