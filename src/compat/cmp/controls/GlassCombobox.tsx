/* CMP-331 compat: GlassCombobox (4.x) -> Combobox (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Combobox } from '../../../components/combobox';
import type { ChangeDetails } from '../../../contracts/components';

const DEP = 'DEP-C0037';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface GlassComboboxProps {
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  onInputChange?: (value: string) => void;
  options?: readonly (string | { value: string; label: string })[];
  glassVariant?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function GlassCombobox({ onChange, onInputChange, options, glassVariant, placeholder, ...rest }: GlassComboboxProps) {
  warnDeprecated(DEP);
  if (glassVariant !== undefined) drop('glassVariant');
  const items = options?.map((o) => (typeof o === 'string' ? o : o.value));
  return (
    <Combobox.Root
      {...(rest as object)}
      {...(items !== undefined ? { items } : {})}
      {...(onChange !== undefined
        ? { onValueChange: (v: unknown, _d: ChangeDetails) => onChange(v as string | null) }
        : {})}
      {...(onInputChange !== undefined
        ? { onInputValueChange: (v: string, _d: ChangeDetails) => onInputChange(v) }
        : {})}
    >
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
