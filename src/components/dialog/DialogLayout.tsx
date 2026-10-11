/* CMP-214 (REQ-CMP-82): Dialog layout parts — plain divs, no directive, no
   hooks, no data-ag-surface (layout parts are not surfaces). Body scrolls
   internally and gets scroll-padding from the measured header/footer block
   sizes (--_ag-dialog-head-h / --_ag-dialog-foot-h set by the Popup's
   ResizeObserver) so focused controls are never obscured (WCAG 2.4.11). */
import * as React from 'react';
import { cn } from '../../internal';
import type { DialogLayoutProps } from './Dialog.types';

export function DialogHeader({ children, className }: DialogLayoutProps) {
  return (
    <div data-ag-part="header" className={cn('ag-dialog-header', className)}>
      {children}
    </div>
  );
}

export function DialogBody({ children, className, padding = 'default' }: DialogLayoutProps) {
  return (
    <div
      data-ag-part="body"
      data-padding={padding}
      className={cn('ag-dialog-body', className)}
    >
      {children}
    </div>
  );
}

export function DialogFooter({ children, className }: DialogLayoutProps) {
  return (
    <div data-ag-part="footer" className={cn('ag-dialog-footer', className)}>
      {children}
    </div>
  );
}
