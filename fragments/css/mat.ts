/* fragments/css/mat.ts — MAT owns this file on both branches (§3.4). */
import type { CssFragment } from '../../src/contracts/fragments';
export default [
  // --- lane 2e-B begin ---
  // MAT-363 (REQ-MAT-19): MAT motion CSS lives in the ag.material layer and ships
  // in the material.css subpath bundle; motion-modes.css is the reduced-*/forced-
  // colours rung sheet and belongs to ag.a11y. Sources are lane 2c-V's files —
  // rows are inert until they land (frozen interface, §4.10).
  { file: 'src/motion/css/motion.css', layer: 'ag.material', bundle: 'material.css', order: 10 },
  { file: 'src/motion/css/loading.css', layer: 'ag.material', bundle: 'material.css', order: 11 },
  { file: 'src/motion/css/view-transition.css', layer: 'ag.material', bundle: 'material.css', order: 12 },
  { file: 'src/motion/css/motion-modes.css', layer: 'ag.a11y', bundle: 'material.css', order: 90 },
  // --- lane 2e-B end ---
] satisfies CssFragment[];
