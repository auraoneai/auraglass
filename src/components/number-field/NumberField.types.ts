import type { ReactNode, Ref } from 'react';
import type { ControlSize } from '../control-shared/size';
import type { ChangeDetails } from '../../contracts/components';

export interface NumberFieldProps {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null, details: ChangeDetails) => void;
  min?: number;
  max?: number;
  /** Increment per step (default 1); 'any' disables step snapping. */
  step?: number | 'any';
  /** Shift-modified increment (default 10). */
  largeStep?: number;
  /** Alt-modified increment (default 0.1). */
  smallStep?: number;
  snapOnStep?: boolean;
  allowOutOfRange?: boolean;
  /** Wheel-scrubbing on the focused input (default false, REQ-CMP-75). */
  allowWheelScrub?: boolean;
  /** Renders the label inside a ScrubArea so dragging it nudges the value. */
  scrub?: boolean;
  /** Stepper aria-labels (REQ-CMP-77): {increase, decrease}. */
  labels?: { increase?: string; decrease?: string };
  format?: Intl.NumberFormatOptions;
  locale?: Intl.LocalesArgument;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  size?: ControlSize;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  id?: string;
  placeholder?: string;
  'aria-label'?: string;
  variant?: 'regular' | 'clear' | 'identity';
  refraction?: boolean;
  className?: string;
  ref?: Ref<HTMLInputElement>;
}
