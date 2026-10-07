/* LiquidGlassSource — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { SourceTransition } from '../../../components/source-transition/SourceTransition';

export type LiquidGlassSourceProps = Record<string, unknown> & { children?: React.ReactNode };

export function LiquidGlassSource(props: LiquidGlassSourceProps) {
  warnDeprecated('LiquidGlassSource');
  const { id, children, ...rest } = props as Record<string, React.ReactNode>;
  return <SourceTransition.Source id={id as string} {...rest}>{children}</SourceTransition.Source>;
}
