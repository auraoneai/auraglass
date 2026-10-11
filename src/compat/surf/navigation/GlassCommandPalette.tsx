/* GlassCommandPalette — 4.x compat adapter (REQ-SURF-13, DEP-S0021) →
   CommandPalette (dialog + layer stack) wrapping Command. open/onOpenChange
   map 1:1; items (grouped by category) or groups → Command.Group/Item with
   shortcuts; placeholder → Command.Input; emptyMessage → Command.Empty;
   loading/loadingMessage → Command.Loading; onSelect(item) fires and, with
   closeOnSelect (4.x default true), closes the palette. Recents/fuzzy/sort
   options are replaced by Command's scoring. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Command } from '../../../components/command-palette/Command';
import { CommandPalette } from '../../../components/command-palette/CommandPalette';
import { commandGroups, type LegacyCommandGroup, type LegacyCommandItem } from './_commandItems';

export interface GlassCommandPaletteProps {
  items?: LegacyCommandItem[];
  groups?: LegacyCommandGroup[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (item: LegacyCommandItem) => void;
  placeholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  loadingMessage?: string;
  closeOnSelect?: boolean;
  'aria-label'?: string;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassCommandPalette` compat adapter (DEP-S0021).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link CommandPalette from aura-glass}.
 */
export function GlassCommandPalette(props: GlassCommandPaletteProps) {
  warnDeprecated('DEP-S0021');
  const {
    items, groups, open, defaultOpen, onOpenChange, onSelect, placeholder = 'Search commands...',
    emptyMessage = 'No results found', loading = false, loadingMessage = 'Loading…', closeOnSelect = true,
  } = props;
  const [internal, setInternal] = React.useState(defaultOpen ?? false);
  const isOpen = open ?? internal;
  const setOpen = (next: boolean) => {
    if (open === undefined) setInternal(next);
    onOpenChange?.(next);
  };
  return (
    <CommandPalette open={isOpen} onOpenChange={setOpen}>
      <Command.Root>
        <Command.Input placeholder={placeholder} aria-label={props['aria-label'] ?? placeholder} />
        <Command.List>
          {loading ? <Command.Loading>{loadingMessage}</Command.Loading> : null}
          {commandGroups(items, groups, (item) => {
            onSelect?.(item);
            if (closeOnSelect) setOpen(false);
          })}
          <Command.Empty>{emptyMessage}</Command.Empty>
        </Command.List>
      </Command.Root>
    </CommandPalette>
  );
}
