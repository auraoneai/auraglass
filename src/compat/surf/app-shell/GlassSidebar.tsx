/* GlassSidebar — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Sidebar } from '../../../app-shell/Sidebar';

/** @deprecated GlassSidebarProps DEP-S0660 since 4.2.0, removed in 6.0.0. */
export type GlassSidebarProps = Record<string, unknown> & { children?: React.ReactNode };

export function GlassSidebar(props: GlassSidebarProps) {
  warnDeprecated('DEP-S0660');
  const { items, children, ...rest } = props as Record<string, React.ReactNode>;
  return <Sidebar.Root {...rest}><Sidebar.Nav aria-label="Navigation">{children}</Sidebar.Nav></Sidebar.Root>;
}
