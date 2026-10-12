import type { ReactNode, Ref } from 'react';
import type { ControlSize } from '../control-shared/size';
import type { ChangeDetails } from '../../contracts/components';

export interface SwitchProps {
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial checked state when uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the next checked state when it changes. */
  onCheckedChange?: (checked: boolean, details: ChangeDetails) => void;
  /** Disables interaction. */
  disabled?: boolean;
  /** Makes the value read-only while keeping it focusable. */
  readOnly?: boolean;
  /** Marks the field as required for form validation. */
  required?: boolean;
  /** Form field name submitted with the value. */
  name?: string;
  /** Value submitted when on. */
  value?: string;
  /** Value submitted with the form when off. */
  uncheckedValue?: string;
  /** Control size. */
  size?: ControlSize;
  /** Content rendered inside the component. */
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
