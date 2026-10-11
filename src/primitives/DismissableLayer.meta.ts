/* DismissableLayer metadata (CMP-035): T0 primitive, client-only (LayerStack
   registration and document outside-interaction listeners). */
import { defineMeta } from '../foundation/index';

export const DismissableLayerMeta = defineMeta({
  name: 'DismissableLayer',
  owner: 'CMP',
  entry: './primitives',
  tier: 'T0',
  rsc: 'client',
  parts: ['root'],
  states: [],
  variants: {},
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 2000 / 1024,
  migration: [
    { from: 'GlassDismissableLayer', props: {}, selectors: { '.glass-dismissable-layer': '.ag-dismissable-layer' },  automation: 'full', compat: true },
  ],
});
