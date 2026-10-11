/* GlassAppShell — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { AppShell } from '../../../app-shell/AppShell';
import { TopBar } from '../../../app-shell/TopBar';
import { StatusBar } from '../../../app-shell/StatusBar';
import { MobileShell } from '../../../app-shell/MobileShell';
import { Sidebar } from '../../../app-shell/Sidebar';
import { Inspector } from '../../../app-shell/Inspector';

export type GlassAppShellProps = Record<string, unknown> & { children?: React.ReactNode };

export function GlassAppShell(props: GlassAppShellProps) {
  warnDeprecated('GlassAppShell');
  const { header, sidebar, footer, children, ...rest } = props as Record<string, React.ReactNode>;
  return <AppShell.Root {...rest}><>{sidebar}{header}{children}{footer}</></AppShell.Root>;
}
