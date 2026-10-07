/* MAT-235 REQ-MOT-T20: type-level contract — MotionTokenName accepts the
   contract literals and rejects unknown ones; deprecated 4.x motion props are
   rejected by the provider surface. Component-level rejections on CMP-owned
   seeds (Button/Dialog) land when CMP replaces the seeds (Report: DOUBLE-PASS).
   This file is typechecked by `tsc --noEmit`; runtime assertions are none. */
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

/* Pending CMP (DOUBLE-PASS): once real components replace the S-30 seeds these
   must all be type errors — add them verbatim then:
     <Button respectMotionPreference={false} />
     <Button motionPolicy='always-safe' />
     <Dialog animationPreset='fadeIn' />
   Seed props are Record<string, unknown>, so the rejections cannot fire yet. */
