import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'MediaControls',
  owner: 'SURF',
  entry: './media',
  tier: 'T2',
  flagship: 43,
  rsc: 'client',
  // The media sliders compose Control/Track/Range/Thumb without a Slider 'value' output.
  // 'media-more' is omitted: it renders only in the <480 px compact row (ResizeObserver-driven),
  // which no jsdom-rendered story reaches (S-31: meta.parts equals the rendered story parts).
  parts: ['control', 'hit-area', 'icon', 'label', 'media-captions', 'media-controls', 'media-fullscreen', 'media-mute', 'media-pip', 'media-play', 'media-rate', 'media-scrubber', 'media-spacer', 'media-time', 'media-volume', 'range', 'root', 'thumb', 'track'],
  states: ['playing', 'paused', 'waiting', 'ended', 'error'],
  material: { layer: 'chrome', refractionEligible: false },
  variants: {},
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/',
  budgetKb: 18,
  // §16 perf row: perf/media-playback; APG: tests/e2e/apg/media-controls.apg.spec.ts;
  // env baseline: env-baseline-2026-10 (SURF-495); fixtures: fragments/codemods/surf/fixtures/media-backdrops/media-controls/.
  migration: [
    { from: 'LiquidGlassMediaControls', props: { onPlayPause: 'onPlayingChange', compact: null }, selectors: { '.glass-media-controls': '[data-ag-part="media-controls"]' }, automation: 'partial', compat: true },
    { from: 'GlassMediaControls', props: { onPlayPause: 'onPlayingChange' }, selectors: { '.glass-media-controls': '[data-ag-part="media-controls"]' }, automation: 'partial', compat: true },
  ],
});
