import { CarouselRail } from 'aura-glass/media';

export default function CarouselRailMinimal() {
  return (
    <CarouselRail.Root
      label="Featured places"
      slides={[
        { id: 'a', label: 'Glacier', children: <img src="https://picsum.photos/seed/glacier/400/240" alt="Glacier" /> },
        { id: 'b', label: 'Harbour', children: <img src="https://picsum.photos/seed/harbour/400/240" alt="Harbour" /> },
        { id: 'c', label: 'Desert', children: <img src="https://picsum.photos/seed/desert/400/240" alt="Desert" /> },
      ]}
    />
  );
}
