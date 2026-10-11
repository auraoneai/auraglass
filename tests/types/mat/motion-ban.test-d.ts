/* tests/types/mat/motion-ban.test-d.ts — REQ-MAT-45 (MAT-45, REQ-FIN-58, D.3-27).
   No API raises motion: every banned motion key is a type error on the
   AuraGlassProvider props, MaterialRole, SurfaceProps, the MotionProvider props
   and the 5.0 createGlassTheme options. Each @ts-expect-error line below fails
   the typecheck if its object literal ever starts compiling. The `ok*`
   literals are the positive controls: they prove each target type accepts a
   valid value, so the errors come from the banned key alone.
   Checked by `tsc -p tests/types/mat/tsconfig.json` (no runtime assertions). */
import type { ComponentProps } from 'react';
import type { AuraGlassProviderProps } from '../../../src/contracts/preferences';
import type { MaterialRole } from '../../../src/contracts/material';
import type { SurfaceProps } from '../../../src/material/index';
import type { CreateGlassThemeOptions } from '../../../src/theme/createGlassTheme';
import { AuraGlassProvider } from '../../../src/theme/index';
import { MotionProvider } from '../../../src/motion/adapter/index';

type ProviderProps = ComponentProps<typeof AuraGlassProvider>;
type MotionProviderProps = ComponentProps<typeof MotionProvider>;

// ---- positive controls ----
const okContract: AuraGlassProviderProps = { children: null, motion: 'calm', allowContinuous: false };
const okProvider: ProviderProps = { children: null, motion: 'system' };
const okRole: MaterialRole = { layer: 'chrome', interactive: true };
const okSurface: SurfaceProps = { layer: 'content', className: 'x' };
const okMotionProvider: MotionProviderProps = { children: null };
const okTheme: CreateGlassThemeOptions = { mode: 'dark', density: 'compact' };
export const ok: unknown[] = [okContract, okProvider, okRole, okSurface, okMotionProvider, okTheme];

// ---- AuraGlassProviderProps (contract S-22) ----
// `preset` on the provider is the ThemePreset id (S-22), not a motion preset.
// @ts-expect-error — motion is 'system'|MotionPreference, never 'always-safe'
export const p1: AuraGlassProviderProps = { children: null, motion: 'always-safe' };
// @ts-expect-error — motionPolicy is banned
export const p2: AuraGlassProviderProps = { children: null, motionPolicy: 'expressive' };
// @ts-expect-error — respectMotionPreference is banned
export const p3: AuraGlassProviderProps = { children: null, respectMotionPreference: false };
// @ts-expect-error — forceMotion is banned
export const p4: AuraGlassProviderProps = { children: null, forceMotion: true };
// @ts-expect-error — disableReducedMotion is banned
export const p5: AuraGlassProviderProps = { children: null, disableReducedMotion: true };
// @ts-expect-error — initialMotionPolicy is banned
export const p6: AuraGlassProviderProps = { children: null, initialMotionPolicy: 'expressive' };
// @ts-expect-error — animationPreset is banned
export const p7: AuraGlassProviderProps = { children: null, animationPreset: 'bounce' };
// @ts-expect-error — disableAnimation is banned
export const p8: AuraGlassProviderProps = { children: null, disableAnimation: false };

// ---- the shipped AuraGlassProvider component props ----
// @ts-expect-error — motion 'always-safe' on the component
export const c1: ProviderProps = { children: null, motion: 'always-safe' };
// @ts-expect-error — motionPolicy on the component
export const c2: ProviderProps = { children: null, motionPolicy: 'expressive' };
// @ts-expect-error — respectMotionPreference on the component
export const c3: ProviderProps = { children: null, respectMotionPreference: false };
// @ts-expect-error — forceMotion on the component
export const c4: ProviderProps = { children: null, forceMotion: true };
// @ts-expect-error — disableReducedMotion on the component
export const c5: ProviderProps = { children: null, disableReducedMotion: true };
// @ts-expect-error — initialMotionPolicy on the component
export const c6: ProviderProps = { children: null, initialMotionPolicy: 'expressive' };
// @ts-expect-error — animationPreset on the component
export const c7: ProviderProps = { children: null, animationPreset: 'bounce' };
// @ts-expect-error — disableAnimation on the component
export const c8: ProviderProps = { children: null, disableAnimation: false };

// ---- MaterialRole (contract S-04) ----
// @ts-expect-error — no motion key on a material role
export const r1: MaterialRole = { layer: 'chrome', motion: 'always-safe' };
// @ts-expect-error — motionPolicy is banned
export const r2: MaterialRole = { layer: 'chrome', motionPolicy: 'expressive' };
// @ts-expect-error — respectMotionPreference is banned
export const r3: MaterialRole = { layer: 'chrome', respectMotionPreference: false };
// @ts-expect-error — forceMotion is banned
export const r4: MaterialRole = { layer: 'chrome', forceMotion: true };
// @ts-expect-error — disableReducedMotion is banned
export const r5: MaterialRole = { layer: 'chrome', disableReducedMotion: true };
// @ts-expect-error — initialMotionPolicy is banned
export const r6: MaterialRole = { layer: 'chrome', initialMotionPolicy: 'expressive' };
// @ts-expect-error — motion preset is banned
export const r7: MaterialRole = { layer: 'chrome', preset: 'bounce' };
// @ts-expect-error — animationPreset is banned
export const r8: MaterialRole = { layer: 'chrome', animationPreset: 'bounce' };
// @ts-expect-error — disableAnimation is banned
export const r9: MaterialRole = { layer: 'chrome', disableAnimation: false };

// ---- SurfaceProps (aura-glass/material) ----
// @ts-expect-error — motionPolicy is banned
export const s1: SurfaceProps = { layer: 'content', motionPolicy: 'expressive' };
// @ts-expect-error — the 'always-safe' policy value has no key to live on
export const s2: SurfaceProps = { layer: 'content', motion: 'always-safe' };
// @ts-expect-error — respectMotionPreference is banned
export const s3: SurfaceProps = { layer: 'content', respectMotionPreference: false };
// @ts-expect-error — forceMotion is banned
export const s4: SurfaceProps = { layer: 'content', forceMotion: true };
// @ts-expect-error — disableReducedMotion is banned
export const s5: SurfaceProps = { layer: 'content', disableReducedMotion: true };
// @ts-expect-error — initialMotionPolicy is banned
export const s6: SurfaceProps = { layer: 'content', initialMotionPolicy: 'expressive' };
// @ts-expect-error — motion preset is banned
export const s7: SurfaceProps = { layer: 'content', preset: 'bounce' };
// @ts-expect-error — animationPreset is banned
export const s8: SurfaceProps = { layer: 'content', animationPreset: 'bounce' };
// @ts-expect-error — disableAnimation is banned
export const s9: SurfaceProps = { layer: 'content', disableAnimation: false };

// ---- MotionProvider props (aura-glass/motion) ----
// @ts-expect-error — motion 'always-safe' on MotionProvider
export const m1: MotionProviderProps = { children: null, motion: 'always-safe' };
// @ts-expect-error — motionPolicy on MotionProvider
export const m2: MotionProviderProps = { children: null, motionPolicy: 'expressive' };
// @ts-expect-error — respectMotionPreference on MotionProvider
export const m3: MotionProviderProps = { children: null, respectMotionPreference: false };
// @ts-expect-error — forceMotion on MotionProvider
export const m4: MotionProviderProps = { children: null, forceMotion: true };
// @ts-expect-error — disableReducedMotion on MotionProvider
export const m5: MotionProviderProps = { children: null, disableReducedMotion: true };
// @ts-expect-error — initialMotionPolicy on MotionProvider
export const m6: MotionProviderProps = { children: null, initialMotionPolicy: 'expressive' };
// @ts-expect-error — motion preset on MotionProvider
export const m7: MotionProviderProps = { children: null, preset: 'bounce' };
// @ts-expect-error — animationPreset on MotionProvider
export const m8: MotionProviderProps = { children: null, animationPreset: 'bounce' };
// @ts-expect-error — disableAnimation on MotionProvider
export const m9: MotionProviderProps = { children: null, disableAnimation: false };

// ---- 5.0 createGlassTheme options (motionPolicy is compat-only, DEP-M0902) ----
// @ts-expect-error — motionPolicy left the 5.0 theme API
export const t1: CreateGlassThemeOptions = { mode: 'dark', motionPolicy: 'expressive' };
