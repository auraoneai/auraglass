'use client';

import * as React from 'react';
import { Field as Base } from '@base-ui/react/field';
import type {
  FieldControlProps,
  FieldDescriptionProps,
  FieldErrorProps,
  FieldLabelProps,
  FieldRootProps,
} from './Field.types';

function FieldRoot({ invalid, disabled, name, validate, validationMode, validationDebounceTime, className, children, ref, ...rest }: FieldRootProps) {
  return (
    <Base.Root
      data-ag-part="root"
      className={className}
      invalid={invalid}
      disabled={disabled}
      name={name}
      validate={validate}
      validationMode={validationMode}
      validationDebounceTime={validationDebounceTime}
      ref={ref}
      {...rest}
    >
      {children}
    </Base.Root>
  );
}

function FieldLabel({ className, ref, ...rest }: FieldLabelProps) {
  return <Base.Label data-ag-part="label" className={className} ref={ref} {...rest} />;
}

function FieldDescription({ className, ref, ...rest }: FieldDescriptionProps) {
  return <Base.Description data-ag-part="description" className={className} ref={ref} {...rest} />;
}

function FieldError({ className, ref, ...rest }: FieldErrorProps) {
  return <Base.Error data-ag-part="error" className={className} ref={ref} {...rest} />;
}

function FieldControl({ className, ref, ...rest }: FieldControlProps) {
  return <Base.Control data-ag-part="control-shell" className={className} ref={ref} {...rest} />;
}

export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
  Control: FieldControl,
};
