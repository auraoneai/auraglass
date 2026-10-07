import { CarouselRail } from 'aura-glass/media';

export function Rail() {
  return (
    // TODO(aura-glass 5): autoplay rotates only under allowContinuous — add the provider if missing
    <CarouselRail.Root label="Photos" loop autoplay={{ interval: 8000 }} slidesPerView={2}
      slides={[{ id: 's0', children: <div /> }, { id: 's1', children: <div /> }]} />
  );
}
