import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'MediaScrubber',
  owner: 'SURF',
  entry: './media',
  tier: 'T2',
  rsc: 'client',
  // No Slider 'value' output: MediaSliderParts composes Control/Track/Range/Thumb only.
  parts: ['control', 'media-scrubber', 'media-scrubber-buffered', 'media-scrubber-chapter', 'media-scrubber-tooltip', 'range', 'root', 'thumb', 'track'],
  states: ['seeking', 'hover', 'focus-visible', 'disabled'],
  material: { layer: 'chrome', refractionEligible: false },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/slider/',
  budgetKb: 6,
  variants: {},
  migration: [
    { from: 'GlassScrubber', props: {}, automation: 'mostly', compat: true },
  ],
});
