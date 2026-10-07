import type { ComponentProps, ReactNode, Ref } from 'react';
import type { ControlSize } from '../control-shared/size';
import type { ChangeDetails } from '../../contracts/components';

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, details: ChangeDetails) => void;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
  size?: ControlSize;
  children?: ReactNode;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  ref?: Ref<HTMLDivElement>;
}

export interface RadioItemProps {
  value: string;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  render?: import('react').ReactElement | ((props: any) => import('react').ReactElement);
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  ref?: Ref<HTMLElement>;
}
