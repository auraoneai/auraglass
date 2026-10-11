/* CMP-217: AlertDialog layout parts — plain divs mirroring DialogLayout. */
import * as React from 'react';
import { cn } from '../../internal';
import type { AlertDialogLayoutProps } from './AlertDialog.types';

export function AlertDialogHeader({ children, className }: AlertDialogLayoutProps) {
  return <div data-ag-part="header" className={cn('ag-alert-dialog-header', className)}>{children}</div>;
}
export function AlertDialogBody({ children, className, padding = 'default' }: AlertDialogLayoutProps) {
  return <div data-ag-part="body" data-padding={padding} className={cn('ag-alert-dialog-body', className)}>{children}</div>;
}
export function AlertDialogFooter({ children, className }: AlertDialogLayoutProps) {
  return <div data-ag-part="footer" className={cn('ag-alert-dialog-footer', className)}>{children}</div>;
}
