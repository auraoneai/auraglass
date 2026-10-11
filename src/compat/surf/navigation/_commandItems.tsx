/* Shared 4.x command-item mapping for GlassCommand, GlassCommandPalette and
   LiquidGlassCommandSurface (REQ-SURF-13). Items are grouped by their 4.x
   group/category (or the explicit 4.x `groups`) into Command.Group, each item
   is a Command.Item: value = id, keywords = label + description + keywords,
   onSelect fires the 4.x action/onSelect and the adapter-level onSelect(item).
   Command.Item re-registers when value/keywords/onSelect change identity, so
   both are kept referentially stable here. */
'use client';
import * as React from 'react';
import { Command } from '../../../components/command-palette/Command';

export interface LegacyCommandItem {
  id: string;
  label: string;
  description?: string;
  keywords?: string[];
  group?: string;
  category?: string;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  disabled?: boolean;
  action?: () => void;
  onSelect?: () => void;
}

export interface LegacyCommandGroup {
  id: string;
  label: string;
  items: LegacyCommandItem[];
}

function LegacyItem({ item, onSelect }: { item: LegacyCommandItem; onSelect?: ((item: LegacyCommandItem) => void) | undefined }) {
  const latest = React.useRef<() => void>(() => {});
  latest.current = () => {
    item.action?.();
    item.onSelect?.();
    onSelect?.(item);
  };
  const select = React.useCallback(() => latest.current(), []);
  const words = [item.label, item.description ?? '', ...(item.keywords ?? [])].filter(Boolean).join('\u0000');
  const keywords = React.useMemo(() => words.split('\u0000'), [words]);
  return (
    <Command.Item
      value={item.id}
      keywords={keywords}
      onSelect={select}
      {...(item.disabled ? { disabled: true } : {})}
      {...(item.shortcut !== undefined ? { shortcut: item.shortcut } : {})}
    >
      {item.icon}
      {item.label}
      {item.description !== undefined ? <span> {item.description}</span> : null}
    </Command.Item>
  );
}

export function commandGroups(
  items: readonly LegacyCommandItem[] | undefined,
  groups: readonly LegacyCommandGroup[] | undefined,
  onSelect?: (item: LegacyCommandItem) => void,
): React.ReactNode {
  const resolved: { key: string; heading: string | undefined; items: readonly LegacyCommandItem[] }[] = [];
  if (groups && groups.length) {
    for (const g of groups) resolved.push({ key: g.id, heading: g.label, items: g.items });
  } else {
    const byName = new Map<string, LegacyCommandItem[]>();
    for (const item of items ?? []) {
      const name = item.group ?? item.category ?? '';
      if (!byName.has(name)) byName.set(name, []);
      byName.get(name)!.push(item);
    }
    for (const [name, list] of byName) resolved.push({ key: name || '_', heading: name || undefined, items: list });
  }
  return resolved.map((g) => {
    const rows = g.items.map((item) => <LegacyItem key={item.id} item={item} onSelect={onSelect} />);
    return g.heading !== undefined ? (
      <Command.Group key={g.key} heading={g.heading}>
        {rows}
      </Command.Group>
    ) : (
      <React.Fragment key={g.key}>{rows}</React.Fragment>
    );
  });
}
