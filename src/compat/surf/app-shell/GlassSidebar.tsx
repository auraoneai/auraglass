/* GlassSidebar — 4.x compat adapter (REQ-SURF-13, DEP-S0004) → Sidebar.
   items/activeId → Sidebar.Nav + Sidebar.Item (current), nested children →
   Sidebar.Collapsible, header/logo → Sidebar.Header, footer/userInfo →
   Sidebar.Footer, variant floating → appearance="floating". Collapse state is
   owned by the 5.0 AppShell store (AppShell.SidebarToggle), so collapsed/
   onCollapsedChange/showToggle are dropped. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Sidebar } from '../../../app-shell/Sidebar';
import { domProps } from '../_shared';
import { navItems, type LegacyNavItem } from './_navItems';

export interface GlassSidebarProps {
  items?: LegacyNavItem[];
  activeId?: string;
  variant?: 'default' | 'compact' | 'floating' | 'overlay';
  header?: React.ReactNode;
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  userInfo?: React.ReactNode;
  onNavigate?: (item: LegacyNavItem) => void;
  'aria-label'?: string;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassSidebar` compat adapter (DEP-S0004).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Sidebar from aura-glass/app-shell}.
 */
export function GlassSidebar(props: GlassSidebarProps) {
  warnDeprecated('DEP-S0004');
  const {
    items, activeId, variant, header, logo, footer, userInfo, onNavigate,
    'aria-label': ariaLabel = 'Navigation', children, ...rest
  } = props;
  return (
    <Sidebar.Root appearance={variant === 'floating' ? 'floating' : 'sidebar'} {...domProps(rest)}>
      {header != null || logo != null ? (
        <Sidebar.Header>
          {logo}
          {header}
        </Sidebar.Header>
      ) : null}
      <Sidebar.Content>
        <Sidebar.Nav aria-label={ariaLabel}>
          {navItems(items, { current: activeId, onActivate: onNavigate })}
        </Sidebar.Nav>
        {children}
      </Sidebar.Content>
      {footer != null || userInfo != null ? (
        <Sidebar.Footer>
          {userInfo}
          {footer}
        </Sidebar.Footer>
      ) : null}
    </Sidebar.Root>
  );
}
