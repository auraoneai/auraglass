/* LiquidGlassDestination — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { SourceTransition } from '../../../components/source-transition/SourceTransition';

/** @deprecated LiquidGlassDestinationProps DEP-S0674 since 4.2.0, removed in 6.0.0. */
export type LiquidGlassDestinationProps = Record<string, unknown> & { children?: React.ReactNode };

export function LiquidGlassDestination(props: LiquidGlassDestinationProps) {
  warnDeprecated('DEP-S0674');
  const { id, children, ...rest } = props as Record<string, React.ReactNode>;
  return <SourceTransition.Destination id={id as string} {...rest}>{children}</SourceTransition.Destination>;
}
