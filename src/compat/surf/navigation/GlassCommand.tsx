/* GlassCommand — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Command } from '../../../components/command-palette/Command';

/** @deprecated GlassCommandProps DEP-S0677 since 4.2.0, removed in 6.0.0. */
export type GlassCommandProps = Record<string, unknown> & { children?: React.ReactNode };

export function GlassCommand(props: GlassCommandProps) {
  warnDeprecated('DEP-S0677');
  const { children, ...rest } = props as Record<string, React.ReactNode>;
  return <Command.Root {...rest}>{children}</Command.Root>;
}
