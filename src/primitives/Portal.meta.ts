/* Portal metadata (CMP-035): T0 primitive, client-only (portal target resolves
   post-mount via the S-23 provider seam). */
import { defineMeta } from '../foundation/index';

export const PortalMeta = defineMeta({
  name: 'Portal',
  owner: 'CMP',
  entry: './primitives',
  tier: 'T0',
  rsc: 'client',
  parts: [],
  states: [],
  variants: {},
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 1500 / 1024,
  migration: [
    { from: 'GlassPortal', props: {}, selectors: { '.glass-portal': '.ag-portal' },  automation: 'full', compat: true },
  ],
});
