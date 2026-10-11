/* CMP-325 compat: GlassToggle (4.x) -> ToggleGroup (single item) (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ToggleGroup } from '../../../components/toggle-group';

const DEP = 'DEP-C0015';

export interface GlassToggleProps {
  value?: boolean;
  onChange?: (pressed: boolean) => void;
  disabled?: boolean;
  label?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function GlassToggle({ value, onChange, disabled, label, children, className }: GlassToggleProps) {
  warnDeprecated(DEP);
  return (
    <ToggleGroup.Root
      {...(value !== undefined ? { value: value ? ['on'] : [] } : {})}
      {...(onChange !== undefined ? { onValueChange: (v: string[]) => onChange(v.includes('on')) } : {})}
      className={className}
    >
      <ToggleGroup.Item value="on" {...(disabled !== undefined ? { disabled } : {})}>
        {children ?? label}
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}
