/* fragments/css/mat.ts — MAT owns this file on both branches (§3.4). */
import type { CssFragment } from '../../src/contracts/fragments';

export default [
  // generated @property registry + ladders/floors are 2a-T compiler outputs
  { file: 'src/material/css/generated/properties.css', layer: 'ag.material', bundle: 'material.css', order: 10 },
  { file: 'src/material/css/generated/floors.css', layer: 'ag.material', bundle: 'material.css', order: 20 },
  { file: 'src/material/css/generated/ladders.css', layer: 'ag.material', bundle: 'material.css', order: 30 },
  { file: 'src/material/css/material.css', layer: 'ag.material', bundle: 'material.css', order: 40 },
  { file: 'src/material/css/lens.css', layer: 'ag.material', bundle: 'material.css', order: 50 },
] satisfies CssFragment[];
