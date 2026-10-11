/* fragments/css/mat.ts — MAT owns this file on both branches (§3.4). */
import type { CssFragment } from '../../src/contracts/fragments';

export default [
  // generated @property registry + ladders/floors are 2a-T compiler outputs
  { file: 'src/material/css/generated/properties.css', layer: 'ag.material', bundle: 'material.css', order: 10 },
  // REQ-MAT-28: the hand-authored @property registry
  { file: 'src/material/css/properties.css', layer: 'ag.material', bundle: 'material.css', order: 15 },
  { file: 'src/material/css/generated/floors.css', layer: 'ag.material', bundle: 'material.css', order: 20 },
  { file: 'src/material/css/generated/ladders.css', layer: 'ag.material', bundle: 'material.css', order: 30 },
  { file: 'src/material/css/material.css', layer: 'ag.material', bundle: 'material.css', order: 40 },
  { file: 'src/material/css/lens.css', layer: 'ag.material', bundle: 'material.css', order: 50 },
  // --- lane 2e-B begin ---
  // REQ-FIN-14: motion CSS ships inside the ag.material layer (was ag.components
  // under MAT-363); files carry their own LAYER_ORDER_STATEMENT + single layer
  // block, so the fragment row layer and the file agree.
  { file: 'src/motion/css/motion.css', layer: 'ag.material', bundle: 'styles.css', order: 30 },
  { file: 'src/motion/css/loading.css', layer: 'ag.material', bundle: 'styles.css', order: 31 },
  { file: 'src/motion/css/view-transition.css', layer: 'ag.material', bundle: 'styles.css', order: 32 },
  { file: 'src/motion/css/motion-modes.css', layer: 'ag.a11y', bundle: 'styles.css', order: 60 },
  // --- lane 2e-B end ---
  // --- REQ-FIN-05 a11y rungs: every src/a11y/css file ships in styles.css ---
  { file: 'src/a11y/css/rungs.css', layer: 'ag.a11y', bundle: 'styles.css', order: 10 },
  { file: 'src/a11y/css/focus.css', layer: 'ag.a11y', bundle: 'styles.css', order: 20 },
  { file: 'src/a11y/css/targets.css', layer: 'ag.a11y', bundle: 'styles.css', order: 30 },
  { file: 'src/a11y/css/scroll-padding.css', layer: 'ag.a11y', bundle: 'styles.css', order: 40 },
  { file: 'src/a11y/css/layers.css', layer: 'ag.a11y', bundle: 'styles.css', order: 50 },
  // REQ-MAT-60 transfer: preferences panel sheet (ag.components, logical props only)
  { file: 'src/theme/preferences-panel/GlassPreferencesPanel.css', layer: 'ag.components', bundle: 'styles.css', order: 70 },
] satisfies CssFragment[];
