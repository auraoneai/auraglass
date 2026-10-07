/* GlassHeader — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { TopBar } from '../../../app-shell/TopBar';

export type GlassHeaderProps = Record<string, unknown> & { children?: React.ReactNode };

export function GlassHeader(props: GlassHeaderProps) {
  warnDeprecated('GlassHeader');
  const { children, ...rest } = props as Record<string, React.ReactNode>;
  return <TopBar.Root {...rest}>{children}</TopBar.Root>;
}
