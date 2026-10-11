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
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 4,
  migration: [
    { from: 'GlassLabel', props: {}, selectors: { '.glass-label': '.ag-label' },  automation: 'full', compat: true },
    { from: 'GlassLabelPrimitive', props: {}, selectors: { '.glass-label-primitive': '.ag-label' },  automation: 'full', compat: true },
    { from: 'LabelRoot', props: {}, selectors: { '.glass-label-root': '.ag-label' },  automation: 'full', compat: false },
  ],
});
