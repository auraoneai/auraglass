/* LiquidGlassBottomAccessory — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { TabBar } from '../../../components/tab-bar/TabBar';

export type LiquidGlassBottomAccessoryProps = Record<string, unknown> & { children?: React.ReactNode };

export function LiquidGlassBottomAccessory(props: LiquidGlassBottomAccessoryProps) {
  warnDeprecated('LiquidGlassBottomAccessory');
  const { children, ...rest } = props as Record<string, React.ReactNode>;
  return <TabBar.Root placement="bottom" {...rest}>{children}</TabBar.Root>;
}
