/* FocusScope metadata (CMP-035): T0 primitive, client-only (document focus events). */
import { defineMeta } from '../foundation/index';

export const FocusScopeMeta = defineMeta({
  name: 'FocusScope',
  owner: 'CMP',
  entry: './primitives',
  tier: 'T0',
  rsc: 'client',
  parts: ['root'],
  states: [],
  variants: {},
  material: { layer: 'content' },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
  budgetKb: 2000 / 1024,
  migration: [
    { from: 'GlassFocusScope', props: {}, selectors: { '.glass-focus-scope': '.ag-focus-scope' },  automation: 'full', compat: true },
    { from: 'FocusTrap', props: {}, selectors: { '.glass-focus-trap': '.ag-focus-scope' },  automation: 'partial', compat: false },
    { from: 'RovingFocusGroup', props: {}, selectors: { '.glass-roving-focus-group': '.ag-focus-scope' },  automation: 'manual', compat: false },
  ],
});
