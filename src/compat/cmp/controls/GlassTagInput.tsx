/* CMP-331 compat: GlassTagInput (4.x) -> Combobox multiple creatable + Chips (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Combobox } from '../../../components/combobox';
import type { ChangeDetails } from '../../../contracts/components';

const DEP = 'DEP-C0039';

export interface GlassTagInputProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  onTagsChange?: (values: string[]) => void;
  suggestions?: readonly string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/** @deprecated GlassTagInput DEP-C0039 since 4.3.0, removed in 5.0.0. {@link Combobox} */
export function GlassTagInput({ value, defaultValue, onChange, onTagsChange, suggestions, placeholder, ...rest }: GlassTagInputProps) {
  warnDeprecated(DEP);
  const cb = onChange ?? onTagsChange;
  return (
    <Combobox.Root
      multiple
      creatable={true}
      {...(rest as object)}
      {...(suggestions !== undefined ? { items: [...suggestions] } : {})}
      {...(value !== undefined ? { value: value as never } : {})}
      {...(defaultValue !== undefined ? { defaultValue: defaultValue as never } : {})}
      {...(cb !== undefined ? { onValueChange: (v: unknown, _d: ChangeDetails) => cb(v as string[]) } : {})}
    >
      <Combobox.Chips />
      <Combobox.Input {...(placeholder !== undefined ? { placeholder } : {})} />
      <Combobox.Content>
        {suggestions?.map((s) => <Combobox.Item key={s} value={s}>{s}</Combobox.Item>)}
      </Combobox.Content>
    </Combobox.Root>
  );
}
