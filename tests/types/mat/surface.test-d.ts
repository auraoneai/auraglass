/* REQ-MAT-24 (FIN-D D.3-16, AC-FIN-55): Surface type surface. `as` and the 17
   deleted 4.x optical props are compile errors on SurfaceProps — as object
   literals, through a spread and as createElement props. The ref is the
   React 19 ref-as-prop shape (RefObject / callback). Checked by
   `tsc -p tests/types/mat/tsconfig.json` and by the root `npm run typecheck`. */
import * as React from 'react';
import { Surface } from '../../../src/material';
import type { DeletedGlassProp, SurfaceProps } from '../../../src/material';

// --- the deleted-prop list is exactly these 17 names --------------------------
// Record<> requires every union member; the excess-property check rejects extras.
export const deleted: Record<DeletedGlassProp, true> = {
  caustics: true, chromatic: true, lighting: true, ior: true, tier: true,
  depth: true, tint: true, glowIntensity: true, glowColor: true,
  optimization: true, hardwareAcceleration: true, intensity: true, blur: true,
  parallax: true, adaptive: true, magnet: true, cursorHighlight: true,
};
export const deletedNotExtra: Record<DeletedGlassProp, true> = {
  ...deleted,
  // @ts-expect-error — refraction keeps its boolean 5.0 meaning; it is not a deleted prop
  refraction: true,
};

// every deleted prop is `never` on SurfaceProps (only `undefined` is assignable)
type NeverOnSurface<K extends keyof SurfaceProps> = [Exclude<SurfaceProps[K], undefined>] extends [never] ? true : false;
type AllDeletedAreNever = { [K in DeletedGlassProp]-?: NeverOnSurface<K> }[DeletedGlassProp];
export const allNever: AllDeletedAreNever = true;
// @ts-expect-error — no deleted prop resolves to an assignable type
export const notAllNever: AllDeletedAreNever = false;

// --- valid 5.0 props still compile --------------------------------------------
export const ok: SurfaceProps = {
  layer: 'chrome', variant: 'clear', thickness: 'thin', interactive: true,
  prominent: true, refraction: true, className: 'x', style: { padding: 1 },
};

// --- `as` --------------------------------------------------------------------
// @ts-expect-error — `as` is removed; use `render`
export const asProp: SurfaceProps = { as: 'section' };
// @ts-expect-error — `as` is removed on the element form too
export const asElement = React.createElement(Surface, { as: 'section' });
export const renderOk = React.createElement(Surface, { render: React.createElement('section') });

// --- the 17 deleted optical props as object literals --------------------------
// @ts-expect-error — deleted optical prop
export const p1: SurfaceProps = { caustics: true };
// @ts-expect-error — deleted optical prop
export const p2: SurfaceProps = { chromatic: true };
// @ts-expect-error — deleted optical prop
export const p3: SurfaceProps = { lighting: 'volumetric' };
// @ts-expect-error — deleted optical prop
export const p4: SurfaceProps = { ior: 1.5 };
// @ts-expect-error — deleted optical prop
export const p5: SurfaceProps = { tier: 'high' };
// @ts-expect-error — deleted optical prop
export const p6: SurfaceProps = { depth: 2 };
// @ts-expect-error — deleted optical prop
export const p7: SurfaceProps = { tint: 'blue' };
// @ts-expect-error — deleted optical prop
export const p8: SurfaceProps = { glowIntensity: 0.4 };
// @ts-expect-error — deleted optical prop
export const p9: SurfaceProps = { glowColor: '#fff' };
// @ts-expect-error — deleted optical prop
export const p10: SurfaceProps = { optimization: 'auto' };
// @ts-expect-error — deleted optical prop
export const p11: SurfaceProps = { hardwareAcceleration: true };
// @ts-expect-error — deleted optical prop
export const p12: SurfaceProps = { intensity: 'medium' };
// @ts-expect-error — deleted optical prop
export const p13: SurfaceProps = { blur: 'md' };
// @ts-expect-error — deleted optical prop
export const p14: SurfaceProps = { parallax: true };
// @ts-expect-error — deleted optical prop
export const p15: SurfaceProps = { adaptive: true };
// @ts-expect-error — deleted optical prop
export const p16: SurfaceProps = { magnet: true };
// @ts-expect-error — deleted optical prop
export const p17: SurfaceProps = { cursorHighlight: true };

// --- through a spread of a 4.x props object -----------------------------------
const legacy = { layer: 'chrome' as const, blur: 'lg', caustics: true };
// @ts-expect-error — deleted props stay errors when spread in
export const spread: SurfaceProps = { ...legacy };
// @ts-expect-error — and on the createElement form
export const spreadElement = React.createElement(Surface, { ...legacy });

// --- React 19 ref-as-prop ----------------------------------------------------
const objectRef: React.RefObject<HTMLElement | null> = React.createRef<HTMLElement>();
export const withObjectRef: SurfaceProps = { ref: objectRef };
export const withCallbackRef: SurfaceProps = { ref: (el: HTMLElement | null) => void el };
