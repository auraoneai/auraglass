import type { ReactNode, Ref } from 'react';
import type { ControlSize } from '../control-shared/size';
import type { ChangeDetails } from '../../contracts/components';

export interface SearchFieldProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, details: ChangeDetails) => void;
  /** Called after the value is cleared via Escape or the clear button. */
  onClear?: (details: ChangeDetails) => void;
  /** Clear button accessible name (default "Clear search"). */
  clearLabel?: string;
  /** Hint text rendered as a Kbd inside the shell; registers NO listener. */
  shortcut?: string;
  /** Loading state: spinner part + aria-busy on the root. */
  loading?: boolean;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  /* REQ-CMP-63: TextField's single-line props. */
  /** Leading content inside the shell, after the search glyph (adornment-start part). */
  startAdornment?: ReactNode;
  /** Trailing content inside the shell, before the clear button (adornment-end part). */
  endAdornment?: ReactNode;
  maxLength?: number;
  /** Render the counter part (current/maxLength). */
  showCount?: boolean;
  validate?: import('../field/Field.types').FieldValidate;
  validationMode?: import('../field/Field.types').FieldValidationMode;
  size?: ControlSize;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  id?: string;
  placeholder?: string;
  autoComplete?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  variant?: 'regular' | 'clear' | 'identity';
  refraction?: boolean;
  className?: string;
  ref?: Ref<HTMLInputElement>;
}
