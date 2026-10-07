/* fragments/css/cmp.ts — CMP owns this file on both branches (§3.4). */
import type { CssFragment } from '../../src/contracts/fragments';
export default [
  { file: 'src/primitives/VisuallyHidden.css', layer: 'ag.components', bundle: 'styles.css' },
  { file: 'src/components/state-view/StateView.css', layer: 'ag.components', bundle: 'styles.css' },
  { file: 'src/components/steps/Steps.css', layer: 'ag.components', bundle: 'styles.css' },
  { file: 'src/components/avatar/AvatarGroup.css', layer: 'ag.components', bundle: 'styles.css' },
  { file: 'src/components/chip/Chip.css', layer: 'ag.components', bundle: 'styles.css' },
  { file: 'src/components/button/Button.css', layer: 'ag.components', bundle: 'styles.css' },
  { file: 'src/components/icon-button/IconButton.css', layer: 'ag.components', bundle: 'styles.css' },
  { file: 'src/components/toolbar/Toolbar.css', layer: 'ag.components', bundle: 'styles.css' },
  { file: 'src/components/button-group/ButtonGroup.css', layer: 'ag.components', bundle: 'styles.css' },
  { file: 'src/components/toggle-group/ToggleGroup.css', layer: 'ag.components', bundle: 'styles.css' },
  { file: 'src/components/segmented-control/SegmentedControl.css', layer: 'ag.components', bundle: 'styles.css' },
] satisfies CssFragment[];
