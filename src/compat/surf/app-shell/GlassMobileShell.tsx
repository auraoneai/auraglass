/* GlassMobileShell — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { MobileShell } from '../../../app-shell/MobileShell';

export type GlassMobileShellProps = Record<string, unknown> & { children?: React.ReactNode };

export function GlassMobileShell(props: GlassMobileShellProps) {
  warnDeprecated('GlassMobileShell');
  const { topBar, tabBar, children, ...rest } = props as Record<string, React.ReactNode>;
  return <MobileShell topBar={topBar} tabBar={tabBar} {...rest}>{children}</MobileShell>;
}
