/* CMP-065: prop grammar. Material axes on 5.0 components are limited to
   variant | thickness | prominent | refraction; intent is the only status prop;
   material | elevation | as | tone | onChange(legacy) are banned. */
import type { AssertNoLegacyOnChange } from './no-legacy-onchange.test-d';
import type { SlotProps } from '../../../src/primitives/Slot';
import type { PortalProps } from '../../../src/primitives/Portal';
import type { FocusScopeProps } from '../../../src/primitives/FocusScope';
import type { LabelProps } from '../../../src/primitives/Label';
import type { DismissableLayerProps } from '../../../src/primitives/DismissableLayer';

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


/* REQ-CMP-05 §3: sweep every *Props re-exported by src/root/cmp.ts + primitives
   through AssertPropGrammar with the FULL banned list. The lint rule covers the
   glow* prefix; at the type level we pin the exact-name set. */

export const BANNED_GRAMMAR_FULL = [
  'material', 'elevation', 'as', 'tone', 'tier', 'intensity', 'depth', 'tint',
  'blur', 'caustics', 'chromatic', 'ior', 'lighting', 'animation',
  'respectMotionPreference', 'consciousness', 'predictive', 'eyeTracking',
  'adaptive', 'spatialAudio', 'trackAchievements', 'backdropBlur',
  'onChange', 'asChild',
] as const;

export type BannedPropKey = typeof BANNED_GRAMMAR_FULL[number];

/** keyof P ∩ banned keys must be never — type-level mirror of the ESLint rule. */
export type AssertNoBannedProps<P> =
  keyof P & BannedPropKey extends never ? P : never;

import type { VisuallyHiddenProps } from '../../../src/primitives/VisuallyHidden';
import type { EmptyStateProps } from '../../../src/components/state-view';
import type { ErrorStateProps } from '../../../src/components/state-view';
import type { LoadingStateProps } from '../../../src/components/state-view';
import type { AvatarGroupProps } from '../../../src/components/avatar';
import type { ButtonProps } from '../../../src/components/button';
import type { IconButtonProps } from '../../../src/components/icon-button';
import type { ButtonGroupProps } from '../../../src/components/button-group';
import type { ToggleGroupRootProps } from '../../../src/components/toggle-group';
import type { ToggleGroupItemProps } from '../../../src/components/toggle-group';
import type { SwitchProps } from '../../../src/components/switch';
import type { SliderRootProps } from '../../../src/components/slider';
import type { SliderValueProps } from '../../../src/components/slider';
import type { CheckboxProps } from '../../../src/components/checkbox';
import type { CheckboxGroupProps } from '../../../src/components/checkbox';
import type { RadioGroupProps } from '../../../src/components/radio-group';
import type { RadioItemProps } from '../../../src/components/radio-group';
import type { TextFieldProps } from '../../../src/components/text-field';
import type { SearchFieldProps } from '../../../src/components/search-field';
import type { NumberFieldProps } from '../../../src/components/number-field';
import type { TextProps } from '../../../src/components/text';
import type { HeadingProps } from '../../../src/components/heading';
import type { StackProps } from '../../../src/components/stack';
import type { GridProps } from '../../../src/components/grid';
import type { ContainerProps } from '../../../src/components/container';
import type { CardRootProps } from '../../../src/components/card';
import type { BadgeProps } from '../../../src/components/badge';
import type { SeparatorProps } from '../../../src/components/separator';
import type { KbdProps } from '../../../src/components/kbd';
import type { DescriptionListProps } from '../../../src/components/description-list';
import type { LinkProps } from '../../../src/components/link';
import type { AlertProps } from '../../../src/components/alert';
import type { SkeletonProps } from '../../../src/components/skeleton';
import type { ImageListProps } from '../../../src/components/image-list';
import type { ItemBarProps } from '../../../src/components/image-list';
import type { AvatarRootProps } from '../../../src/components/avatar';
import type { ProgressProps } from '../../../src/components/progress';
import type { ProgressRingProps } from '../../../src/components/progress';
import type { MeterProps } from '../../../src/components/meter';
import type { AccordionRootProps } from '../../../src/components/accordion';
import type { AccordionHeaderProps } from '../../../src/components/accordion';
import type { CollapsibleRootProps } from '../../../src/components/collapsible';
import type { RatingProps } from '../../../src/components/rating';
import type { InlineEditProps } from '../../../src/components/inline-edit';
import type { FileUploadProps } from '../../../src/components/file-upload';
import type { ColorPickerRootProps } from '../../../src/components/color-picker';
import type { AreaProps } from '../../../src/components/color-picker';
import type { TourProps } from '../../../src/components/tour';
import type { IconProps } from '../../../src/components/icon';

type CMP_OWNED = [
  VisuallyHiddenProps,
  EmptyStateProps,
  ErrorStateProps,
  LoadingStateProps,
  AvatarGroupProps,
  ButtonProps,
  IconButtonProps,
  ButtonGroupProps,
  ToggleGroupRootProps,
  ToggleGroupItemProps,
  SwitchProps,
  SliderRootProps,
  SliderValueProps,
  CheckboxProps,
  CheckboxGroupProps,
  RadioGroupProps,
  RadioItemProps,
  TextFieldProps,
  SearchFieldProps,
  NumberFieldProps,
  TextProps,
  HeadingProps,
  StackProps,
  GridProps,
  ContainerProps,
  CardRootProps,
  BadgeProps,
  SeparatorProps,
  KbdProps,
  DescriptionListProps,
  LinkProps,
  AlertProps,
  SkeletonProps,
  ImageListProps,
  ItemBarProps,
  AvatarRootProps,
  ProgressProps,
  ProgressRingProps,
  MeterProps,
  AccordionRootProps,
  AccordionHeaderProps,
  CollapsibleRootProps,
  RatingProps,
  InlineEditProps,
  FileUploadProps,
  ColorPickerRootProps,
  AreaProps,
  TourProps,
  IconProps,
];

type CmpAsserted = { [K in keyof CMP_OWNED]: AssertNoBannedProps<CMP_OWNED[K]> };
declare const cmpAsserted: CmpAsserted;
export const _cmpGrammarOk: CmpAsserted = cmpAsserted;
