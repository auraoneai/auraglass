import type { ComponentProps, ReactElement, ReactNode, Ref } from 'react';

/** BU render-prop shape, declared locally — .types.ts no headless-lib imports allowed here (foundation pattern). */
export type RenderProp = ReactElement | ((props: any) => ReactElement);

/** BU Field validate signature, declared locally. */
export type FieldValidate = (
  value: unknown,
  formValues: Record<string, unknown>,
) => string | string[] | null | undefined | Promise<string | string[] | null | undefined>;

export type FieldValidationMode = 'onBlur' | 'onChange';

type FieldRootDomProps = Omit<ComponentProps<'div'>, 'ref' | 'className' | 'children'>;

export interface FieldRootProps extends FieldRootDomProps {
  /** Whether the field is invalid (shows error, sets aria-invalid on control). */
  invalid?: boolean;
  disabled?: boolean;
  name?: string;
  validate?: FieldValidate;
  validationMode?: FieldValidationMode;
  validationDebounceTime?: number;
  className?: string;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export interface FieldLabelProps extends Omit<ComponentProps<'label'>, 'ref'> {
  className?: string;
  children?: ReactNode;
  ref?: Ref<HTMLLabelElement>;
}

export interface FieldDescriptionProps extends Omit<ComponentProps<'p'>, 'ref'> {
  className?: string;
  children?: ReactNode;
  ref?: Ref<HTMLParagraphElement>;
}

export interface FieldErrorProps extends Omit<ComponentProps<'div'>, 'ref'> {
  /** BU match: true always renders; a ValidityState key renders when that flag fails. */
  match?: boolean | keyof ValidityState | undefined;
  forceShow?: boolean;
  className?: string;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export interface FieldControlProps extends Omit<ComponentProps<'input'>, 'ref' | 'render'> {
  /** Render prop, e.g. `render={<textarea />}` for multiline. */
  render?: RenderProp;
  ref?: Ref<HTMLElement>;
}

export interface FieldsetRootProps extends Omit<ComponentProps<'fieldset'>, 'ref' | 'children'> {
  /** Legend text or node; renders the `legend` part. */
  legend?: ReactNode;
  className?: string;
  children?: ReactNode;
  ref?: Ref<HTMLFieldSetElement>;
}
