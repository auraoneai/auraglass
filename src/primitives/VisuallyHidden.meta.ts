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
  migration: [
    { from: 'ScreenReader', automation: 'full', compat: false },
    { from: 'ScreenReaderText', automation: 'full', compat: false },
  ],
});
