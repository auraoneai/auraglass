/* CMP-327 compat: GlassRadioGroup (4.x) -> RadioGroup (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { RadioGroup } from '../../../components/radio-group';
import type { ChangeDetails } from '../../../contracts/components';

const DEP = 'DEP-C0025';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface GlassRadioGroupOption {
  value: string;
  label?: React.ReactNode;
  disabled?: boolean;
}

export interface GlassRadioGroupProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options?: readonly GlassRadioGroupOption[];
  direction?: 'horizontal' | 'vertical';
  glassVariant?: string;
  disabled?: boolean;
  name?: string;
  children?: React.ReactNode;
  className?: string;
}

/** @deprecated GlassRadioGroup DEP-C0025 since 4.3.0, removed in 5.0.0. {@link RadioGroup} */
export function GlassRadioGroup({ onChange, options, direction, glassVariant, children, ...rest }: GlassRadioGroupProps) {
  warnDeprecated(DEP);
  if (glassVariant !== undefined) drop('glassVariant');
  return (
    <RadioGroup.Root
      {...rest}
      {...(onChange !== undefined ? { onValueChange: (v: string, _d: ChangeDetails) => onChange(v) } : {})}
      {...(direction !== undefined ? { orientation: direction } : {})}
    >
      {children}
      {options?.map((o) => (
        <RadioGroup.Item key={o.value} value={o.value} {...(o.disabled !== undefined ? { disabled: o.disabled } : {})}>
          {o.label ?? o.value}
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}
