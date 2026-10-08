'use client';
/* CMP-049: Form — consolidated error handling on Base UI Form.
   `errors` maps feed descendant Field.Root invalid state + Field.Error;
   an invalid submit is blocked and focus moves to the first invalid
   control in DOM order (Base UI focusFirstInvalid). `onSubmit` receives
   the collected form values, matching the PRD-08 seam consumers get. */
import * as React from 'react';
import { Form as Base } from '@base-ui/react/form';
import { cn } from '../../internal/index';

export interface FormProps<FormValues extends Record<string, unknown> = Record<string, unknown>>
  extends Omit<React.ComponentPropsWithoutRef<'form'>, 'onSubmit' | 'noValidate' | 'ref' | 'defaultValue' | 'onChange'> {
  /** Server/external errors keyed by Field.Root `name`; marks fields invalid and shows their Field.Error. */
  errors?: Record<string, string | string[]>;
  /** Called with the collected `{ fieldName: value }` map when the form submits valid. */
  onSubmit?: (values: FormValues, eventDetails: Base.SubmitEventDetails) => void;
  /** When fields validate. Field.Root's own validationMode wins. */
  validationMode?: 'onSubmit' | 'onBlur' | 'onChange';
  /** Imperative `validate(fieldName?)` actions. */
  actionsRef?: React.RefObject<Base.Actions | null>;
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLFormElement>;
}

export function Form<FormValues extends Record<string, any> = Record<string, any>>(
  props: FormProps<FormValues>,
) {
  const { errors, onSubmit, validationMode, actionsRef, className, children, ref, ...rest } = props;
  return (
    <Base<FormValues>
      {...rest}
      ref={ref}
      data-ag-part="root"
      className={cn('ag-form', className)}
      errors={errors}
      validationMode={validationMode}
      actionsRef={actionsRef}
      onFormSubmit={onSubmit}
    >
      {children}
    </Base>
  );
}
