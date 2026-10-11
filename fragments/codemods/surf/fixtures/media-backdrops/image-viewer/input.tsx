// @ts-nocheck
import { GlassImageViewer } from 'aura-glass';

export function Gallery() {
  return <GlassImageViewer images={[{ src: '/a.jpg' }, { src: '/b.jpg', alt: 'b' }]} initialIndex={1} />;
}
