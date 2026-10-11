import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'MediaScrubber',
  owner: 'SURF',
  entry: './media',
  tier: 'T2',
  rsc: 'client',
  parts: ['control', 'media-scrubber', 'media-scrubber-buffered', 'media-scrubber-chapter', 'media-scrubber-tooltip', 'range', 'root', 'thumb', 'track', 'value'],
  states: ['seeking', 'hover', 'focus-visible', 'disabled'],
  material: { layer: 'chrome', refractionEligible: false },
  apg: 'slider',
  variants: {},
  migration: [
    { from: 'GlassScrubber', props: {}, automation: 'mostly', compat: true },
  ],
});
