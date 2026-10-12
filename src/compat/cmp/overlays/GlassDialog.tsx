/* CMP-337 compat: GlassDialog (4.x) -> Dialog (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Dialog } from '../../../components/dialog';
import { Button } from '../../../components/button';
import { useGlassModalMapping } from './GlassModal';
import type { GlassModalProps } from './GlassModal';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0102';

export interface GlassDialogProps extends GlassModalProps {
  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;
  destructive?: boolean;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Dialog}. */
export function GlassDialog(props: GlassDialogProps) {
  warnDeprecated(DEP);
  const { confirmText, cancelText, destructive } = props;
  const m = useGlassModalMapping(props, DEP);
  const appearance = m.mappedAppearance;
  return wrap('GlassDialog', (
    <Dialog.Root {...(m.open !== undefined ? { open: m.open } : {})} onOpenChange={m.handleOpenChange}>
      {m.trigger ? <Dialog.Trigger>{m.trigger}</Dialog.Trigger> : null}
      <Dialog.Content {...(m.mappedSize !== undefined ? { size: m.mappedSize as 'sm' | 'md' | 'lg' } : {})} {...(appearance !== undefined ? { appearance: appearance as 'wide' | 'fullscreen' } : {})} {...(m.className !== undefined ? { className: m.className } : {})}>
        {m.title !== undefined ? <Dialog.Title>{m.title}</Dialog.Title> : null}
        {m.description !== undefined ? <Dialog.Description>{m.description}</Dialog.Description> : null}
        {m.children}
        {(m.footer !== undefined || confirmText !== undefined || cancelText !== undefined) ? (
          <Dialog.Footer>
            {cancelText !== undefined ? <Dialog.Close>{cancelText}</Dialog.Close> : null}
            {m.footer}
            {confirmText !== undefined ? (
              /* destructive -> Button intent="danger" (Button owns data-ag-intent). */
              <Dialog.Close {...(destructive ? { render: <Button intent="danger" suppressInnerParts /> } : {})}>{confirmText}</Dialog.Close>
            ) : null}
          </Dialog.Footer>
        ) : null}
      </Dialog.Content>
    </Dialog.Root>
  ));
}
