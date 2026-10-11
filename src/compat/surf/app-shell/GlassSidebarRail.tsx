/* GlassSidebarRail — 4.x `aura-glass/app-shell` compat adapter (REQ-SURF-13,
   DEP-S0034) → Sidebar.Root + Sidebar.Nav. Each rail item (id/label/icon/
   active/disabled/onSelect) becomes a Sidebar.Item rendered as a
   <button type="button"> (handler-only, app-shell-slots codemod output); the
   label stays the accessible name, the 4.x initial-letter glyph is kept when
   no icon is given. Rail width is the 5.0 shell's `rail` sidebar state. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Sidebar } from '../../../app-shell/Sidebar';
import { domProps } from '../_shared';
import { navItems } from './_navItems';

export interface GlassSidebarRailItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface GlassSidebarRailProps {
  items?: GlassSidebarRailItem[];
  'aria-label'?: string;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassSidebarRail` compat adapter (DEP-S0034).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Sidebar (rail state) from aura-glass/app-shell}.
 */
export function GlassSidebarRail(props: GlassSidebarRailProps) {
  warnDeprecated('DEP-S0034');
  const { items = [], 'aria-label': ariaLabel = 'Primary navigation', children, ...rest } = props;
  const current = items.find((i) => i.active)?.id;
  return (
    <Sidebar.Root {...domProps(rest)}>
      <Sidebar.Nav aria-label={ariaLabel}>
        {navItems(items, { current, iconFallback: true })}
      </Sidebar.Nav>
      {children}
    </Sidebar.Root>
  );
}
