/* CMP-329 compat: LiquidGlassSearchField (4.x) -> SearchField (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { SearchField } from '../../../components/search-field';
import type { ChangeDetails } from '../../../contracts/components';

const DEP = 'DEP-C0031';
const drop = (p: string) => warnDeprecated(`$DEP-C0031.prop.${p}`);

export interface LiquidGlassSearchFieldProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  results?: unknown;
  suggestions?: unknown;
  facets?: unknown;
  aiPowered?: unknown;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

/** @deprecated LiquidGlassSearchField DEP-C0031 since 4.3.0, removed in 5.0.0. {@link SearchField} */
export function LiquidGlassSearchField({ onChange, onSearch, results, suggestions, facets, aiPowered, ...rest }: LiquidGlassSearchFieldProps) {
  warnDeprecated(DEP);
  for (const p of [results !== undefined && 'results', suggestions !== undefined && 'suggestions',
    facets !== undefined && 'facets', aiPowered !== undefined && 'aiPowered'])
    if (p) drop(`${p}:see-Combobox-or-registry-faceted-search`);
  return (
    <SearchField
      {...rest}
      {...(onChange !== undefined ? { onValueChange: (v: string, _d: ChangeDetails) => onChange(v) } : {})}
      {...(onSearch !== undefined ? { onValueChange: (v: string, _d: ChangeDetails) => onChange === undefined ? onSearch(v) : onSearch(v) } : {})}
    />
  );
}
