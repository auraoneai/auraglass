/* GlassMobileNav — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { SidebarDrawer } from '../../../app-shell/Sidebar.Drawer';

/** @deprecated GlassMobileNavProps DEP-S0673 since 4.2.0, removed in 6.0.0. */
export type GlassMobileNavProps = Record<string, unknown> & { children?: React.ReactNode };

export function GlassMobileNav(props: GlassMobileNavProps) {
  warnDeprecated('DEP-S0673');
  const { children, ...rest } = props as Record<string, React.ReactNode>;
  return <SidebarDrawer {...rest}>{children}</SidebarDrawer>;
}
