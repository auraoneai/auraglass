/* CMP-325 compat: GlassActionBar (4.x) -> Toolbar (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { renderToolbarItems } from './GlassToolbar';
import type { GlassToolbarItem } from './GlassToolbar';
import { Toolbar } from '../../../components/toolbar';

const DEP = 'DEP-C0018';

export interface GlassActionBarProps {
  actions?: readonly GlassToolbarItem[];
  'aria-label'?: string;
  children?: React.ReactNode;
  className?: string;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Toolbar}. */
export function GlassActionBar({ actions, children, ...rest }: GlassActionBarProps) {
  warnDeprecated(DEP);
  return (
    <Toolbar.Root aria-label={(rest as Record<string, unknown>)['aria-label'] as string ?? 'Action bar'} {...rest}>
      {children}
      {actions ? renderToolbarItems(actions, DEP) : null}
    </Toolbar.Root>
  );
}
