/* CMP-331 compat: GlassMultiSelect (4.x) -> Combobox multiple + Chips (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Combobox } from '../../../components/combobox';
import type { ChangeDetails } from '../../../contracts/components';

const DEP = 'DEP-C0038';

export interface GlassMultiSelectProps {
  selected?: string[];
  value?: string[];
  onSelectionChange?: (values: string[]) => void;
  onChange?: (values: string[]) => void;
  options?: readonly (string | { value: string; label: string })[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function GlassMultiSelect({ selected, value, onSelectionChange, onChange, options, placeholder, ...rest }: GlassMultiSelectProps) {
  warnDeprecated(DEP);
  const items = options?.map((o) => (typeof o === 'string' ? o : o.value));
  const cb = onSelectionChange ?? onChange;
  return (
    <Combobox.Root
      multiple
      {...(rest as object)}
      {...(items !== undefined ? { items } : {})}
      {...((selected ?? value) !== undefined ? { value: (selected ?? value) as never } : {})}
      {...(cb !== undefined ? { onValueChange: (v: unknown, _d: ChangeDetails) => cb(v as string[]) } : {})}
    >
      <Combobox.Chips />
      <Combobox.Input {...(placeholder !== undefined ? { placeholder } : {})} />
      <Combobox.Content>
        {options?.map((o) => {
          const v = typeof o === 'string' ? o : o.value;
          const l = typeof o === 'string' ? o : o.label;
          return <Combobox.Item key={v} value={v}>{l}</Combobox.Item>;
        })}
      </Combobox.Content>
    </Combobox.Root>
  );
}
