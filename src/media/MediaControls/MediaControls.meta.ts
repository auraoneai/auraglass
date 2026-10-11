import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'MediaControls',
  owner: 'SURF',
  entry: './media',
  tier: 'T2',
  flagship: 43,
  rsc: 'client',
  parts: ['media-captions', 'media-controls', 'media-fullscreen', 'media-more', 'media-mute', 'media-pip', 'media-play', 'media-rate', 'media-spacer', 'media-time', 'media-volume'],
  states: ['playing', 'paused', 'waiting', 'ended', 'error'],
  variants: {},
  apg: 'toolbar',
  budgetKb: 14,
  // §16 perf row: perf/media-playback; APG: tests/e2e/apg/media-controls.apg.spec.ts;
  // env baseline: env-baseline-2026-10 (SURF-495); fixtures: fragments/codemods/surf/fixtures/media-backdrops/media-controls/.
  migration: [
    { from: 'LiquidGlassMediaControls', props: { onPlayPause: 'onPlayingChange', compact: null }, automation: 'partial', compat: true },
    { from: 'GlassMediaControls', props: { onPlayPause: 'onPlayingChange' }, automation: 'partial', compat: true },
  ],
  selectors: [{ from: '.glass-media-controls', to: '[data-ag-part="media-controls"]' }],
});
