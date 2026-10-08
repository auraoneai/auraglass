import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'MobileShell',
  owner: 'SURF',
  entry: '.',
  tier: 'T1',
  rsc: 'server',
  parts: ['mobile-shell'],
  states: [],
  variants: {},
  migration: [{ from: 'GlassMobileShell', props: {}, automation: 'mostly', compat: true }],
});
