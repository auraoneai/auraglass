/* GlassTabBar — 4.x compat adapter (REQ-SURF-13, DEP-S0013) → TabBar.
   tabs[] → TabBar.Item, activeTab (4.x index) → current,
   onChange(event, index) fires on activation, showLabels={false} keeps the
   label as the accessible name. Animation/glass styling props are dropped. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { TabBar } from '../../../components/tab-bar/TabBar';
import { domProps } from '../_shared';
import { tabItems, type LegacyTabItem } from './_tabItems';

export interface GlassTabBarProps {
  tabs?: LegacyTabItem[];
  activeTab?: number;
  onChange?: (event: React.SyntheticEvent | null, index: number) => void;
  showLabels?: boolean;
  'aria-label'?: string;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassTabBar` compat adapter (DEP-S0013).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link TabBar from aura-glass}.
 */
export function GlassTabBar(props: GlassTabBarProps) {
  warnDeprecated('DEP-S0013');
  const { tabs, activeTab = 0, onChange, showLabels = true, 'aria-label': ariaLabel = 'Tabs', children: _c, ...rest } = props;
  return (
    <TabBar.Root placement="inline" aria-label={ariaLabel} {...domProps(rest)}>
      {tabItems(tabs, (_t, i) => i === activeTab, (_t, i) => onChange?.(null, i), { showLabels })}
    </TabBar.Root>
  );
}
