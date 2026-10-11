/* GlassNavigationMenu — 4.x compat adapter (REQ-SURF-13, DEP-S0031) →
   Sidebar.Nav (PRD-4 §7: the navigation-menu family consolidates into
   Sidebar). items → Sidebar.Item, nested children → Sidebar.Collapsible
   (defaultOpenItemIds start open), activeItem → current, onItemClick(item) /
   item.action fire on activation. orientation/variant/size are presentation
   props without a 5.0 equivalent and are dropped. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Sidebar } from '../../../app-shell/Sidebar';
import { domProps } from '../_shared';
import { navItems, type LegacyNavItem } from '../app-shell/_navItems';

export interface GlassNavigationMenuProps {
  items?: LegacyNavItem[];
  activeItem?: string;
  onItemClick?: (item: LegacyNavItem) => void;
  defaultOpenItemIds?: string[];
  'aria-label'?: string;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassNavigationMenu` compat adapter (DEP-S0031).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Sidebar.Nav + Sidebar.Item from aura-glass/app-shell}.
 */
export function GlassNavigationMenu(props: GlassNavigationMenuProps) {
  warnDeprecated('DEP-S0031');
  const {
    items = [], activeItem, onItemClick, defaultOpenItemIds, 'aria-label': ariaLabel = 'Navigation', children, ...rest
  } = props;
  return (
    <Sidebar.Nav {...domProps(rest)} aria-label={ariaLabel}>
      {navItems(items, { current: activeItem, onActivate: onItemClick, openIds: defaultOpenItemIds })}
      {children}
    </Sidebar.Nav>
  );
}
