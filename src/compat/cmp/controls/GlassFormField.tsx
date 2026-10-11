/* CMP-328 compat: GlassFormField (4.x) -> Field.Root (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Field } from '../../../components/field';

const DEP = 'DEP-C0030';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface GlassFormFieldProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  invalid?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function GlassFormField({ label, description, hint, error, required, invalid, children, ...rest }: GlassFormFieldProps) {
  warnDeprecated(DEP);
  return (
    <Field.Root
      {...rest}
      {...(invalid !== undefined ? { invalid } : {})}
      {...(required !== undefined ? { required } : {})}
    >
      {label !== undefined ? <Field.Label>{label}{required ? ' *' : null}</Field.Label> : null}
      {children}
      {description !== undefined || hint !== undefined ? (
        <Field.Description>{description ?? hint}</Field.Description>
      ) : null}
      {error !== undefined ? <Field.Error>{error}</Field.Error> : null}
    </Field.Root>
  );
}
