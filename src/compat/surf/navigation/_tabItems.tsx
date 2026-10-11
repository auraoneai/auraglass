/* Shared 4.x tab-item mapping for the tab-bar-family compat adapters
   (GlassTabBar, LiquidGlassTabBar, GlassBottomNav — REQ-SURF-13). Each item
   becomes a TabBar.Item: `href` stays a link, handler-only items render
   <button type="button"> (the app-shell-slots codemod output). */
import * as React from 'react';
import { TabBar } from '../../../components/tab-bar/TabBar';
import { itemRender } from '../_shared';

export interface LegacyTabItem {
  id?: string;
  value?: string | number;
  label: React.ReactNode;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
}

export function tabItems(
  items: readonly LegacyTabItem[] | undefined,
  isCurrent: (item: LegacyTabItem, index: number) => boolean,
  onActivate: (item: LegacyTabItem, index: number) => void,
  { showLabels = true }: { showLabels?: boolean } = {},
): React.ReactNode {
  return (items ?? []).map((item, index) => {
    const current = isCurrent(item, index);
    const activate = () => {
      item.onClick?.();
      onActivate(item, index);
    };
    const icon = current && item.activeIcon !== undefined ? item.activeIcon : item.icon;
    return (
      <TabBar.Item
        key={item.id ?? String(item.value ?? index)}
        {...itemRender(item.href, activate, item.disabled)}
        {...(item.href !== undefined ? { onClick: activate } : {})}
        current={current}
        {...(icon !== undefined ? { icon } : {})}
        {...(item.badge !== undefined && item.badge !== null ? { badge: item.badge } : {})}
        {...(!showLabels && typeof item.label === 'string' ? { 'aria-label': item.label } : {})}
      >
        {showLabels ? item.label : null}
      </TabBar.Item>
    );
  });
}
