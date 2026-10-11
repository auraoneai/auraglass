/* LiquidGlassCommandSurface — 4.x compat adapter (REQ-SURF-13, DEP-S0023)
   → CommandPalette + Command. open/onOpenChange map 1:1; items (grouped by
   `group`, with description and shortcut) → Command.Group/Item whose
   onSelect fires the 4.x item.onSelect; placeholder → Command.Input. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Command } from '../../../components/command-palette/Command';
import { CommandPalette } from '../../../components/command-palette/CommandPalette';
import { commandGroups, type LegacyCommandItem } from './_commandItems';

export interface LiquidGlassCommandSurfaceProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  items?: LegacyCommandItem[];
  placeholder?: string;
  'aria-label'?: string;
  [legacy: string]: unknown;
}

/**
 * 4.x `LiquidGlassCommandSurface` compat adapter (DEP-S0023).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link CommandPalette from aura-glass}.
 */
export function LiquidGlassCommandSurface(props: LiquidGlassCommandSurfaceProps) {
  warnDeprecated('DEP-S0023');
  const { open, defaultOpen, onOpenChange, items, placeholder = 'Search commands' } = props;
  return (
    <CommandPalette
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      <Command.Root>
        <Command.Input placeholder={placeholder} aria-label={props['aria-label'] ?? placeholder} />
        <Command.List>
          {commandGroups(items, undefined)}
          <Command.Empty>No results</Command.Empty>
        </Command.List>
      </Command.Root>
    </CommandPalette>
  );
}
