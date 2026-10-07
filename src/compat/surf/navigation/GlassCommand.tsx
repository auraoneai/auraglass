/* GlassCommand — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Command } from '../../../components/command-palette/Command';

export type GlassCommandProps = Record<string, unknown> & { children?: React.ReactNode };

export function GlassCommand(props: GlassCommandProps) {
  warnDeprecated('GlassCommand');
  const { children, ...rest } = props as Record<string, React.ReactNode>;
  return <Command.Root {...rest}>{children}</Command.Root>;
}
