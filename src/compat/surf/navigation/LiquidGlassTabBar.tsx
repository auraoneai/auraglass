/* LiquidGlassTabBar — 4.x compat adapter (REQ-SURF-13, DEP-S0015) → TabBar
   appearance="floating". tabs/activeTab(id)/onChange(id) → TabBar.Item,
   searchTabId's tab → TabBar.Search, bottomAccessory → TabBar.Accessory,
   minimizeBehavior other than 'never' → minimizeOnScroll, accessoryPlacement
   'collapsed' → 'minimize', otherwise 'persist'. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { TabBar } from '../../../components/tab-bar/TabBar';
import { domProps } from '../_shared';
import { tabItems, type LegacyTabItem } from './_tabItems';

export interface LiquidGlassTabBarProps {
  tabs?: (LegacyTabItem & { id: string })[];
  activeTab?: string;
  onChange?: (id: string) => void;
  minimizeBehavior?: 'never' | 'on-scroll-down' | 'on-scroll' | 'auto';
  searchTabId?: string;
  bottomAccessory?: React.ReactNode;
  accessoryPlacement?: 'above' | 'collapsed' | 'auto';
  'aria-label'?: string;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `LiquidGlassTabBar` compat adapter (DEP-S0015).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link TabBar from aura-glass}.
 */
export function LiquidGlassTabBar(props: LiquidGlassTabBarProps) {
  warnDeprecated('DEP-S0015');
  const {
    tabs = [], activeTab, onChange, minimizeBehavior = 'auto', searchTabId, bottomAccessory, accessoryPlacement,
    'aria-label': ariaLabel = 'Tabs', children, ...rest
  } = props;
  const destinations = tabs.filter((t) => t.id !== searchTabId);
  return (
    <TabBar.Root
      appearance="floating"
      placement="floating"
      aria-label={ariaLabel}
      minimizeOnScroll={minimizeBehavior !== 'never'}
      {...(bottomAccessory != null ? { accessoryPlacement: accessoryPlacement === 'collapsed' ? 'minimize' as const : 'persist' as const } : {})}
      {...domProps(rest)}
    >
      {tabItems(destinations, (t) => t.id === activeTab, (t) => t.id !== undefined && onChange?.(t.id))}
      {searchTabId !== undefined ? (
        <li>
          <TabBar.Search />
        </li>
      ) : null}
      {bottomAccessory != null ? (
        <li>
          <TabBar.Accessory>{bottomAccessory}</TabBar.Accessory>
        </li>
      ) : null}
      {children}
    </TabBar.Root>
  );
}
