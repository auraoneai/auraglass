/* CMP-340 compat: GlassContextMenu (4.x) -> ContextMenu (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ContextMenu } from '../../../components/menu';
import type { OverlayOpenChangeDetails } from '../../../components/overlays/_shared';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0112';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface GlassContextMenuProps {
  items?: readonly { label?: React.ReactNode; onSelect?: () => void; disabled?: boolean }[];
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link ContextMenu}. */
export function GlassContextMenu({ items, onClose, onOpenChange, children }: GlassContextMenuProps) {
  warnDeprecated(DEP);
  return wrap('GlassContextMenu', (
    <ContextMenu.Root
      {...(onClose !== undefined || onOpenChange !== undefined
        ? { onOpenChange: (o: boolean, _d: OverlayOpenChangeDetails) => { onOpenChange?.(o); if (!o) onClose?.(); } }
        : {})}
    >
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
    {items?.map((it, i) => (
      <ContextMenu.Item
        key={i}
        {...(it.disabled !== undefined ? { disabled: it.disabled } : {})}
        {...(it.onSelect !== undefined ? { onClick: it.onSelect } : {})}
      >
        {it.label}
      </ContextMenu.Item>
    ))}
      </ContextMenu.Content>
    </ContextMenu.Root>
  ));
}
