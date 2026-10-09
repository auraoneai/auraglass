/* GlassWorkspaceTabs — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Tabs } from '../../../components/tabs/Tabs';

export type GlassWorkspaceTabsProps = Record<string, unknown> & { children?: React.ReactNode };

export function GlassWorkspaceTabs(props: GlassWorkspaceTabsProps) {
  warnDeprecated('DEP-S0681');
  const { children, ...rest } = props as Record<string, React.ReactNode>;
  return <Tabs.Root {...rest}>{children}</Tabs.Root>;
}
