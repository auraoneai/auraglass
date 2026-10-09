'use client';
import { warnDeprecated } from '../../../internal';
import { ImageViewer, type ImageViewerItem } from '../../../media/ImageViewer/ImageViewer';

export interface GlassImageViewerProps {
  images?: { src: string; alt?: string; caption?: string }[];
  initialIndex?: number;
  open?: boolean;
  onOpenChange?: ((o: boolean) => void) | undefined;
}

/** @deprecated GlassImageViewer DEP-S0604 since 4.2.0, removed in 6.0.0. {@link ImageViewer from aura-glass/media (items need id + required alt)} */
export function GlassImageViewer(props: GlassImageViewerProps) {
  warnDeprecated('DEP-S0604';
  const { images = [], initialIndex, open, onOpenChange } = props;
  const items: ImageViewerItem[] = images.map((img, i) => ({
    id: `img-${i}`, src: img.src, alt: img.alt ?? '', ...(img.caption !== undefined ? { caption: img.caption } : {}),
  }));
  const defaultValue = items[initialIndex ?? 0]?.id;
  return (
    <ImageViewer.Root items={items} defaultValue={defaultValue} open={open} onOpenChange={onOpenChange}>
      {items.map((it) => (
        <ImageViewer.Trigger key={it.id} id={it.id}>
          <img src={it.src} alt={it.alt} />
        </ImageViewer.Trigger>
      ))}
      <ImageViewer.Popup />
    </ImageViewer.Root>
  );
}
