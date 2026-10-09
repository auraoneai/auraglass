/* CMP-325 compat: GlassCommandBar (4.x) -> Toolbar (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { renderToolbarItems } from './GlassToolbar';
import type { GlassToolbarItem } from './GlassToolbar';
import { Toolbar } from '../../../components/toolbar';

const DEP = 'DEP-C0016';

export interface GlassCommandBarProps {
  commands?: readonly GlassToolbarItem[];
  items?: readonly GlassToolbarItem[];
  'aria-label'?: string;
  children?: React.ReactNode;
  className?: string;
}

/** @deprecated GlassCommandBar DEP-C0016 since 4.3.0, removed in 5.0.0. {@link Toolbar} */
export function GlassCommandBar({ commands, items, children, ...rest }: GlassCommandBarProps) {
  warnDeprecated(DEP);
  const list = commands ?? items;
  return (
    <Toolbar.Root aria-label={(rest as Record<string, unknown>)['aria-label'] as string ?? 'Command bar'} {...rest}>
      {children}
      {list ? renderToolbarItems(list, DEP) : null}
    </Toolbar.Root>
  );
}
