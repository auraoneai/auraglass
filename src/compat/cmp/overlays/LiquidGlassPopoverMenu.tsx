/* CMP-340 compat: LiquidGlassPopoverMenu (4.x) -> Menu (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { MenuPortal, MenuPositioner, MenuPopup, Menu } from '../../../components/menu';
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

export function LiquidGlassPopoverMenu({ open, onOpenChange, trigger, children, className }: LiquidGlassPopoverMenuProps) {
  warnDeprecated(DEP);
  return wrap('LiquidGlassPopoverMenu', (
    <Menu.Root
      {...(open !== undefined ? { open } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange: (o: boolean, _d: OverlayOpenChangeDetails) => onOpenChange(o) } : {})}
    >
      <Menu.Trigger>{trigger}</Menu.Trigger>
      <MenuPortal>
        <MenuPositioner>
          <MenuPopup className={className}>{children}</MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </Menu.Root>
  ));
}
