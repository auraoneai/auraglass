/* CMP-013: onChange is a banned prop on every 5.0 component (S-30). The helper
   AssertNoLegacyOnChange<P> resolves to never when P['onChange'] exists and is
   not a React.ChangeEventHandler<HTMLInputElement|HTMLTextAreaElement> (native
   inputs keep their DOM onChange). OWNED_PROP_TYPES is the per-lane tuple —
   lanes 3b/3c/3d append their component prop types. */
import type * as React from 'react';
import type { SlotProps } from '../../../src/primitives/Slot';
import type { PortalProps } from '../../../src/primitives/Portal';
import type { FocusScopeProps } from '../../../src/primitives/FocusScope';
import type { LabelProps } from '../../../src/primitives/Label';
import type { DismissableLayerProps } from '../../../src/primitives/DismissableLayer';
import type { VisuallyHiddenProps } from '../../../src/primitives/VisuallyHidden';

export type AssertNoLegacyOnChange<P> = P extends { onChange: infer H }
  ? H extends React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    ? P
    : never
  : P;

/** Prop types owned by lane 3a — later lanes append theirs. */
export type OWNED_PROP_TYPES = [
  SlotProps,
  PortalProps,
  FocusScopeProps,
  LabelProps,
  DismissableLayerProps,
  VisuallyHiddenProps,
];

type Asserted = { [K in keyof OWNED_PROP_TYPES]: AssertNoLegacyOnChange<OWNED_PROP_TYPES[K]> };
declare const asserted: Asserted;
export const _ownedOk: Asserted = asserted;

// fixture: a legacy onChange (v: string) => void resolves to never
interface LegacyOnChangeProps { value: string; onChange: (value: string) => void }
type Bad = AssertNoLegacyOnChange<LegacyOnChangeProps>;
const _neverCheck: Bad = null as never;

// @ts-expect-error — a banned onChange must not resolve to the prop type
export const badFixture: Bad = {} as LegacyOnChangeProps;

// positive: native input onChange stays allowed
interface NativeProps { onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> }
export const okFixture: AssertNoLegacyOnChange<NativeProps> = {} as NativeProps;
