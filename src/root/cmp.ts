/* Root value exports are frozen by ROOT_EXPORTS.cmp (§4.5). A name is added here
   only once its implementation is real — seed contracts/stubs never reach the
   root surface (no-fake-completion). */
export type { ChangeDetails } from '../contracts/components';
export type { ValueChangeHandler } from '../foundation/types';

export { VisuallyHidden } from '../primitives/VisuallyHidden';
export type { VisuallyHiddenProps } from '../primitives/VisuallyHidden';

export { EmptyState, ErrorState, LoadingState } from '../components/state-view';
export type { EmptyStateProps, ErrorStateProps, LoadingStateProps } from '../components/state-view';

export { AvatarGroup } from '../components/avatar';
export type { AvatarGroupProps } from '../components/avatar';

export { Button } from '../components/button';
export type { ButtonProps } from '../components/button';

export { IconButton } from '../components/icon-button';
export type { IconButtonProps } from '../components/icon-button';

export { ButtonGroup } from '../components/button-group';
export type { ButtonGroupProps } from '../components/button-group';

export { Toolbar } from '../components/toolbar';
export type {
  ToolbarRootProps, ToolbarButtonProps, ToolbarIconButtonProps,
  ToolbarGroupProps, ToolbarSeparatorProps, ToolbarLinkProps,
} from '../components/toolbar';

export { ToggleGroup } from '../components/toggle-group';
export type { ToggleGroupRootProps, ToggleGroupItemProps } from '../components/toggle-group';

export { SegmentedControl } from '../components/segmented-control';
export type {
  SegmentedControlRootProps, SegmentedControlItemProps,
} from '../components/segmented-control';
