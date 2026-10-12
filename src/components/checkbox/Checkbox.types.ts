import type { ComponentProps, ReactNode, Ref } from 'react';
import type { ControlSize } from '../control-shared/size';
import type { ChangeDetails } from '../../contracts/components';

export interface CheckboxProps {
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial checked state when uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the next checked state when it changes. */
  onCheckedChange?: (checked: boolean, details: ChangeDetails) => void;
  /** Shows the mixed state (some, not all, children checked). */
  indeterminate?: boolean;
  /** Makes this the parent checkbox of a group: its state reflects and sets all children. */
  parent?: boolean;
  /** Disables interaction. */
  disabled?: boolean;
  /** Makes the value read-only while keeping it focusable. */
  readOnly?: boolean;
  /** Marks the field as required for form validation. */
  required?: boolean;
  /** Form field name submitted with the value. */
  name?: string;
  /** Controlled value. Pair with `onValueChange`. */
  value?: string;
  /** Value submitted with the form when unchecked. */
  uncheckedValue?: string;
  /** Control size. */
  size?: ControlSize;
  /** Accessible label; renders inside the indicator-adjacent label slot. */
  children?: ReactNode;
  /** Class name merged onto the root element. */
  className?: string;
  /** Id of the input element; generated when omitted. */
  id?: string;
  /** Accessible name, required when there is no visible label. */
  'aria-label'?: string;
  /** Id of the element that provides the accessible name. */
  'aria-labelledby'?: string;
  /** Id of the element that provides the accessible description. */
  'aria-describedby'?: string;
  /** Ref to the rendered root element. */
  ref?: Ref<HTMLElement>;
}

export interface CheckboxGroupProps {
  /** Controlled value. Pair with `onValueChange`. */
  value?: string[];
  /** Initial value when uncontrolled. */
  defaultValue?: string[];
  /** Called with the new value whenever it changes. */
  onValueChange?: (value: string[], details: ChangeDetails) => void;
  /** Values the parent checkbox controls (drives its mixed state). */
  allValues?: string[];
  /** Disables interaction. */
  disabled?: boolean;
  /** Form field name submitted with the value. */
  name?: string;
  /** Content rendered inside the component. */
  children?: ReactNode;
  /** Class name merged onto the root element. */
  className?: string;
  /** Ref to the rendered root element. */
  ref?: Ref<HTMLDivElement>;
}

export type BaseCheckboxRender = import('react').ReactElement | ((props: Record<string, unknown>) => import('react').ReactElement);
