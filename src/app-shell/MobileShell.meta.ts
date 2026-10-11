import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'MobileShell',
  owner: 'SURF',
  entry: './app-shell',
  tier: 'T1',
  rsc: 'server',
  parts: ['edge-registrar', 'main', 'root', 'scroll-edge', 'top-bar'],
  states: [],
  apg: 'landmarks',
  variants: {},
  migration: [{ from: 'GlassMobileShell', props: {}, automation: 'mostly', compat: true }],
});
