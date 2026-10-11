import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'NowPlayingBar',
  owner: 'SURF',
  entry: './media',
  tier: 'T2',
  flagship: 43,
  rsc: 'client',
  parts: ['now-playing', 'now-playing-actions', 'now-playing-artwork', 'now-playing-expand', 'now-playing-next', 'now-playing-play', 'now-playing-prev', 'now-playing-progress', 'now-playing-progress-fill', 'now-playing-subtitle', 'now-playing-title'],
  states: ['playing', 'paused', 'waiting', 'ended', 'error'],
  apg: 'region',
  variants: {},
  budgetKb: 8,
  migration: [
    { from: 'LiquidGlassNowPlayingBar', props: {}, selectors: { '.glass-now-playing': '[data-ag-part="now-playing"]' }, automation: 'mostly', compat: true },
  ],
});
