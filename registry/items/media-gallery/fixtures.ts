// fixtures.ts — deterministic sample data for media-gallery (no clocks, no randomness,
// no network — contract §3.3 file contract). Stories and showcases import it.
import type { MediaGalleryProps } from './index';

export const GALLERY_ITEMS: MediaGalleryProps['items'] = [
  { id: 'a', src: '/media/a.jpg', alt: 'Atrium', caption: 'Specular study 01' },
  { id: 'b', src: '/media/b.jpg', alt: 'Stair' },
  { id: 'c', src: '/media/c.jpg', alt: 'Panel' },
];
