import type { ReactNode, Ref } from 'react';
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
  value?: Value | Value[] | null;
  defaultValue?: Value | Value[] | null;
  onValueChange?: (value: Value | Value[] | null, details: ChangeDetails) => void;
  multiple?: boolean;
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (inputValue: string, details: ChangeDetails) => void;
  /** null disables the built-in client filter (external/async filtering). */
  filter?: null | ((item: Value, query: string) => boolean);
  itemToString?: (item: Value) => string;
  itemToValue?: (item: Value) => string;
  isItemEqualToValue?: (itemValue: Value, value: Value) => boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details: ChangeDetails) => void;
  autoHighlight?: boolean;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  size?: ControlSize;
  /** Sets aria-busy on the list and one polite announcement (<=1/500ms). */
  loading?: boolean;
  /** 'select' (default) | 'autocomplete' — free text is the value. */
  mode?: ComboboxMode;
  /** Async options source; debounced loadDebounceMs after the last keystroke. */
  loadOptions?: (query: string, ctx: ComboboxLoadContext) => Promise<Value[]>;
  loadDebounceMs?: number;
  /** Allow creating a value not present in items. */
  creatable?: ComboboxCreatable;
  onCreate?: (query: string) => void;
  messages?: ControlMessages;
  children?: ReactNode;
}

export interface ComboboxInputProps {
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
}

export interface ComboboxLoadingProps {
  children?: ReactNode;
  className?: string;
}
