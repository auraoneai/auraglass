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
export { Switch } from '../components/switch';
export type { SwitchProps } from '../components/switch';

export { Slider } from '../components/slider';
export type { SliderRootProps, SliderValueProps, SliderMark } from '../components/slider';

export { Checkbox, CheckboxGroup } from '../components/checkbox';
export type { CheckboxProps, CheckboxGroupProps } from '../components/checkbox';

export { RadioGroup } from '../components/radio-group';
export type { RadioGroupProps, RadioItemProps } from '../components/radio-group';

export { Field, Fieldset } from '../components/field';
export type {
  FieldRootProps, FieldLabelProps, FieldControlProps, FieldDescriptionProps, FieldErrorProps,
  FieldsetRootProps,
} from '../components/field';

export { TextField } from '../components/text-field';
export type { TextFieldProps } from '../components/text-field';

export { SearchField } from '../components/search-field';
export type { SearchFieldProps } from '../components/search-field';

export { NumberField } from '../components/number-field';
export type { NumberFieldProps } from '../components/number-field';

export { Select } from '../components/select';
export type {
  SelectRootProps, SelectTriggerProps, SelectContentProps, SelectItemProps,
} from '../components/select';

export { Combobox } from '../components/combobox';
export type {
  ComboboxRootProps, ComboboxInputProps, ComboboxContentProps, ComboboxItemProps,
  ComboboxEmptyProps, ComboboxChipsProps, ComboboxChipProps, ComboboxMode,
  ComboboxCreatable, ComboboxLoadContext,
} from '../components/combobox';

// CMP-239/243/225/228 (REQ-CMP-23, REQ-CMP-02): overlay lane root exports.
// Popover/Tooltip/Menu/ContextMenu/Menubar/Toast remain contract-seed exports
// until lanes 3f/3i replace internals — the names are frozen by S-30, so
// exporting them now closes the root-export rows without touching their seams.
export { Dialog } from '../components/dialog';
export type {
  DialogRootProps, DialogTriggerProps, DialogCloseProps, DialogPortalProps,
  DialogBackdropProps, DialogPopupProps, DialogTitleProps, DialogDescriptionProps,
  DialogContentProps, DialogLayoutProps, DialogSize, DialogPlacement, DialogVariant,
} from '../components/dialog';

export { AlertDialog } from '../components/alert-dialog';
export type {
  AlertDialogRootProps, AlertDialogTriggerProps, AlertDialogContentProps,
  AlertDialogPopupProps, AlertDialogButtonishProps, AlertDialogActionProps,
  AlertDialogLayoutProps,
} from '../components/alert-dialog';

export { Sheet } from '../components/sheet';
export type {
  SheetRootProps, SheetTriggerProps, SheetPopupProps, SheetContentProps,
  SheetButtonishProps, SheetActionProps, SheetLayoutProps, SheetSide, SheetPreset,
} from '../components/sheet';
export type { SheetDetent } from '../components/sheet';
export { SheetHandle, useSheetDetents, resolveDetent } from '../components/sheet';

export { Popover } from '../components/popover';
export { Tooltip } from '../components/tooltip';
export { Menu, ContextMenu, Menubar } from '../components/menu';
export { Toast, useToast } from '../components/toast';
