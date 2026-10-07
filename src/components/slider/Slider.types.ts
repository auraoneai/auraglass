import type { ReactNode, Ref } from 'react';
import type { ControlSize } from '../control-shared/size';
import type { ChangeDetails } from '../../contracts/components';

export interface SliderMark {
  value: number;
  label?: string;
}

export interface SliderRootProps<V extends number | number[] = number | number[]> {
  value?: V;
  defaultValue?: V;
  onValueChange?: (value: V, details: ChangeDetails) => void;
  onValueCommitted?: (value: V, details: ChangeDetails) => void;
  min?: number;
  max?: number;
  step?: number;
  /** PageUp/PageDown / Shift+Arrow increment (default 10). */
  largeStep?: number;
  minStepsBetweenValues?: number;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  format?: Intl.NumberFormatOptions;
  locale?: Intl.LocalesArgument;
  getAriaValueText?: (value: number, index: number) => string;
  size?: ControlSize;
  /** Tick marks rendered under the track. */
  marks?: SliderMark[];
  children?: ReactNode;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  ref?: Ref<HTMLDivElement>;
}

export interface SliderValueProps {
  className?: string;
  ref?: Ref<HTMLElement>;
}
