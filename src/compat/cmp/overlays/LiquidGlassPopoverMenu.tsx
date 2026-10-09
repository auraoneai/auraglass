/* CMP-340 compat: LiquidGlassPopoverMenu (4.x) -> Menu (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Menu } from '../../../components/menu';
import type { OverlayOpenChangeDetails } from '../../../components/overlays/_shared';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0114';

export interface LiquidGlassPopoverMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/** @deprecated LiquidGlassPopoverMenu DEP-C0114 since 4.3.0, removed in 5.0.0. {@link Menu} */
export function LiquidGlassPopoverMenu({ open, onOpenChange, trigger, children, className }: LiquidGlassPopoverMenuProps) {
  warnDeprecated(DEP);
  return wrap('LiquidGlassPopoverMenu', (
    <Menu.Root
      {...(open !== undefined ? { open } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange: (o: boolean, _d: OverlayOpenChangeDetails) => onOpenChange(o) } : {})}
    >
      <Menu.Trigger>{trigger}</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup className={className}>{children}</Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ));
}
