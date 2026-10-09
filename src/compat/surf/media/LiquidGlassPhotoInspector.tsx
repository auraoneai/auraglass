'use client';
import { warnDeprecated } from '../../../internal';
import { ImageViewer, type ImageViewerItem } from '../../../media/ImageViewer/ImageViewer';

export interface LiquidGlassPhotoInspectorProps {
  photo?: { src: string; alt?: string; caption?: string };
  open?: boolean;
  onClose?: (() => void) | undefined;
}

/** @deprecated LiquidGlassPhotoInspector DEP-S0603 since 4.2.0, removed in 6.0.0. {@link ImageViewer + Inspector from aura-glass/media} */
export function LiquidGlassPhotoInspector(props: LiquidGlassPhotoInspectorProps) {
  warnDeprecated('DEP-S0603');
  const p = props.photo;
  const items: ImageViewerItem[] = p ? [{ id: 'img-0', src: p.src, alt: p.alt ?? '', ...(p.caption !== undefined ? { caption: p.caption } : {}) }] : [];
  return (
    <ImageViewer.Root items={items} open={props.open} onOpenChange={(o) => { if (!o) props.onClose?.(); }}>
      <ImageViewer.Popup>
        <ImageViewer.Toolbar />
        <ImageViewer.Caption />
        <ImageViewer.Inspector />
        <ImageViewer.Counter />
        <ImageViewer.Close />
      </ImageViewer.Popup>
    </ImageViewer.Root>
  );
}
