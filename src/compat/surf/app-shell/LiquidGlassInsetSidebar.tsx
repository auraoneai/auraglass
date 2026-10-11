/* LiquidGlassInsetSidebar — 4.x compat adapter (REQ-SURF-13, DEP-S0032) →
   Sidebar appearance="inset". items/selectedId/onSelect(id) → Sidebar.Item
   (handler-only items render <button type="button">, current = selectedId);
   materialVariant → the Sidebar material `variant`. placement/collapsed are
   owned by the 5.0 AppShell (sidebarSide / sidebar state) and are dropped. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Sidebar } from '../../../app-shell/Sidebar';
import { domProps } from '../_shared';
import { navItems } from './_navItems';

export interface LiquidGlassSidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface LiquidGlassInsetSidebarProps {
  items?: LiquidGlassSidebarItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  materialVariant?: 'regular' | 'clear';
  'aria-label'?: string;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `LiquidGlassInsetSidebar` compat adapter (DEP-S0032).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Sidebar appearance="inset" from aura-glass/app-shell}.
 */
export function LiquidGlassInsetSidebar(props: LiquidGlassInsetSidebarProps) {
  warnDeprecated('DEP-S0032');
  const {
    items = [], selectedId, onSelect, materialVariant, 'aria-label': ariaLabel = 'Sidebar', children, ...rest
  } = props;
  return (
    <Sidebar.Root appearance="inset" {...(materialVariant ? { variant: materialVariant } : {})} {...domProps(rest)}>
      <Sidebar.Content>
        <Sidebar.Nav aria-label={ariaLabel}>
          {navItems(items, { current: selectedId, onActivate: (item) => item.id !== undefined && onSelect?.(item.id) })}
        </Sidebar.Nav>
        {children}
      </Sidebar.Content>
    </Sidebar.Root>
  );
}
