/* CMP-330 compat: GlassSelect (4.x) -> Select (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Select } from '../../../components/select';
import type { ChangeDetails } from '../../../contracts/components';

const DEP = 'DEP-C0035';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface GlassSelectOption {
  value: string;
  label?: React.ReactNode;
  disabled?: boolean;
}

export interface GlassSelectProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string | null) => void;
  options?: readonly GlassSelectOption[];
  placeholder?: React.ReactNode;
  searchable?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glassVariant?: string;
  disabled?: boolean;
  name?: string;
  className?: string;
}

/** @deprecated GlassSelect DEP-C0035 since 4.3.0, removed in 5.0.0. {@link Select} */
export function GlassSelect({ onChange, options, placeholder, searchable, size, glassVariant, ...rest }: GlassSelectProps) {
  warnDeprecated(DEP);
  if (searchable) warnDeprecated(`${DEP}.searchable:use-Combobox`);
  if (glassVariant !== undefined) drop('glassVariant');
  const items = options
    ? Object.fromEntries(options.map((o) => [o.value, o.label ?? o.value]))
    : undefined;
  return (
    <Select.Root
      {...(rest as object)}
      {...(rest.value !== undefined ? { value: rest.value } : {})}
      {...(rest.defaultValue !== undefined ? { defaultValue: rest.defaultValue } : {})}
      {...(onChange !== undefined
        ? { onValueChange: (v: string | string[] | null, _d: ChangeDetails) => onChange(Array.isArray(v) ? v[0] ?? null : v) }
        : {})}
      {...(items !== undefined ? { items } : {})}
      {...(size === 'xl' ? { size: 'lg' } : size !== undefined ? { size } : {})}
    >
      <Select.Trigger {...(placeholder !== undefined ? { placeholder } : {})} />
      <Select.Content>
        {options?.map((o) => (
          <Select.Item key={o.value} value={o.value} {...(o.disabled !== undefined ? { disabled: o.disabled } : {})}>
            {o.label ?? o.value}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
