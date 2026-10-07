import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Skeleton',
  owner: 'CMP',
  entry: '.',
  tier: 'T2',
  rsc: 'server',
  parts: ['root','line'],
  states: [],
  variants: { shape: ['text','rect','circle'] },
  migration: [{ from: 'GlassSkeleton', automation: 'full', compat: true }, { from: 'GlassLoadingSkeleton', automation: 'full', compat: true }],
});
