/* GlassCommand — 4.x compat adapter (REQ-SURF-13, DEP-S0022) → Command.
   items (grouped by `group`) → Command.Group/Item, placeholder →
   Command.Input, emptyMessage → Command.Empty, loading → Command.Loading,
   onSearchChange → onQueryChange, onSelect(item) fires with the item's
   action. filterItems/groupBy/renderItem are replaced by Command's own
   scoring and parts. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Command } from '../../../components/command-palette/Command';
import { domProps } from '../_shared';
import { commandGroups, type LegacyCommandItem } from './_commandItems';

export interface GlassCommandProps {
  items?: LegacyCommandItem[];
  placeholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  onSelect?: (item: LegacyCommandItem) => void;
  onSearchChange?: (query: string) => void;
  'aria-label'?: string;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassCommand` compat adapter (DEP-S0022).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Command from aura-glass}.
 */
export function GlassCommand(props: GlassCommandProps) {
  warnDeprecated('DEP-S0022');
  const {
    items, placeholder = 'Type a command or search...', emptyMessage = 'No results found', loading = false,
    onSelect, onSearchChange, children, ...rest
  } = props;
  return (
    <Command.Root {...(onSearchChange ? { onQueryChange: onSearchChange } : {})} {...domProps(rest)}>
      <Command.Input placeholder={placeholder} aria-label={props['aria-label'] ?? placeholder} />
      <Command.List>
        {loading ? <Command.Loading>Loading…</Command.Loading> : null}
        {commandGroups(items, undefined, onSelect)}
        <Command.Empty>{emptyMessage}</Command.Empty>
      </Command.List>
      {children}
    </Command.Root>
  );
}
