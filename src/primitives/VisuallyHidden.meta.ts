/* VisuallyHidden metadata (CMP-035): T0 primitive, server-safe. Absorbs the
   focus/ScreenReader helper. */
import { defineMeta } from '../foundation/index';

export const VisuallyHiddenMeta = defineMeta({
  name: 'VisuallyHidden',
  owner: 'CMP',
  entry: './primitives',
  tier: 'T0',
  rsc: 'server',
  parts: ['root'],
  states: [],
  variants: {},
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 4000 / 1024,
  migration: [
    { from: 'ScreenReader', props: {}, selectors: { '.glass-screen-reader': '.ag-visually-hidden' },  automation: 'full', compat: false },
    { from: 'ScreenReaderText', props: {}, selectors: { '.glass-screen-reader-text': '.ag-visually-hidden' },  automation: 'full', compat: false },
  ],
});
