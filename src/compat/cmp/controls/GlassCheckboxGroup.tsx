/* CMP-327 compat: GlassCheckboxGroup (4.x) -> CheckboxGroup (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Checkbox, CheckboxGroup } from '../../../components/checkbox';
import type { ChangeDetails } from '../../../contracts/components';

const DEP = 'DEP-C0024';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface GlassCheckboxGroupOption {
  value: string;
  label?: React.ReactNode;
  disabled?: boolean;
}

export interface GlassCheckboxGroupProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  options?: readonly GlassCheckboxGroupOption[];
  disabled?: boolean;
  name?: string;
  children?: React.ReactNode;
  className?: string;
}

export function GlassCheckboxGroup({ onChange, options, children, ...rest }: GlassCheckboxGroupProps) {
  warnDeprecated(DEP);
  return (
    <CheckboxGroup
      {...rest}
      {...(onChange !== undefined ? { onValueChange: (v: string[], _d: ChangeDetails) => onChange(v) } : {})}
    >
      {children}
      {options?.map((o) => (
        <Checkbox key={o.value} value={o.value} {...(o.disabled !== undefined ? { disabled: o.disabled } : {})}>
          {o.label ?? o.value}
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
}
