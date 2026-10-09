/* GlassStatusBar — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { StatusBar } from '../../../app-shell/StatusBar';

export type GlassStatusBarProps = Record<string, unknown> & { children?: React.ReactNode };

export function GlassStatusBar(props: GlassStatusBarProps) {
  warnDeprecated('DEP-S0662');
  const { children, ...rest } = props as Record<string, React.ReactNode>;
  return <StatusBar.Root {...rest}>{children}</StatusBar.Root>;
}
