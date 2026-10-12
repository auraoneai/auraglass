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
  /** Disables interaction. */
  disabled?: boolean;
  /** Form field name submitted with the value. */
  name?: string;
  /** Custom validator; return an error message (or messages), or null when valid. */
  validate?: FieldValidate;
  /** When validation runs. */
  validationMode?: FieldValidationMode;
  /** Delay, in milliseconds, before validating in 'onChange' mode. */
  validationDebounceTime?: number;
  /** Class name merged onto the root element. */
  className?: string;
  /** Content rendered inside the component. */
  children?: ReactNode;
  /** Ref to the rendered root element. */
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
  /** Class name merged onto the root element. */
  className?: string;
  /** Content rendered inside the component. */
  children?: ReactNode;
  /** Ref to the rendered root element. */
  ref?: Ref<HTMLFieldSetElement>;
}
