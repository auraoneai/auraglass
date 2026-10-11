/* CMP-328 compat: GlassInput (4.x) -> TextField (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { TextField } from '../../../components/text-field';
import type { ChangeDetails } from '../../../contracts/components';

const DEP = 'DEP-C0026';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface GlassInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (event: { target: { value: string } }) => void;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  errorMessage?: React.ReactNode;
  isInvalid?: boolean;
  /** 4.x validation state — 'error'/'invalid' mark the field invalid. */
  state?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  glassVariant?: string;
  label?: React.ReactNode;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'search';
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

export function GlassInput({
  onChange, helperText, errorText, errorMessage, isInvalid, state,
  leftIcon, rightIcon, icon, fullWidth, glassVariant, ...rest
}: GlassInputProps) {
  warnDeprecated(DEP);
  if (fullWidth !== undefined) drop('fullWidth');
  if (glassVariant !== undefined) drop('glassVariant');
  return (
    <TextField
      {...rest}
      {...(onChange !== undefined
        ? { onValueChange: (v: string, _d: ChangeDetails) => onChange({ target: { value: v } }) }
        : {})}
      {...(helperText !== undefined ? { description: helperText } : {})}
      {...(errorText !== undefined ? { error: errorText } : errorMessage !== undefined ? { error: errorMessage } : (isInvalid || state === 'error' || state === 'invalid') ? { error: true as unknown as React.ReactNode } : {})}
      {...(leftIcon !== undefined ? { startAdornment: leftIcon } : icon !== undefined ? { startAdornment: icon } : {})}
      {...(rightIcon !== undefined ? { endAdornment: rightIcon } : {})}
    />
  );
}
