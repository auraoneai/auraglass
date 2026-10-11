/* CMP-011: meta shape type test. defineMeta's const generic preserves the parts
   tuple, so a part outside a component's declared vocabulary is a type error. */
import { defineMeta } from '../../../src/foundation/index';
import { SlotMeta } from '../../../src/primitives/Slot.meta';

const base = {
  name: 'Slot',
  owner: 'CMP',
  entry: './primitives',
  tier: 'T0',
  rsc: 'server',
  states: [],
  variants: {},
  migration: [],
} as const;

// valid meta: defineMeta accepts it and preserves the parts tuple
export const slotMeta = defineMeta({ ...base, parts: ['root'] as const });
type _PartsIsTuple = typeof slotMeta.parts extends readonly ['root'] ? true : never;
const _ok: _PartsIsTuple = true;

// @ts-expect-error — 'bogus' is not in Slot's declared part vocabulary
export const bogusMeta: typeof SlotMeta = defineMeta({ ...base, parts: ['root', 'bogus'] as const });
