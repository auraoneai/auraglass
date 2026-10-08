import { ImageViewer } from 'aura-glass/media';
export const g = (
    <ImageViewer.Root
      items={[
        // TODO(aura-glass 5): ImageViewer items require alt text
        { id: 'img-0', src:'/a.jpg', alt: '' },
      ]}
      defaultValue="img-0"
    >
      {/* compose Trigger + Popup */}
    </ImageViewer.Root>
  );
