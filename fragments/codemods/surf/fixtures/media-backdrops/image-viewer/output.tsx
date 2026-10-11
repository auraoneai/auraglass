import { ImageViewer } from 'aura-glass/media';

export function Gallery() {
  return (
    <ImageViewer.Root
      items={[
        // TODO(aura-glass 5): ImageViewer items require alt text
        { id: 'img-0', src: '/a.jpg', alt: '' },
        { id: 'img-1', src: '/b.jpg', alt: 'b' },
      ]}
      defaultValue="img-1"
    >
      {/* compose Trigger + Popup */}
    </ImageViewer.Root>
  );
}
