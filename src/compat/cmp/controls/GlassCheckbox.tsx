/* CMP-327 compat: GlassCheckbox (4.x) -> Checkbox (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Checkbox } from '../../../components/checkbox';
import type { ChangeDetails } from '../../../contracts/components';

const DEP = 'DEP-C0023';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface GlassCheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onChange?: (event: { target: { checked: boolean } }) => void;
  /** 4.x direct-value handler — called alongside onChange. */
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glassVariant?: string;
  disabled?: boolean;
  name?: string;
  value?: string;
  children?: React.ReactNode;
  className?: string;
}

export function GlassCheckbox({ onChange, onCheckedChange, label, size, glassVariant, ...rest }: GlassCheckboxProps) {
  warnDeprecated(DEP);
  if (glassVariant !== undefined) drop('glassVariant');
  return (
    <Checkbox
      {...rest}
      {...(onChange !== undefined || onCheckedChange !== undefined
        ? { onCheckedChange: (c: boolean, _d: ChangeDetails) => {
            onChange?.({ target: { checked: c } });
            onCheckedChange?.(c);
          } }
        : {})}
      {...(size === 'xl' ? { size: 'lg' } : size !== undefined ? { size } : {})}
    >
      {rest.children ?? label}
    </Checkbox>
  );
}
