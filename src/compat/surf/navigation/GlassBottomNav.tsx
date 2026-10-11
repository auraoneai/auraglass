/* GlassBottomNav — 4.x compat adapter (REQ-SURF-13, DEP-S0016) → TabBar
   (bottom placement). items/activeId/onActiveChange(id) → TabBar.Item
   (activeIcon on the current item, badge), variant 'floating' →
   appearance="floating", showLabels={false} keeps labels as accessible names.
   renderItem/elevation/size/safeArea have no 5.0 equivalent (TabBar owns
   item rendering and safe-area padding). */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { TabBar } from '../../../components/tab-bar/TabBar';
import { domProps } from '../_shared';
import { tabItems, type LegacyTabItem } from './_tabItems';

export interface GlassBottomNavProps {
  items?: (LegacyTabItem & { id: string })[];
  activeId?: string;
  onActiveChange?: (id: string) => void;
  variant?: 'default' | 'floating' | 'minimal';
  showLabels?: boolean;
  'aria-label'?: string;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassBottomNav` compat adapter (DEP-S0016).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link TabBar from aura-glass}.
 */
export function GlassBottomNav(props: GlassBottomNavProps) {
  warnDeprecated('DEP-S0016');
  const {
    items = [], activeId, onActiveChange, variant, showLabels = true, 'aria-label': ariaLabel = 'Primary',
    children, ...rest
  } = props;
  return (
    <TabBar.Root
      placement="bottom"
      appearance={variant === 'floating' ? 'floating' : 'bar'}
      aria-label={ariaLabel}
      {...domProps(rest)}
    >
      {tabItems(items, (t) => t.id === activeId, (t) => t.id !== undefined && onActiveChange?.(t.id), { showLabels })}
      {children}
    </TabBar.Root>
  );
}
