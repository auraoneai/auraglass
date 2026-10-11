/* src/motion/index.ts — internal MotionRuntime surface (S-13). Not a public
   subpath; the frozen public entry is src/motion/public.ts (./motion).
   Exports required by the contract: subscribeFrame, observeOffscreen,
   startMorph, MotionCapabilityContext — plus lane-internal helpers
   (tween/onMotionChange/announceFinal, pointer light, morph names). */
export {
  subscribeFrame,
  observeOffscreen,
  tween,
  onMotionChange,
  announceFinal,
  resolvedMotion,
} from './ticker';
export type { FrameCallback, ResolvedMotion, TweenOptions, TweenHandle } from './ticker';
export { installPointerLight, pointerLightActive } from './pointerLight';
export type { PointerLightPrefs, PointerLightWindow } from './pointerLight';
export { startMorph, useMorphName, reactViewTransition } from './viewTransition';
export { MotionCapabilityContext } from './capability';
export type { MotionCapability, DragBindings, MotionRuntime, MotionPreference } from '../contracts/motion';
