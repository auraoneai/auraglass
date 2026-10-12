import type { ReactNode, Ref } from 'react';
import type { ControlSize } from '../control-shared/size';
import type { ChangeDetails } from '../../contracts/components';

export interface SearchFieldProps {
  /** Controlled value. Pair with `onValueChange`. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Called with the new value whenever it changes. */
  onValueChange?: (value: string, details: ChangeDetails) => void;
  /** Called after the value is cleared via Escape or the clear button. */
  onClear?: (details: ChangeDetails) => void;
  /** Clear button accessible name (default "Clear search"). */
  clearLabel?: string;
  /** Hint text rendered as a Kbd inside the shell; registers NO listener. */
  shortcut?: string;
  /** Loading state: spinner part + aria-busy on the root. */
  loading?: boolean;
  /** Visible label. */
  label?: ReactNode;
  /** Helper text rendered under the label and linked with `aria-describedby`. */
  description?: ReactNode;
  /** Error message; marks the field invalid when set. */
  error?: ReactNode;
  /* REQ-CMP-63: TextField's single-line props. */
  /** Leading content inside the shell, after the search glyph (adornment-start part). */
  startAdornment?: ReactNode;
  /** Trailing content inside the shell, before the clear button (adornment-end part). */
  endAdornment?: ReactNode;
  /** Maximum number of characters allowed. */
  maxLength?: number;
  /** Render the counter part (current/maxLength). */
  showCount?: boolean;
  /** Custom validation function. */
  validate?: import('../field/Field.types').FieldValidate;
  /** When validation runs. */
  validationMode?: import('../field/Field.types').FieldValidationMode;
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
  /** Placeholder text shown while the input is empty. */
  placeholder?: string;
  /** Native `autocomplete` hint for the input. */
  autoComplete?: string;
  /** Accessible name, required when there is no visible label. */
  'aria-label'?: string;
  /** Id of the element that provides the accessible name. */
  'aria-labelledby'?: string;
  /** Id of the element that provides the accessible description. */
  'aria-describedby'?: string;
  /** Material variant of the field. */
  variant?: 'regular' | 'clear' | 'identity';
  /** Opt-in refraction on refraction-eligible materials; ignored where unsupported. */
  refraction?: boolean;
  /** Class name merged onto the root element. */
  className?: string;
  /** Ref to the rendered root element. */
  ref?: Ref<HTMLInputElement>;
}
