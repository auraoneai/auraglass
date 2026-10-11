import type { ComponentProps, ReactNode, Ref } from 'react';
import type { ControlSize } from '../control-shared/size';
import type { ChangeDetails } from '../../contracts/components';

export interface TextFieldProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, details: ChangeDetails) => void;
  label?: ReactNode;
  description?: ReactNode;
  /** Present => invalid: data-invalid on the shell and Field.Error shown. */
  error?: ReactNode;
  multiline?: boolean;
  /** Rows for multiline (default 3). */
  rows?: number;
  /** CSS field-sizing: content growth; grows up to maxRows. */
  autoResize?: boolean;
  /** Cap for autoResize growth (default 8). */
  maxRows?: number;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  size?: ControlSize;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  id?: string;
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'search';
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
  /** Render the counter part (current/maxLength). */
  showCount?: boolean;
  validate?: import('../field/Field.types').FieldValidate;
  validationMode?: import('../field/Field.types').FieldValidationMode;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  className?: string;
  /** Ref targets the native control element. */
  ref?: Ref<HTMLInputElement | HTMLTextAreaElement>;
}
