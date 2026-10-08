'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { FilterBar } from '../../../data/filter-bar/FilterBar';
import type { FilterBarProps } from '../../../data/filter-bar/FilterBar';
import type { FilterField, FilterGroup } from '../../../data/filter-bar/filter-model';

export type GlassFilterBarProps = {
  fields?: FilterField[];
  filters?: FilterGroup;
  onChange?: (group: FilterGroup) => void;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;
  resultCount?: number;
} & Omit<FilterBarProps, 'schema' | 'value' | 'defaultValue' | 'onValueChange' | 'search' | 'resultCount'>;

export function GlassFilterBar(props: GlassFilterBarProps) {
  warnDeprecated('GlassFilterBar');
  const { fields = [], filters, onChange, searchValue, onSearchChange, searchPlaceholder, resultCount, ...rest } = props;
  const [q, setQ] = React.useState(searchValue ?? '');
  const [localFilters, setLocalFilters] = React.useState<FilterGroup | undefined>(filters);
  const group = filters ?? localFilters;
  return (
    <FilterBar
      {...rest}
      schema={fields}
      value={group}
      onValueChange={(g: FilterGroup) => {
        if (filters === undefined) setLocalFilters(g);
        onChange?.(g);
      }}
      search={searchValue !== undefined || onSearchChange !== undefined || searchPlaceholder !== undefined
        ? { value: searchValue ?? q, onValueChange: (v: string) => { setQ(v); onSearchChange?.(v); }, placeholder: searchPlaceholder }
        : undefined}
      resultCount={resultCount}
    />
  );
}
