/* LiquidGlassTransitionProvider — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { SourceTransition } from '../../../components/source-transition/SourceTransition';

export type LiquidGlassTransitionProviderProps = Record<string, unknown> & { children?: React.ReactNode };

export function LiquidGlassTransitionProvider(props: LiquidGlassTransitionProviderProps) {
  warnDeprecated('DEP-S0675');
  const { children, ...rest } = props as Record<string, React.ReactNode>;
  return <SourceTransition.Root {...rest}>{children}</SourceTransition.Root>;
}
