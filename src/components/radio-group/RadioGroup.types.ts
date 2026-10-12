import type { ComponentProps, ReactNode, Ref } from 'react';
import type { ControlSize } from '../control-shared/size';
import type { ChangeDetails } from '../../contracts/components';

export interface RadioGroupProps {
  /** Controlled value. Pair with `onValueChange`. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Called with the new value whenever it changes. */
  onValueChange?: (value: string, details: ChangeDetails) => void;
  /** Form field name submitted with the value. */
  name?: string;
  /** Disables interaction. */
  disabled?: boolean;
  /** Makes the value read-only while keeping it focusable. */
  readOnly?: boolean;
  /** Marks the field as required for form validation. */
  required?: boolean;
  /** Layout direction; also the arrow-key axis. */
  orientation?: 'horizontal' | 'vertical';
  /** Control size. */
  size?: ControlSize;
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
