import type { ReactNode, Ref } from 'react';
import type { ControlSize } from '../control-shared/size';
import type { ChangeDetails } from '../../contracts/components';

export interface NumberFieldProps {
  /** Controlled value. Pair with `onValueChange`. */
  value?: number | null;
  /** Initial value when uncontrolled. */
  defaultValue?: number | null;
  /** Called with the new value whenever it changes. */
  onValueChange?: (value: number | null, details: ChangeDetails) => void;
  /** Minimum value. */
  min?: number;
  /** Maximum value. */
  max?: number;
  /** Increment per step (default 1); 'any' disables step snapping. */
  step?: number | 'any';
  /** Shift-modified increment (default 10). */
  largeStep?: number;
  /** Alt-modified increment (default 0.1). */
  smallStep?: number;
  /** Rounds the value to the nearest step after stepping. */
  snapOnStep?: boolean;
  /** Keeps typed values outside min/max instead of clamping them. */
  allowOutOfRange?: boolean;
  /** Wheel-scrubbing on the focused input (default false, REQ-CMP-75). */
  allowWheelScrub?: boolean;
  /** Renders the label inside a ScrubArea so dragging it nudges the value. */
  scrub?: boolean;
  /** Accessible labels for the stepper buttons. */
  labels?: { increase?: string; decrease?: string };
  /** Intl.NumberFormat options used to format the displayed value. */
  format?: Intl.NumberFormatOptions;
  /** BCP 47 locale used for formatting and parsing. */
  locale?: Intl.LocalesArgument;
  /** Visible label. */
  label?: ReactNode;
  /** Helper text rendered under the label and linked with `aria-describedby`. */
  description?: ReactNode;
  /** Error message; marks the field invalid when set. */
  error?: ReactNode;
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
  /** Accessible name, required when there is no visible label. */
  'aria-label'?: string;
  /** Material variant of the field. */
  variant?: 'regular' | 'clear' | 'identity';
  /** Opt-in refraction on refraction-eligible materials; ignored where unsupported. */
  refraction?: boolean;
  /** Class name merged onto the root element. */
  className?: string;
  /** Ref to the rendered root element. */
  ref?: Ref<HTMLInputElement>;
}
