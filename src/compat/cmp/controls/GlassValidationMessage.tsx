/* CMP-328 compat: GlassValidationMessage (4.x) -> Field.Error (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Field } from '../../../components/field';

const DEP = 'DEP-C0029';

export interface GlassValidationMessageProps {
  message?: React.ReactNode;
  children?: React.ReactNode;
  type?: 'error' | 'warning' | 'success';
  className?: string;
}

/** @deprecated GlassValidationMessage DEP-C0029 since 4.3.0, removed in 5.0.0. {@link Field.Error} */
export function GlassValidationMessage({ message, children, type, ...rest }: GlassValidationMessageProps) {
  warnDeprecated(DEP);
  if (type !== undefined && type !== 'error') warnDeprecated(`${DEP}.type.${type}`);
  /* BU Field.Error requires Field.Root context — the adapter self-wraps so it
     never throws (CMP-323 contract: renders the 5.0 component, never throws). */
  return (
    <Field.Root invalid>
      <Field.Error {...rest}>{children ?? message}</Field.Error>
    </Field.Root>
  );
}
