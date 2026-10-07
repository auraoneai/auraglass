/* GlassTopBar — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { TopBar } from '../../../app-shell/TopBar';

export type GlassTopBarProps = Record<string, unknown> & { children?: React.ReactNode };

export function GlassTopBar(props: GlassTopBarProps) {
  warnDeprecated('GlassTopBar');
  const { children, ...rest } = props as Record<string, React.ReactNode>;
  return <TopBar.Root {...rest}>{children}</TopBar.Root>;
}
