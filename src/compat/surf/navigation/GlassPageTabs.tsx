/* GlassPageTabs — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Tabs } from '../../../components/tabs/Tabs';

/** @deprecated GlassPageTabsProps DEP-S0684 since 4.2.0, removed in 6.0.0. */
export type GlassPageTabsProps = Record<string, unknown> & { children?: React.ReactNode };

export function GlassPageTabs(props: GlassPageTabsProps) {
  warnDeprecated('DEP-S0684');
  const { value, onChange, children, ...rest } = props as Record<string, React.ReactNode>;
  return <Tabs.Root value={value as never} onValueChange={onChange as never} {...rest}>{children}</Tabs.Root>;
}
