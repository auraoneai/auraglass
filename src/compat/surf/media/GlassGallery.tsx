'use client';
import { warnDeprecated } from '../../../internal';
import { ImageViewer, type ImageViewerItem } from '../../../media/ImageViewer/ImageViewer';

/* GlassGallery's lightbox absorbs into ImageViewer. */
export interface GlassGalleryProps {
  images?: { src: string; alt?: string }[];
  columns?: number;
}

/** @deprecated GlassGallery DEP-S0605 since 4.2.0, removed in 6.0.0. {@link ImageViewer from aura-glass/media (or the media-gallery registry item)} */
export function GlassGallery(props: GlassGalleryProps) {
  warnDeprecated('DEP-S0605';
  const items: ImageViewerItem[] = (props.images ?? []).map((img, i) => ({
    id: `img-${i}`, src: img.src, alt: img.alt ?? '',
  }));
  return (
    <ImageViewer.Root items={items}>
      <div role="list" style={{ display: 'grid', gridTemplateColumns: `repeat(${props.columns ?? 3}, 1fr)`, gap: '0.5rem' }}>
        {items.map((it) => (
          <ImageViewer.Trigger key={it.id} id={it.id}><img src={it.src} alt={it.alt} /></ImageViewer.Trigger>
        ))}
      </div>
      <ImageViewer.Popup />
    </ImageViewer.Root>
  );
}
