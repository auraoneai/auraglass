/* LiquidGlassBottomAccessory — 4.x compat adapter (REQ-SURF-13, DEP-S0017)
   → TabBar.Accessory. `collapsed` is TabBar's minimize state
   (accessoryPlacement) in 5.0 and is dropped; children render unchanged. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { TabBar } from '../../../components/tab-bar/TabBar';
import { domProps } from '../_shared';

export interface LiquidGlassBottomAccessoryProps {
  collapsed?: boolean;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `LiquidGlassBottomAccessory` compat adapter (DEP-S0017).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link TabBar accessory}.
 */
export function LiquidGlassBottomAccessory(props: LiquidGlassBottomAccessoryProps) {
  warnDeprecated('DEP-S0017');
  const { collapsed: _collapsed, children, ...rest } = props;
  return <TabBar.Accessory {...domProps(rest)}>{children}</TabBar.Accessory>;
}
