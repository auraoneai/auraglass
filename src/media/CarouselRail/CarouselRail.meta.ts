import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'CarouselRail',
  owner: 'SURF',
  entry: './media',
  tier: 'T2',
  flagship: 44,
  rsc: 'client',
  parts: ['carousel', 'carousel-autoplay-toggle', 'carousel-indicator', 'carousel-indicators', 'carousel-next', 'carousel-prev', 'carousel-slide', 'carousel-viewport'],
  states: ['playing', 'stopped', 'offscreen'],
  variants: { indicators: ['tabs', 'buttons'] },
  apg: 'carousel',
  budgetKb: 10,  // §16 perf row: perf/media-playback + SURF-487 carousel lane; APG: tests/e2e/apg/carousel-rail.apg.spec.ts; fixtures: fragments/codemods/surf/fixtures/media-backdrops/carousel-autoplay/
  migration: [
    { from: 'GlassCarousel', props: { infinite: 'loop', slidesToShow: 'slidesPerView', autoPlay: 'autoplay' }, automation: 'partial', compat: true },
    { from: 'LiquidGlassCarouselRail', props: { infinite: 'loop', slidesToShow: 'slidesPerView' }, automation: 'partial', compat: true },
  ],
  selectors: [{ from: '.glass-carousel', to: '[aria-roledescription="carousel"]' }],
});
