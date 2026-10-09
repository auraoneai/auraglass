/* CMP-328 compat: GlassTextarea (4.x) -> TextField multiline (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { TextField } from '../../../components/text-field';
import type { ChangeDetails } from '../../../contracts/components';

const DEP = 'DEP-C0027';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface GlassTextareaProps {
  value?: string;
  defaultValue?: string;
  onChange?: (event: { target: { value: string } }) => void;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  errorMessage?: React.ReactNode;
  rows?: number;
  autoResize?: boolean;
  glassVariant?: string;
  label?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  className?: string;
}

/** @deprecated GlassTextarea DEP-C0027 since 4.3.0, removed in 5.0.0. {@link TextField} */
export function GlassTextarea({ onChange, helperText, errorText, errorMessage, glassVariant, ...rest }: GlassTextareaProps) {
  warnDeprecated(DEP);
  if (glassVariant !== undefined) drop('glassVariant');
  return (
    <TextField
      multiline
      {...rest}
      {...(onChange !== undefined
        ? { onValueChange: (v: string, _d: ChangeDetails) => onChange({ target: { value: v } }) }
        : {})}
      {...(helperText !== undefined ? { description: helperText } : {})}
      {...(errorText !== undefined ? { error: errorText } : errorMessage !== undefined ? { error: errorMessage } : {})}
    />
  );
}
