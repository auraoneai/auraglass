/* GlassFilterBar — 4.x compat adapter (REQ-SURF-13, DEP-S0208) → FilterBar.
   The 4.x bar showed already-applied filter chips ({id,label,value,onRemove})
   with a clear action. Each chip becomes a text field + an `equals` rule in a
   controlled FilterGroup, so FilterBar renders the same chips; removing a
   rule fires that chip's onRemove, "clear all" fires onClear. label →
   labels.filters, clearLabel → labels.clearAll. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { FilterBar } from '../../../data/filter-bar/FilterBar';
import type { FilterField, FilterGroup, FilterRule } from '../../../data/filter-bar/filter-model';

export interface GlassFilterBarFilter {
  id: string;
  label: string;
  value?: React.ReactNode;
  active?: boolean;
  onRemove?: () => void;
}

export interface GlassFilterBarProps {
  filters?: GlassFilterBarFilter[];
  actions?: React.ReactNode;
  onClear?: () => void;
  clearLabel?: string;
  label?: string;
  className?: string;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassFilterBar` compat adapter (DEP-S0208).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link FilterBar from aura-glass/data}.
 */
export function GlassFilterBar(props: GlassFilterBarProps) {
  warnDeprecated('DEP-S0208');
  const { filters = [], actions, onClear, clearLabel, label, className } = props;
  const active = filters.filter((f) => f.active !== false);
  const schema = React.useMemo<FilterField[]>(
    () => filters.map((f) => ({ id: f.id, label: f.label, type: 'text' as const })),
    [filters],
  );
  const group = React.useMemo<FilterGroup>(
    () => ({
      kind: 'group',
      id: 'compat-filters',
      combinator: 'and',
      children: active.map(
        (f): FilterRule => ({
          kind: 'rule',
          id: f.id,
          fieldId: f.id,
          operator: 'equals' as FilterRule['operator'],
          value: f.value == null ? '' : String(typeof f.value === 'string' || typeof f.value === 'number' ? f.value : f.label),
        }),
      ),
    }),
    [active],
  );
  const onValueChange = (next: FilterGroup) => {
    const kept = new Set(next.children.map((c) => c.id));
    for (const f of active) if (!kept.has(f.id)) f.onRemove?.();
  };
  return (
    <>
      <FilterBar
        schema={schema}
        value={group}
        onValueChange={onValueChange}
        {...(onClear ? { onClearAll: onClear } : {})}
        labels={{ ...(label !== undefined ? { filters: label } : {}), ...(clearLabel !== undefined ? { clearAll: clearLabel } : {}) }}
        {...(className ? { className } : {})}
      />
      {actions}
    </>
  );
}
