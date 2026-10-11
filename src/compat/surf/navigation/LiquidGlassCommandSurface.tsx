/* LiquidGlassCommandSurface — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { CommandPalette } from '../../../components/command-palette/CommandPalette';

export type LiquidGlassCommandSurfaceProps = Record<string, unknown> & { children?: React.ReactNode };

export function LiquidGlassCommandSurface(props: LiquidGlassCommandSurfaceProps) {
  warnDeprecated('LiquidGlassCommandSurface');
  const { children, ...rest } = props as Record<string, React.ReactNode>;
  return <CommandPalette {...rest}>{children}</CommandPalette>;
}
