import type { ReactNode, Ref } from 'react';
import type { ControlSize } from '../control-shared/size';
import type { ChangeDetails } from '../../contracts/components';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean, details: ChangeDetails) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  /** Value submitted when on. */
  value?: string;
  uncheckedValue?: string;
  size?: ControlSize;
  children?: ReactNode;
  className?: string;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  ref?: Ref<HTMLElement>;
}
