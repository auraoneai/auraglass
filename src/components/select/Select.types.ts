import type { ReactNode, Ref } from 'react';
import type { ControlSize } from '../control-shared/size';
import type { ChangeDetails } from '../../contracts/components';

/** BU render-prop shape, declared locally — .types.ts no headless-lib imports allowed here (foundation pattern). */
export type RenderProp = import('react').ReactElement | ((props: any) => import('react').ReactElement);

export interface SelectRootProps<Value = string> {
  /** Ref to the popup DOM element. */
  ref?: Ref<HTMLElement> | undefined;
  /** Controlled value. Pair with `onValueChange`. */
  value?: Value | Value[] | null;
  /** Initial value when uncontrolled. */
  defaultValue?: Value | Value[] | null;
  /** Called with the new value whenever it changes. */
  onValueChange?: (value: Value | Value[] | null, details: ChangeDetails) => void;
  /** Allows more than one selected value. */
  multiple?: boolean;
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the next open state when it changes. */
  onOpenChange?: (open: boolean, details: ChangeDetails) => void;
  /** Form field name submitted with the value. */
  name?: string;
  /** Id of the form the hidden input belongs to, when it is outside that form. */
  form?: string;
  /** Marks the field as required for form validation. */
  required?: boolean;
  /** Disables interaction. */
  disabled?: boolean;
  /** Makes the value read-only while keeping it focusable. */
  readOnly?: boolean;
  /** Control size. */
  size?: ControlSize;
  /** Value -> label map; Select.Value renders the label of the selected item. */
  items?: Record<string, ReactNode>;
  /** Content rendered inside the component. */
  children?: ReactNode;
}

export interface SelectTriggerProps {
  /** Placeholder text rendered by the value slot when nothing is selected. */
  placeholder?: ReactNode;
  /** aria-disabled on the trigger; focusable per APG unless focusableWhenDisabled=false */
  disabled?: boolean | undefined;
  /** false → tabIndex -1 so a disabled trigger leaves the tab order */
  focusableWhenDisabled?: boolean | undefined;
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
}

export interface SelectValueProps {
  children?: ReactNode;
  className?: string;
}

export interface SelectContentProps {
  children?: ReactNode;
  className?: string;
}

export interface SelectItemProps<Value = string> {
  value: Value;
  disabled?: boolean;
  /** Visible text; also used for typeahead and Select.Value. */
  label?: ReactNode;
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export interface SelectGroupProps {
  children?: ReactNode;
  className?: string;
}

export interface SelectGroupLabelProps {
  children?: ReactNode;
  className?: string;
}

export interface SelectSeparatorProps {
  className?: string;
}
