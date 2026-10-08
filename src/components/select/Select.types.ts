import type { ReactNode, Ref } from 'react';
import type { ControlSize } from '../control-shared/size';
import type { ChangeDetails } from '../../contracts/components';

/** BU render-prop shape, declared locally — .types.ts may not import @base-ui (foundation pattern). */
export type RenderProp = import('react').ReactElement | ((props: any) => import('react').ReactElement);

export interface SelectRootProps<Value = string> {
  value?: Value | Value[] | null;
  defaultValue?: Value | Value[] | null;
  onValueChange?: (value: Value | Value[] | null, details: ChangeDetails) => void;
  multiple?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details: ChangeDetails) => void;
  name?: string;
  form?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  size?: ControlSize;
  /** Value -> label map; Select.Value renders the label of the selected item. */
  items?: Record<string, ReactNode>;
  children?: ReactNode;
}

export interface SelectTriggerProps {
  /** Placeholder text rendered by the value slot when nothing is selected. */
  placeholder?: ReactNode;
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
}

export interface SelectValueProps {
  children?: ReactNode;
  className?: string;
}

export interface SelectContentProps {
  children?: ReactNode;
  className?: string;
}

export interface SelectItemProps<Value = string> {
  value: Value;
  disabled?: boolean;
  /** Visible text; also used for typeahead and Select.Value. */
  label?: ReactNode;
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export interface SelectGroupProps {
  children?: ReactNode;
  className?: string;
}

export interface SelectGroupLabelProps {
  children?: ReactNode;
  className?: string;
}

export interface SelectSeparatorProps {
  className?: string;
}
