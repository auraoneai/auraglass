import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'NowPlayingBar',
  owner: 'SURF',
  entry: './media',
  tier: 'T2',
  flagship: true,
  rsc: 'client',
  parts: ['now-playing', 'artwork', 'title', 'subtitle', 'progress', 'actions', 'expand'],
  states: ['playing', 'paused', 'waiting', 'ended', 'error'],
  variants: {},
  budgetKb: 8,
  migration: [
    { from: 'LiquidGlassNowPlayingBar', props: {}, automation: 'mostly', compat: true },
  ],
  selectors: [{ from: '.glass-now-playing', to: '[data-ag-part="now-playing"]' }],
});
