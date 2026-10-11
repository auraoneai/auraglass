/* GlassInspector — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Inspector } from '../../../app-shell/Inspector';

export type GlassInspectorProps = Record<string, unknown> & { children?: React.ReactNode };

export function GlassInspector(props: GlassInspectorProps) {
  warnDeprecated('GlassInspector');
  const { children, ...rest } = props as Record<string, React.ReactNode>;
  return <Inspector.Root aria-label="Inspector" {...rest}>{children}</Inspector.Root>;
}
