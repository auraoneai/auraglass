/* GlassPageHeader — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { AppShell } from '../../../app-shell/AppShell';

export type GlassPageHeaderProps = Record<string, unknown> & { children?: React.ReactNode };

export function GlassPageHeader(props: GlassPageHeaderProps) {
  warnDeprecated('DEP-S0661');
  const { title, children, ...rest } = props as Record<string, React.ReactNode>;
  return <AppShell.PageHeader title={title}>{children}</AppShell.PageHeader>;
}
