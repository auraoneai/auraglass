import type { ReactNode, Ref } from 'react';
import type { ControlSize } from '../control-shared/size';
import type { ChangeDetails } from '../../contracts/components';

export interface SliderMark {
  value: number;
  label?: string;
}

export interface SliderRootProps<V extends number | number[] = number | number[]> {
  /** Controlled value. Pair with `onValueChange`. */
  value?: V;
  /** Initial value when uncontrolled. */
  defaultValue?: V;
  /** Called with the new value whenever it changes. */
  onValueChange?: (value: V, details: ChangeDetails) => void;
  /** Called once the user finishes a change (pointer up or key release). */
  onValueCommitted?: (value: V, details: ChangeDetails) => void;
  /** Minimum value. */
  min?: number;
  /** Maximum value. */
  max?: number;
  /** Increment between values. */
  step?: number;
  /** PageUp/PageDown / Shift+Arrow increment (default 10). */
  largeStep?: number;
  /** Minimum number of steps between range thumbs. */
  minStepsBetweenValues?: number;
  /** Track direction; also the arrow-key axis. */
  orientation?: 'horizontal' | 'vertical';
  /** Disables interaction. */
  disabled?: boolean;
  /** Makes the value read-only while keeping it focusable. */
  readOnly?: boolean;
  /** Marks the field as required for form validation. */
  required?: boolean;
  /** Form field name submitted with the value. */
  name?: string;
  /** Intl.NumberFormat options used to format the displayed value. */
  format?: Intl.NumberFormatOptions;
  /** BCP 47 locale used for formatting and parsing. */
  locale?: Intl.LocalesArgument;
  /** Text announced for a thumb value (`aria-valuetext`). */
  getAriaValueText?: (value: number, index: number) => string;
  /** Control size. */
  size?: ControlSize;
  /** Tick marks rendered under the track. */
  marks?: SliderMark[];
  /** Content rendered inside the component. */
  children?: ReactNode;
  /** Class name merged onto the root element. */
  className?: string;
  /** Accessible name, required when there is no visible label. */
  'aria-label'?: string;
  /** Id of the element that provides the accessible name. */
  'aria-labelledby'?: string;
  /** Ref to the rendered root element. */
  ref?: Ref<HTMLDivElement>;
}

export interface SliderValueProps {
  className?: string;
  ref?: Ref<HTMLElement>;
}
