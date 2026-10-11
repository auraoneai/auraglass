/* AuraGlass 5.0 contract-v1.2. CONTRACT-owned. Values: archived MOT §4.2 (decided). */
export type MotionPreference = 'full' | 'calm' | 'none';
export type DurationName = 'instant' | 'micro' | 'small' | 'medium' | 'large';
export type EaseName = 'standard' | 'emphasized' | 'emphasized-decelerate' | 'accelerate';
export type SpringName = 'snappy' | 'smooth' | 'fluid';
export type MotionTokenName = `duration-${DurationName}` | `spring-${SpringName}`;

export const DURATIONS_MS: Record<DurationName, { enter: number; exit: number }> = {
  instant: { enter: 90, exit: 60 }, micro: { enter: 120, exit: 80 }, small: { enter: 200, exit: 140 },
  medium: { enter: 320, exit: 220 }, large: { enter: 450, exit: 320 },
};
export const AMBIENT_DURATION_MS = 40000;        // valid only under [data-ag-continuous="on"]
export const EASES: Record<EaseName, readonly [number, number, number, number]> = {
  standard: [0.2, 0, 0, 1], emphasized: [0.2, 0, 0, 1],
  'emphasized-decelerate': [0.05, 0.7, 0.1, 1], accelerate: [0.3, 0, 1, 1],
};
export const SPRINGS: Record<SpringName, { zeta: number; responseMs: number }> = {
  snappy: { zeta: 1.0, responseMs: 200 }, smooth: { zeta: 0.9, responseMs: 350 }, fluid: { zeta: 0.82, responseMs: 450 },
};
export const MOTION_CSS_VARS = [
  ...(['instant', 'micro', 'small', 'medium', 'large'] as const).flatMap((d) => [`--ag-duration-${d}`, `--ag-duration-${d}-exit`]),
  '--ag-duration-ambient',
  ...(['standard', 'emphasized', 'emphasized-decelerate', 'accelerate'] as const).map((e) => `--ag-ease-${e}`),
  ...(['snappy', 'smooth', 'fluid'] as const).flatMap((s) => [`--ag-spring-${s}`, `--ag-spring-${s}-duration`]),
] as const;
/** Properties components may animate (lint auraglass/motion-*): */
export const ANIMATABLE = ['transform', 'opacity', 'translate', 'scale', '--ag-specular', '--_ag-optics', '--_ag-press', '--_ag-refraction-scale'] as const;

/** S-13 runtime, implemented by MAT at src/motion/index.ts (internal entry, not a public subpath). */
export type FrameCallback = (dtMs: number, nowMs: number) => void;           // dt capped at 50 ms
export interface MotionRuntime {
  subscribeFrame(cb: FrameCallback, opts?: { element?: Element }): () => void; // one shared rAF; pauses hidden/offscreen
  observeOffscreen(el: Element): () => void;                                   // sole owner of data-ag-offscreen
  startMorph(update: () => void | Promise<void>, opts?: { surfaces?: Element[] }): Promise<void>; // View Transition + FLIP fallback
}
export interface DragBindings { onPointerDown: (e: PointerEvent) => void; style?: Record<string, string> }
export interface MotionCapability {                                             // provided only by aura-glass/motion's MotionProvider
  dragDetents?(opts: { detents: number[]; axis: 'x' | 'y'; onSettle(i: number): void }): DragBindings;
  momentum?(opts: { axis: 'x' | 'y'; bounds: [number, number] }): DragBindings;
}
