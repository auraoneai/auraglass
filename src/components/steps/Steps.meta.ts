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
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 1500 / 1024,
  migration: [
    /* REQ-CMP-133: ambiguous root name — the codemod routes it to compat and writes a TODO (Steps vs NumberField). */
    { from: 'GlassStepper', props: {}, selectors: {}, automation: 'partial', compat: true },
  ],
});
