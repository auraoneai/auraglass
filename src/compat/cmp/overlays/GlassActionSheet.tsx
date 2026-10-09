/* CMP-338 compat: GlassActionSheet (4.x) -> Sheet preset=action (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Sheet } from '../../../components/sheet';
import type { OverlayOpenChangeDetails } from '../../../components/overlays/_shared';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0105';

export interface GlassActionSheetAction {
  label: React.ReactNode;
  onClick?: (e: unknown) => void;
  destructive?: boolean;
}

export interface GlassActionSheetProps {
  open?: boolean;
  onClose?: () => void;
  actions?: readonly GlassActionSheetAction[];
  cancelText?: React.ReactNode;
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/** @deprecated GlassActionSheet DEP-C0105 since 4.3.0, removed in 5.0.0. {@link Sheet} */
export function GlassActionSheet({ open, onClose, actions, cancelText, title, children, className }: GlassActionSheetProps) {
  warnDeprecated(DEP);
  return wrap('GlassActionSheet', (
    <Sheet.Root
      preset="action"
      side="bottom"
      {...(open !== undefined ? { open } : {})}
      onOpenChange={(o: boolean, _d: OverlayOpenChangeDetails) => { if (!o) onClose?.(); }}
    >
      <Sheet.Content {...(className !== undefined ? { className } : {})}>
        {title}
        {children}
        {actions?.map((a, i) => (
          <Sheet.Action key={i} {...(a.onClick !== undefined ? { onClick: a.onClick } : {})}>
            {a.label}
          </Sheet.Action>
        ))}
        {cancelText !== undefined ? <Sheet.Close>{cancelText}</Sheet.Close> : null}
      </Sheet.Content>
    </Sheet.Root>
  ));
}
