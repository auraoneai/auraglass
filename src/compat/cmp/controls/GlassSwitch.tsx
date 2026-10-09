/* CMP-327 compat: GlassSwitch (4.x) -> Switch (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Switch } from '../../../components/switch';
import type { ChangeDetails } from '../../../contracts/components';

const DEP = 'DEP-C0021';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface GlassSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  name?: string;
  value?: string;
  glassVariant?: string;
  children?: React.ReactNode;
  className?: string;
}

/** @deprecated GlassSwitch DEP-C0021 since 4.3.0, removed in 5.0.0. {@link Switch} */
export function GlassSwitch({ onChange, label, size, glassVariant, ...rest }: GlassSwitchProps) {
  warnDeprecated(DEP);
  if (glassVariant !== undefined) drop('glassVariant');
  return (
    <Switch
      {...rest}
      {...(onChange !== undefined ? { onCheckedChange: (c: boolean, _d: ChangeDetails) => onChange(c) } : {})}
      {...(size === 'xl' ? { size: 'lg' } : size !== undefined ? { size } : {})}
    >
      {rest.children ?? label}
    </Switch>
  );
}
