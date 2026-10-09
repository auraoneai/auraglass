/* CMP-325 compat: ToggleButtonGroup (4.x) -> ToggleGroup (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ToggleGroup } from '../../../components/toggle-group';
import type { ChangeDetails } from '../../../contracts/components';

const DEP = 'DEP-C0014';

export interface ToggleButtonGroupProps {
  value?: string | string[];
  defaultValue?: string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/** @deprecated ToggleButtonGroup DEP-C0014 since 4.3.0, removed in 5.0.0. {@link ToggleGroup} */
export function ToggleButtonGroup({ value, defaultValue, onChange, multiple, ...rest }: ToggleButtonGroupProps) {
  warnDeprecated(DEP);
  const v = Array.isArray(value) ? value : value !== undefined ? [value] : undefined;
  return (
    <ToggleGroup.Root
      {...rest}
      {...(v !== undefined ? { value: v } : {})}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      {...(onChange !== undefined
        ? { onValueChange: (val: string[], _d: ChangeDetails) => onChange((multiple ? val : val[0]) as string | string[]) }
        : {})}
      {...(multiple !== undefined ? { multiple } : {})}
    />
  );
}
