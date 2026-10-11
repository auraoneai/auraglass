/* CMP-230: Sheet layout parts — plain divs mirroring DialogLayout. Body is
   focusable for keyboard scrolling at every detent. */
import * as React from 'react';
import { cn } from '../../internal';
import type { SheetLayoutProps } from './Sheet.types';

export function SheetHeader({ children, className }: SheetLayoutProps) {
  return <div data-ag-part="header" className={cn('ag-sheet-header', className)}>{children}</div>;
}
export function SheetBody({ children, className, padding = 'default' }: SheetLayoutProps) {
  return (
    <div data-ag-part="body" data-padding={padding} tabIndex={0} className={cn('ag-sheet-body', className)}>
      {children}
    </div>
  );
}
export function SheetFooter({ children, className }: SheetLayoutProps) {
  return <div data-ag-part="footer" className={cn('ag-sheet-footer', className)}>{children}</div>;
}
