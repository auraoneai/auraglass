import type { ComponentProps, ReactNode, Ref } from 'react';
import type { ControlSize } from '../control-shared/size';
import type { ChangeDetails } from '../../contracts/components';

export interface TextFieldProps {
  /** Controlled value. Pair with `onValueChange`. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Called with the new value whenever it changes. */
  onValueChange?: (value: string, details: ChangeDetails) => void;
  /** Visible label. */
  label?: ReactNode;
  /** Helper text rendered under the label and linked with `aria-describedby`. */
  description?: ReactNode;
  /** Present => invalid: data-invalid on the shell and Field.Error shown. */
  error?: ReactNode;
  /** Renders a textarea instead of an input. */
  multiline?: boolean;
  /** Rows for multiline (default 3). */
  rows?: number;
  /** CSS field-sizing: content growth; grows up to maxRows. */
  autoResize?: boolean;
  /** Cap for autoResize growth (default 8). */
  maxRows?: number;
  /** Content shown before the input (icon or prefix). */
  startAdornment?: ReactNode;
  /** Content shown after the input (icon, suffix or action). */
  endAdornment?: ReactNode;
  /** Control size. */
  size?: ControlSize;
  /** Marks the field as required for form validation. */
  required?: boolean;
  /** Disables interaction. */
  disabled?: boolean;
  /** Makes the value read-only while keeping it focusable. */
  readOnly?: boolean;
  /** Form field name submitted with the value. */
  name?: string;
  /** Id of the input element; generated when omitted. */
  id?: string;
  /** Native input type. */
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'search';
  /** Placeholder text shown while the input is empty. */
  placeholder?: string;
  /** Native `autocomplete` hint for the input. */
  autoComplete?: string;
  /** Maximum number of characters. */
  maxLength?: number;
  /** Render the counter part (current/maxLength). */
  showCount?: boolean;
  /** Custom validator; return an error message, or null when valid. */
  validate?: import('../field/Field.types').FieldValidate;
  /** When validation runs. */
  validationMode?: import('../field/Field.types').FieldValidationMode;
  /** Accessible name, required when there is no visible label. */
  'aria-label'?: string;
  /** Id of the element that provides the accessible name. */
  'aria-labelledby'?: string;
  /** Id of the element that provides the accessible description. */
  'aria-describedby'?: string;
  /** Class name merged onto the root element. */
  className?: string;
  /** Ref targets the native control element. */
  ref?: Ref<HTMLInputElement | HTMLTextAreaElement>;
}
