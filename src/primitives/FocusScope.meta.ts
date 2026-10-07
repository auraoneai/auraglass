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
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
  migration: [
    { from: 'GlassFocusScope', automation: 'full', compat: true },
    { from: 'FocusTrap', automation: 'partial', compat: false },
    { from: 'RovingFocusGroup', automation: 'manual', compat: false },
  ],
});
