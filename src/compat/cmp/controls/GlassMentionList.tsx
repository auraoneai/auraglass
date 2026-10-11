/* CMP-331 compat: GlassMentionList (4.x) -> Combobox list parts (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Combobox } from '../../../components/combobox';

const DEP = 'DEP-C0040';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface GlassMentionListProps {
  items?: readonly (string | { id: string; label: string })[];
  trigger?: string;
  onSelect?: (item: string) => void;
  className?: string;
}

/* Trigger-character detection is consumer code in 5.0 — warns once. */
export function GlassMentionList({ items, trigger, onSelect, ...rest }: GlassMentionListProps) {
  warnDeprecated(DEP);
  if (trigger !== undefined) drop('trigger:consumer-code');
  return (
    <Combobox.Root
      open
      {...(rest as object)}
      {...(items !== undefined
        ? { items: items.map((i) => (typeof i === 'string' ? i : i.id)) }
        : {})}
      {...(onSelect !== undefined ? { onValueChange: (v: unknown) => onSelect(v as string) } : {})}
    >
      <Combobox.Content>
        {items?.map((i) => {
          const v = typeof i === 'string' ? i : i.id;
          const l = typeof i === 'string' ? i : i.label;
          return <Combobox.Item key={v} value={v}>{l}</Combobox.Item>;
        })}
      </Combobox.Content>
    </Combobox.Root>
  );
}
