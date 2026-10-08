/* GlassTabBar — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { TabBar } from '../../../components/tab-bar/TabBar';

export type GlassTabBarProps = Record<string, unknown> & { children?: React.ReactNode };

export function GlassTabBar(props: GlassTabBarProps) {
  warnDeprecated('GlassTabBar');
  const { items, activeTab, children, ...rest } = props as Record<string, React.ReactNode>;
  return <TabBar.Root {...rest}>{children}</TabBar.Root>;
}
