/* GlassImageViewer — 4.x compat adapter (REQ-SURF-13, DEP-S0604) →
   ImageViewer. images {src, alt, title, description} → items keyed by index
   (alt required in 5.0: falls back to title, then ''), caption ←
   description ?? title; initialIndex → defaultValue; open/onOpenChange map
   1:1; onImageChange(index) ← onValueChange. Zoom/rotation/download toggles
   are ImageViewer toolbar parts in 5.0. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ImageViewer, type ImageViewerItem } from '../../../media/ImageViewer/ImageViewer';

export interface ImageViewerImage {
  src: string;
  alt?: string;
  title?: string;
  description?: string;
  caption?: string;
}

export interface GlassImageViewerProps {
  images?: ImageViewerImage[];
  initialIndex?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onImageChange?: (index: number) => void;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassImageViewer` compat adapter (DEP-S0604).
 * @deprecated since 4.2.0, removed in 5.0.0. Use {@link ImageViewer from aura-glass/media (items need id + required alt)}.
 */
export function GlassImageViewer(props: GlassImageViewerProps) {
  warnDeprecated('DEP-S0604');
  const { images = [], initialIndex, open, onOpenChange, onImageChange } = props;
  const items: ImageViewerItem[] = images.map((img, i) => {
    const caption = img.caption ?? img.description ?? img.title;
    return { id: `img-${i}`, src: img.src, alt: img.alt ?? img.title ?? '', ...(caption !== undefined ? { caption } : {}) };
  });
  const defaultValue = items[initialIndex ?? 0]?.id;
  return (
    <ImageViewer.Root
      items={items}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      {...(open !== undefined ? { open } : {})}
      {...(onOpenChange ? { onOpenChange } : {})}
      {...(onImageChange ? { onValueChange: (id: string) => onImageChange(items.findIndex((it) => it.id === id)) } : {})}
    >
      {items.map((it) => (
        <ImageViewer.Trigger key={it.id} id={it.id}>
          <img src={it.src} alt={it.alt} />
        </ImageViewer.Trigger>
      ))}
      <ImageViewer.Popup />
    </ImageViewer.Root>
  );
}
