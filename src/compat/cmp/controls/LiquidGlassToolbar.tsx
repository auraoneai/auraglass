/* CMP-325 compat: LiquidGlassToolbar (4.x) -> Toolbar (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { renderToolbarItems } from './GlassToolbar';
import type { GlassToolbarProps } from './GlassToolbar';
import { Toolbar } from '../../../components/toolbar';

const DEP = 'DEP-C0012';

export interface LiquidGlassToolbarProps extends GlassToolbarProps {
  floating?: boolean;
}

export function LiquidGlassToolbar({ items, children, floating, ...rest }: LiquidGlassToolbarProps) {
  warnDeprecated(DEP);
  if (floating !== undefined) warnDeprecated(`${DEP}.prop.floating`);
  return (
    <Toolbar.Root aria-label={(rest as Record<string, unknown>)['aria-label'] as string ?? 'Toolbar'} {...rest}>
      {children}
      {items ? renderToolbarItems(items, DEP) : null}
    </Toolbar.Root>
  );
}
