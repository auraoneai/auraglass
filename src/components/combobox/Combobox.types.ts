import type { KeyboardEventHandler, ReactNode, Ref } from 'react';
import type { ControlSize } from '../control-shared/size';
import type { ControlMessages } from '../control-shared/messages';
import type { ChangeDetails } from '../../contracts/components';

export type ComboboxMode = 'select' | 'autocomplete';

export interface ComboboxLoadContext {
  signal: AbortSignal;
}

export type ComboboxCreatable = boolean | { label?: (query: string) => ReactNode };

export interface ComboboxRootProps<Value = string> {
  /** Data items rendered by the list (flat array; nullish entries unsupported). */
  items?: Value[];
  /** Controlled value. Pair with `onValueChange`. */
  value?: Value | Value[] | null;
  /** Initial value when uncontrolled. */
  defaultValue?: Value | Value[] | null;
  /** Called with the new value whenever it changes. */
  onValueChange?: (value: Value | Value[] | null, details: ChangeDetails) => void;
  /** Allows more than one selected value. */
  multiple?: boolean;
  /** Controlled text of the input. Pair with `onInputValueChange`. */
  inputValue?: string;
  /** Initial text of the input when uncontrolled. */
  defaultInputValue?: string;
  /** Called with the input text whenever it changes. */
  onInputValueChange?: (inputValue: string, details: ChangeDetails) => void;
  /** null disables the built-in client filter (external/async filtering). */
  filter?: null | ((item: Value, query: string) => boolean);
  /** Label shown for an item in the input and the list. */
  itemToString?: (item: Value) => string;
  /** String value submitted with the form for an item. */
  itemToValue?: (item: Value) => string;
  /** Equality used to match items against the selected value. */
  isItemEqualToValue?: (itemValue: Value, value: Value) => boolean;
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the next open state when it changes. */
  onOpenChange?: (open: boolean, details: ChangeDetails) => void;
  /** Highlights the first matching item while typing. */
  autoHighlight?: boolean;
  /** Form field name submitted with the value. */
  name?: string;
  /** Marks the field as required for form validation. */
  required?: boolean;
  /** Disables interaction. */
  disabled?: boolean;
  /** Makes the value read-only while keeping it focusable. */
  readOnly?: boolean;
  /** Control size. */
  size?: ControlSize;
  /** Sets aria-busy on the list and one polite announcement (<=1/500ms). */
  loading?: boolean;
  /** 'select' (default) | 'autocomplete' — free text is the value. */
  mode?: ComboboxMode;
  /** Async options source; debounced loadDebounceMs after the last keystroke. */
  loadOptions?: (query: string, ctx: ComboboxLoadContext) => Promise<Value[]>;
  /** Delay, in milliseconds, between typing and `loadOptions`. */
  loadDebounceMs?: number;
  /** Allow creating a value not present in items. */
  creatable?: ComboboxCreatable;
  /** Called with the query when the user creates a new item; enables the "Create" option. */
  onCreate?: (query: string) => void;
  /** Overrides for the built-in, localizable status messages. */
  messages?: ControlMessages;
  /** Content rendered inside the component. */
  children?: ReactNode;
}

export interface ComboboxInputProps {
  onKeyDown?: KeyboardEventHandler<HTMLInputElement> | undefined;
  placeholder?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

export interface ComboboxContentProps {
  /** Static items, or a `(item, index) => node` render fn (required in virtual mode). */
  children?: ReactNode | ((item: any, index: number) => ReactNode);
  className?: string;
}

export interface ComboboxItemProps<Value = string> {
  value: Value;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export interface ComboboxEmptyProps {
  children?: ReactNode;
  className?: string;
}

export interface ComboboxGroupProps {
  children?: ReactNode;
  className?: string;
}

export interface ComboboxGroupLabelProps {
  children?: ReactNode;
  className?: string;
}

export interface ComboboxChipsProps {
  children?: ReactNode;
  className?: string;
}

export interface ComboboxChipProps {
  children?: ReactNode;
  className?: string;
  label?: string;
}
export interface ComboboxChipRemoveProps {
  children?: ReactNode;
  className?: string;
  label?: string;
}

export interface ComboboxLoadingProps {
  children?: ReactNode;
  className?: string;
}
