import { ImageViewer } from 'aura-glass/media';

const ITEMS = [
  { id: 'a', src: 'https://picsum.photos/seed/glacier/1200/800', alt: 'Glacier' },
  { id: 'b', src: 'https://picsum.photos/seed/harbour/1200/800', alt: 'Harbour' },
];

export default function ImageViewerMinimal() {
  return (
    <ImageViewer.Root items={ITEMS}>
      {ITEMS.map((it) => (
        <ImageViewer.Trigger key={it.id} id={it.id}>
          <img src={it.src} alt={it.alt} width={140} />
        </ImageViewer.Trigger>
      ))}
      <ImageViewer.Popup />
    </ImageViewer.Root>
  );
}
