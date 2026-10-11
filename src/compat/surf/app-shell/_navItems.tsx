/* Shared 4.x navigation-item mapping for the sidebar-family compat adapters
   (GlassSidebar, GlassSidebarRail, LiquidGlassInsetSidebar,
   GlassNavigationMenu, GlassMobileNav — REQ-SURF-13). A 4.x item becomes a
   Sidebar.Item: `href` stays a link; handler-only items render as
   <button type="button"> (the app-shell-slots codemod output); nested
   `children` become a Sidebar.Collapsible; the active id becomes `current`. */
import * as React from 'react';
import { Sidebar } from '../../../app-shell/Sidebar';
import { itemRender } from '../_shared';

export interface LegacyNavItem {
  id?: string;
  label: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  action?: () => void;
  onSelect?: () => void;
  children?: LegacyNavItem[];
}

export interface NavItemsOptions {
  /** id (or href) of the current destination. */
  current?: string | undefined;
  /** Called with the item's id when a handler-only item is activated. */
  onActivate?: ((item: LegacyNavItem) => void) | undefined;
  /** Collapsible ids that start open. */
  openIds?: readonly string[] | undefined;
  /** Rail-only presentation: the label is still the accessible name. */
  iconFallback?: boolean | undefined;
}

function keyOf(item: LegacyNavItem, index: number): string {
  return item.id ?? item.href ?? `item-${index}`;
}

export function navItems(items: readonly LegacyNavItem[] | undefined, opts: NavItemsOptions = {}): React.ReactNode {
  return (items ?? []).map((item, index) => {
    const key = keyOf(item, index);
    if (item.children && item.children.length) {
      return (
        <Sidebar.Collapsible
          key={key}
          label={item.label}
          {...(opts.openIds?.includes(key) ? { defaultOpen: true } : {})}
        >
          {navItems(item.children, opts)}
        </Sidebar.Collapsible>
      );
    }
    const handler = item.onClick ?? item.action ?? item.onSelect;
    const activate = () => {
      handler?.();
      opts.onActivate?.(item);
    };
    const target = itemRender(item.href, activate, item.disabled);
    const isCurrent = opts.current !== undefined && (opts.current === item.id || opts.current === item.href);
    const icon =
      item.icon ?? (opts.iconFallback && typeof item.label === 'string' ? item.label.slice(0, 1).toUpperCase() : undefined);
    return (
      <Sidebar.Item
        key={key}
        {...target}
        {...(item.href !== undefined && (handler || opts.onActivate) ? { onClick: activate } : {})}
        current={isCurrent}
        {...(icon !== undefined ? { icon } : {})}
        {...(item.badge !== undefined ? { badge: item.badge } : {})}
        {...(item.disabled && item.href !== undefined ? { 'aria-disabled': true } : {})}
      >
        {item.label}
      </Sidebar.Item>
    );
  });
}
