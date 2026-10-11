/* CMP-326 compat: GlassSegmentedControl (4.x) -> SegmentedControl (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { SegmentedControl } from '../../../components/segmented-control';
import type { ChangeDetails } from '../../../contracts/components';

const DEP = 'DEP-C0019';

export interface GlassSegmentedControlItem {
  id?: string;
  value?: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface GlassSegmentedControlProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  'aria-label'?: string;
  items?: readonly GlassSegmentedControlItem[];
  segments?: readonly GlassSegmentedControlItem[];
  children?: React.ReactNode;
  className?: string;
}

export function GlassSegmentedControl({ value, defaultValue, onChange, items, segments, children, ...rest }: GlassSegmentedControlProps) {
  warnDeprecated(DEP);
  const list = items ?? segments;
  return (
    <SegmentedControl.Root
      aria-label={(rest as Record<string, unknown>)['aria-label'] as string ?? 'Options'}
      name={(rest as Record<string, unknown>)['name'] as string ?? 'segmented'}
      {...rest}
      {...(value !== undefined ? { value } : {})}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      {...(onChange !== undefined ? { onValueChange: (v: string, _d: ChangeDetails) => onChange(v) } : {})}
    >
      {children}
      {list?.map((it, i) => {
        const v = it.id ?? it.value ?? `item-${i}`;
        return (
          <SegmentedControl.Item key={v} value={v} {...(it.disabled !== undefined ? { disabled: it.disabled } : {})}>
            {it.icon}
            {it.label}
          </SegmentedControl.Item>
        );
      })}
    </SegmentedControl.Root>
  );
}
