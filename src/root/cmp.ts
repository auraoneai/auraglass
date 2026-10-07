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
