import type { ComponentProps, ReactNode, Ref } from 'react';
import type { Field as BaseField } from '@base-ui/react/field';
import type { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';

type FieldRootDomProps = Omit<ComponentProps<'div'>, 'ref' | 'className' | 'children'>;

export interface FieldRootProps extends FieldRootDomProps {
  /** Whether the field is invalid (shows error, sets aria-invalid on control). */
  invalid?: boolean;
  disabled?: boolean;
  name?: string;
  validate?: ComponentProps<typeof BaseField.Root>['validate'];
  validationMode?: ComponentProps<typeof BaseField.Root>['validationMode'];
  validationDebounceTime?: number;
  className?: string;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export interface FieldLabelProps extends Omit<ComponentProps<typeof BaseField.Label>, 'ref' | 'render'> {
  className?: string;
  children?: ReactNode;
  ref?: Ref<HTMLElement>;
}

export interface FieldDescriptionProps extends Omit<ComponentProps<typeof BaseField.Description>, 'ref' | 'render'> {
  className?: string;
  children?: ReactNode;
  ref?: Ref<HTMLElement>;
}

export interface FieldErrorProps extends Omit<ComponentProps<typeof BaseField.Error>, 'ref' | 'render'> {
  className?: string;
  children?: ReactNode;
  ref?: Ref<HTMLElement>;
}

export interface FieldControlProps extends Omit<ComponentProps<typeof BaseField.Control>, 'ref' | 'render'> {
  /** Render prop, e.g. `render={<textarea />}` for multiline. */
  render?: ComponentProps<typeof BaseField.Control>['render'];
  ref?: Ref<HTMLElement>;
}

export interface FieldsetRootProps extends Omit<ComponentProps<typeof BaseFieldset.Root>, 'ref' | 'render' | 'children'> {
  /** Legend text or node; renders the `legend` part. */
  legend?: ReactNode;
  className?: string;
  children?: ReactNode;
  ref?: Ref<HTMLFieldSetElement>;
}
