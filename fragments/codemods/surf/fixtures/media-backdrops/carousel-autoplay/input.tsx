// @ts-nocheck
import { GlassCarousel } from 'aura-glass';

export function Rail() {
  return <GlassCarousel label="Photos" infinite autoPlay autoPlayInterval={8000} slidesToShow={2}><div /><div /></GlassCarousel>;
}
