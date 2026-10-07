import type { ComponentProps, ReactNode, Ref } from 'react';
import type { ControlSize } from '../control-shared/size';
import type { ChangeDetails } from '../../contracts/components';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean, details: ChangeDetails) => void;
  indeterminate?: boolean;
  parent?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  uncheckedValue?: string;
  size?: ControlSize;
  /** Accessible label; renders inside the indicator-adjacent label slot. */
  children?: ReactNode;
  className?: string;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  ref?: Ref<HTMLElement>;
}

export interface CheckboxGroupProps {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[], details: ChangeDetails) => void;
  /** Values the parent checkbox controls (drives its mixed state). */
  allValues?: string[];
  disabled?: boolean;
  name?: string;
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export type BaseCheckboxRender = import('react').ReactElement | ((props: Record<string, unknown>) => import('react').ReactElement);
