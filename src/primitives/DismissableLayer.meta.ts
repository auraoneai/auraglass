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
  migration: [
    { from: 'GlassDismissableLayer', automation: 'full', compat: true },
  ],
});
