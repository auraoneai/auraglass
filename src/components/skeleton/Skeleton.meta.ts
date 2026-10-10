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
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 3,
  migration: [{ from: 'GlassSkeleton', props: {}, selectors: { '.glass-skeleton': '.ag-skeleton' },  automation: 'full', compat: true }, { from: 'GlassLoadingSkeleton', props: {}, selectors: { '.glass-loading-skeleton': '.ag-skeleton' },  automation: 'full', compat: true }],
});
