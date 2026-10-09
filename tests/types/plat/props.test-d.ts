/** REQ-PLAT-93 props grammar against the packed 5.0 d.ts (see pending.txt). */
import type { ComponentProps } from 'react';
import { GlassButton, GlassSurface, GlassDialog } from 'aura-glass';

type ButtonProps = ComponentProps<typeof GlassButton>;
type SurfaceProps = ComponentProps<typeof GlassSurface>;
type DialogProps = ComponentProps<typeof GlassDialog>;

/* variant is exactly 'regular' | 'clear' | 'identity' | undefined */
const _v: ButtonProps['variant'] = 'regular';
const _v2: ButtonProps['variant'] = 'clear';
// @ts-expect-error primary/solid are 4.x grammar
const _vBad: ButtonProps['variant'] = 'primary';
// @ts-expect-error
const _vBad2: SurfaceProps['variant'] = 'solid';
/* intent equals Button meta.variants.intent set */
const _i: ButtonProps['intent'] = 'primary';
const _i2: ButtonProps['intent'] = 'ghost';
// @ts-expect-error
const _iBad: ButtonProps['intent'] = 'solid';
/* prominent is boolean | undefined */
const _p: ButtonProps['prominent'] = true;
const _p2: ButtonProps['prominent'] = undefined;
// @ts-expect-error
const _pBad: ButtonProps['prominent'] = 'yes';
/* 4.x prop names must not exist */
// @ts-expect-error no material prop in 5.0
const _m: ButtonProps['material'] = 'glass';
// @ts-expect-error no elevation prop
const _e: ButtonProps['elevation'] = 2;
// @ts-expect-error no polymorphic as
const _a: ButtonProps['as'] = 'div';
export {};
