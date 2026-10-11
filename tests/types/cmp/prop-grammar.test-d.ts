/* CMP-065: prop grammar. Material axes on 5.0 components are limited to
   variant | thickness | prominent | refraction; intent is the only status prop;
   material | elevation | as | tone | onChange(legacy) are banned. */
import type { AssertNoLegacyOnChange } from './no-legacy-onchange.test-d';
import type { SlotProps } from '../../../src/primitives/Slot';
import type { PortalProps } from '../../../src/primitives/Portal';
import type { FocusScopeProps } from '../../../src/primitives/FocusScope';
import type { LabelProps } from '../../../src/primitives/Label';
import type { DismissableLayerProps } from '../../../src/primitives/DismissableLayer';
import type { VisuallyHiddenProps } from '../../../src/primitives/VisuallyHidden';

export const MATERIAL_AXES = ['variant', 'thickness', 'prominent', 'refraction'] as const;
export const BANNED_GRAMMAR = ['material', 'elevation', 'as', 'tone'] as const;

export type AssertPropGrammar<P> = P extends {
  material: unknown; } ? never
  : P extends { elevation: unknown } ? never
  : P extends { as: unknown } ? never
  : P extends { tone: unknown } ? never
  : P;

type OWNED = [
  SlotProps,
  PortalProps,
  FocusScopeProps,
  LabelProps,
  DismissableLayerProps,
  VisuallyHiddenProps,
];

type Asserted = { [K in keyof OWNED]: AssertNoLegacyOnChange<AssertPropGrammar<OWNED[K]>> };
declare const asserted: Asserted;
export const _grammarOk: Asserted = asserted;

// fixtures
interface BadMaterial { material: 'glass'; }
type _BadM = AssertPropGrammar<BadMaterial>;
const _bn: _BadM = null as never;
// @ts-expect-error — banned 'material' prop must not type-check
export const badMaterial: _BadM = {} as BadMaterial;

interface BadAs { as: 'a' | 'button'; }
type _BadAs = AssertPropGrammar<BadAs>;
// @ts-expect-error — banned 'as' prop must not type-check
export const badAs: _BadAs = {} as BadAs;

// positive: intent + size + material axes are fine
interface Good {
  variant?: 'solid' | 'translucent' | 'outline';
  thickness?: 'thin' | 'medium' | 'thick';
  prominent?: boolean;
  refraction?: number;
  intent?: 'default' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}
export const good: AssertPropGrammar<Good> = {} as Good;
