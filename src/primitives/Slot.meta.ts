/* Slot metadata (CMP-035): T0 primitive, server-safe (no hooks). */
import { defineMeta } from '../foundation/index';

export const SlotMeta = defineMeta({
  name: 'Slot',
  owner: 'CMP',
  entry: './primitives',
  tier: 'T0',
  rsc: 'server',
  parts: ['root'],
  states: [],
  variants: {},
  migration: [
    { from: 'GlassSlot', automation: 'full', compat: true },
  ],
});
