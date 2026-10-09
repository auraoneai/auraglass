import { defineMeta } from '../../foundation/index';

export const StepsMeta = defineMeta({
  name: 'Steps',
  owner: 'CMP',
  entry: '.',
  tier: 'T2',
  rsc: 'server',
  parts: ['root', 'list', 'item', 'indicator', 'label', 'description'],
  states: ['complete', 'current', 'upcoming', 'error'],
  variants: {},
  migration: [
    {
      from: 'GlassStepper',
      automation: 'mostly',
      compat: true,
    },
  ],
});
