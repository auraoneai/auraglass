import { defineMeta } from '../foundation/index';

export const IconMeta = defineMeta({
  name: 'Icon',
  owner: 'CMP',
  entry: './icons',
  tier: 'T0',
  rsc: 'server',
  parts: ['root'],
  states: [],
  variants: {},
  migration: [
    { from: 'GlassIcon', props: { name: 'name' }, automation: 'full', compat: true },
  ],
});
