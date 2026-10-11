/* GlassSidebar — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Sidebar } from '../../../app-shell/Sidebar';

export type GlassSidebarProps = Record<string, unknown> & { children?: React.ReactNode };

export function GlassSidebar(props: GlassSidebarProps) {
  warnDeprecated('GlassSidebar');
  const { items, children, ...rest } = props as Record<string, React.ReactNode>;
  return <Sidebar.Root {...rest}><Sidebar.Nav aria-label="Navigation">{children}</Sidebar.Nav></Sidebar.Root>;
}
