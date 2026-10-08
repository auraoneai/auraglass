/* fragments/css/mat.ts — MAT owns this file on both branches (§3.4). */
import type { CssFragment } from '../../src/contracts/fragments';

export default [
  // generated @property registry + ladders/floors are 2a-T compiler outputs
  { file: 'src/material/css/generated/properties.css', layer: 'ag.material', bundle: 'material.css', order: 10 },
  { file: 'src/material/css/generated/floors.css', layer: 'ag.material', bundle: 'material.css', order: 20 },
  { file: 'src/material/css/generated/ladders.css', layer: 'ag.material', bundle: 'material.css', order: 30 },
  { file: 'src/material/css/material.css', layer: 'ag.material', bundle: 'material.css', order: 40 },
  { file: 'src/material/css/lens.css', layer: 'ag.material', bundle: 'material.css', order: 50 },
  { file: 'src/motion/css/motion.css', layer: 'ag.material', bundle: 'styles.css', order: 30 },
  { file: 'src/motion/css/loading.css', layer: 'ag.material', bundle: 'styles.css', order: 31 },
  { file: 'src/motion/css/view-transition.css', layer: 'ag.material', bundle: 'styles.css', order: 32 },
  { file: 'src/motion/css/motion-modes.css', layer: 'ag.a11y', bundle: 'styles.css', order: 60 },
] satisfies CssFragment[];
