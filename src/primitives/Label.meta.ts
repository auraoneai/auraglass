/* Label metadata (CMP-035): T0 primitive, server-safe. */
import { defineMeta } from '../foundation/index';

export const LabelMeta = defineMeta({
  name: 'Label',
  owner: 'CMP',
  entry: './primitives',
  tier: 'T0',
  rsc: 'server',
  parts: ['label', 'root'],
  states: [],
  variants: {},
  migration: [
    { from: 'GlassLabel', automation: 'full', compat: true },
    { from: 'GlassLabelPrimitive', automation: 'full', compat: true },
    { from: 'LabelRoot', automation: 'full', compat: true },
  ],
});
