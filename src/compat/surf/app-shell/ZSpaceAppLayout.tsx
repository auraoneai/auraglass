/* ZSpaceAppLayout — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { AppShell } from '../../../app-shell/AppShell';

export type ZSpaceAppLayoutProps = Record<string, unknown> & { children?: React.ReactNode };

export function ZSpaceAppLayout(props: ZSpaceAppLayoutProps) {
  warnDeprecated('DEP-S0658');
  const { children, depth, ...rest } = props as Record<string, React.ReactNode>;
  return <AppShell.Root {...rest}>{children}</AppShell.Root>;
}
