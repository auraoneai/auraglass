/* CMP-339 compat: GlassPopover (4.x) -> Popover (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { PopoverPortal, PopoverPositioner, PopoverPopup, Popover } from '../../../components/popover';
import type { OverlayOpenChangeDetails } from '../../../components/overlays/_shared';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0107';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

type Side = 'top' | 'bottom' | 'left' | 'right';
type Align = 'start' | 'center' | 'end';

export interface GlassPopoverProps {
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  placement?: string;                 // 'bottom-start' -> side bottom, align start
  side?: Side;
  align?: Align;
  trigger?: 'click' | 'hover' | React.ReactNode;
  content?: React.ReactNode;
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function splitPlacement(p?: string): { side?: Side; align?: Align } {
  if (!p) return {};
  const [a, b] = p.split('-');
  const side = (['top', 'bottom', 'left', 'right'] as const).includes(a as Side) ? (a as Side) : undefined;
  const align = (['start', 'end', 'center'] as const).includes(b as Align) ? (b as Align) : undefined;
  return { ...(side !== undefined ? { side } : {}), ...(align !== undefined ? { align } : {}) };
}

export function GlassPopover({ open, onClose, onOpenChange, placement, side, align, trigger, content, title, children, className }: GlassPopoverProps) {
  warnDeprecated(DEP);
  const pos = splitPlacement(placement);
  const s = side ?? pos.side;
  const a = align ?? pos.align;
  const hover = trigger === 'hover';
  return wrap('GlassPopover', (
    <Popover.Root
      {...(open !== undefined ? { open } : {})}
      onOpenChange={(o: boolean, _d: OverlayOpenChangeDetails) => { onOpenChange?.(o); if (!o) onClose?.(); }}
    >
      <Popover.Trigger {...(hover ? { openOnHover: true } : {})}>
        {typeof trigger === 'string' ? 'Trigger' : trigger ?? children}
      </Popover.Trigger>
      <PopoverPortal>
        <PopoverPositioner {...(s !== undefined ? { side: s } : {})} {...(a !== undefined ? { align: a } : {})}>
          <PopoverPopup {...(className !== undefined ? { className } : {})}>
            {title !== undefined ? <Popover.Title>{title}</Popover.Title> : null}
            {content}
          </PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover.Root>
  ));
}
