/** PLAT-344 / REQ-PLAT-93: type-DX contract over the PACKED aura-glass .d.ts
 * (tests/types/plat/vendor/aura-glass, extracted by setup-extract.mjs; tsc -p
 * tests/types/plat). Consumes CMP and MAT types only through public entries.
 *   - material role types are exact literal unions, never `string`;
 *   - Button `variant` is exactly 'regular' | 'clear' | 'identity' | undefined,
 *     `intent` exactly Button meta.variants.intent ('neutral' | 'danger'),
 *     `prominent` boolean | undefined; no material/elevation/as key;
 *   - Surface material props use the same unions;
 *   - 4.x grammar in JSX is a type error.
 * The literal sets mirror the metas / S-01 registry; completions.test.ts
 * checks the same sets against the metas at runtime. */
import { createElement, type ComponentProps } from 'react';
import { Button, Surface } from 'aura-glass';
import type {
  Backdrop, ContentMaterial, Layer, MaterialVariant, Shape, Thickness, Tier, Transparency,
} from 'aura-glass/material';

type Assert<T extends true> = T;
type IsExact<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
/** true when T is a finite literal union (not widened to string, no `string & {}`). */
type IsLiteralUnion<T> = string extends T ? false : T extends string ? true : false;

/* material role types: exact literal unions */
export type _MV = Assert<IsExact<MaterialVariant, 'regular' | 'clear' | 'identity'>>;
export type _TH = Assert<IsExact<Thickness, 'thin' | 'regular' | 'thick'>>;
export type _LA = Assert<IsExact<Layer, 'chrome' | 'overlay' | 'transient' | 'content'>>;
export type _CM = Assert<IsExact<ContentMaterial, 'content-raised' | 'content-sunken'>>;
export type _SH = Assert<IsExact<Shape, 'fixed' | 'capsule' | 'concentric'>>;
export type _TI = Assert<IsExact<Tier, 'lightweight' | 'standard' | 'enhanced' | 'cinematic'>>;
export type _TR = Assert<IsExact<Transparency, 'glass' | 'tinted' | 'solid'>>;
export type _BD = Assert<IsExact<Backdrop, 'light' | 'dark' | 'media' | 'auto'>>;
export type _L1 = Assert<IsLiteralUnion<MaterialVariant>>;
export type _L2 = Assert<IsLiteralUnion<Thickness>>;
export type _L3 = Assert<IsLiteralUnion<Layer>>;
export type _L4 = Assert<IsLiteralUnion<ContentMaterial>>;
export type _L5 = Assert<IsLiteralUnion<Shape>>;
export type _L6 = Assert<IsLiteralUnion<Tier>>;
export type _L7 = Assert<IsLiteralUnion<Transparency>>;
export type _L8 = Assert<IsLiteralUnion<Backdrop>>;

/* Button */
type ButtonProps = ComponentProps<typeof Button>;
export type _BV = Assert<IsExact<ButtonProps['variant'], 'regular' | 'clear' | 'identity' | undefined>>;
export type _BI = Assert<IsExact<ButtonProps['intent'], 'neutral' | 'danger' | undefined>>;
export type _BP = Assert<IsExact<ButtonProps['prominent'], boolean | undefined>>;
export type _BT = Assert<IsExact<NonNullable<ButtonProps['thickness']>, Thickness>>;
export type _BNoMaterial = Assert<IsExact<'material' extends keyof ButtonProps ? true : false, false>>;
export type _BNoElevation = Assert<IsExact<'elevation' extends keyof ButtonProps ? true : false, false>>;
export type _BNoAs = Assert<IsExact<'as' extends keyof ButtonProps ? true : false, false>>;

/* Surface */
type SurfaceProps = ComponentProps<typeof Surface>;
export type _SV = Assert<IsExact<NonNullable<SurfaceProps['variant']>, MaterialVariant>>;
export type _ST = Assert<IsExact<NonNullable<SurfaceProps['thickness']>, Thickness>>;
export type _SL = Assert<IsExact<NonNullable<SurfaceProps['layer']>, Layer>>;
export type _SC = Assert<IsExact<NonNullable<SurfaceProps['content']>, ContentMaterial>>;
export type _SS = Assert<IsExact<NonNullable<SurfaceProps['shape']>, Shape>>;

/* 4.x grammar is rejected at the element call site (createElement: this file is .ts, not .tsx) */
export const ok = [
  createElement(Button, { variant: 'clear', intent: 'danger', prominent: true }, 'Ok'),
  createElement(Surface, { variant: 'regular', thickness: 'thin', layer: 'chrome' }),
];
// @ts-expect-error variant="primary" is 4.x grammar (prominent in 5.0)
export const bad1 = createElement(Button, { variant: 'primary' }, 'x');
// @ts-expect-error variant="solid" is not a material variant
export const bad2 = createElement(Button, { variant: 'solid' }, 'x');
// @ts-expect-error Surface has no solid variant
export const bad3 = createElement(Surface, { variant: 'solid' });
// @ts-expect-error info is a status-surface intent, not a control intent
export const bad4 = createElement(Button, { intent: 'info' }, 'x');
