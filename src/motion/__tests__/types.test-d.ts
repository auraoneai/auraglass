/* MAT-235 REQ-MOT-T20: type-level contract — MotionTokenName accepts the
   contract literals and rejects unknown ones; deprecated 4.x motion props are
   rejected by the provider surface. This file is typechecked by `tsc --noEmit`; runtime assertions are none. */
import type { ComponentProps } from 'react';
import type { MotionTokenName } from '../../contracts/motion';
import { AuraGlassProvider } from '../../theme/index';
import type { MagneticBindings, MomentumBindings, DragBindings } from '../adapter';

// ---- accepts ----
const ok1: MotionTokenName = 'spring-smooth';
const ok2: MotionTokenName = 'spring-snappy';
const ok3: MotionTokenName = 'spring-fluid';
const ok4: MotionTokenName = 'duration-micro';
export const ok: MotionTokenName[] = [ok1, ok2, ok3, ok4];

// ---- rejects ----
// @ts-expect-error — 'spring-bouncy' is not a contract spring
const bad1: MotionTokenName = 'spring-bouncy';
// @ts-expect-error — 'duration-huge' is not a contract duration
const bad2: MotionTokenName = 'duration-huge';
// @ts-expect-error — AuraGlassProvider motion is 'system'|MotionPreference, never 'always-safe'
const bad3: ComponentProps<typeof AuraGlassProvider> = { motion: 'always-safe' };
export const bad: unknown[] = [bad1, bad2, bad3];

// ---- adapter binding types ----
export const types: [DragBindings?, MomentumBindings?, MagneticBindings?] = [];

/* The banned motion keys on the provider, MaterialRole, SurfaceProps and
   MotionProvider props are asserted in tests/types/mat/motion-ban.test-d.ts
   (REQ-MAT-45); component-level (Button/Dialog) rejections are CMP's
   tests/types/cmp suite. */
