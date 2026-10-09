/* GlassTabBar — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { TabBar } from '../../../components/tab-bar/TabBar';

/** @deprecated GlassTabBarProps DEP-S0670 since 4.2.0, removed in 6.0.0. */
export type GlassTabBarProps = Record<string, unknown> & { children?: React.ReactNode };

export function GlassTabBar(props: GlassTabBarProps) {
  warnDeprecated('DEP-S0670');
  const { items, activeTab, children, ...rest } = props as Record<string, React.ReactNode>;
  return <TabBar.Root {...rest}>{children}</TabBar.Root>;
}
