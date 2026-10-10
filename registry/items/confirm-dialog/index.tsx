'use client';
/* CMP-344: registry item confirm-dialog — AlertDialog composition replacing the
   4.x modal confirm variants. D-15/D-17: registry items are never root-exported. */
import * as React from 'react';
import { AlertDialog } from '../../../src/components/alert-dialog';
import { Button } from '../../../src/components/button';

export interface ConfirmDialogProps {
  /** 'destructive' renders the confirm in danger intent; 'neutral' is the default. */
  variant?: 'destructive' | 'neutral';
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onConfirm?: () => void;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
}

export function ConfirmDialog({
  variant = 'neutral', title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  open, defaultOpen, onConfirm, onOpenChange, trigger,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root
      intent={variant === 'destructive' ? 'danger' : 'neutral'}
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange: (o: boolean) => onOpenChange(o) } : {})}
    >
      {trigger ? <AlertDialog.Trigger>{trigger}</AlertDialog.Trigger> : null}
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>{title}</AlertDialog.Title>
          {description ? <AlertDialog.Description>{description}</AlertDialog.Description> : null}
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>{cancelLabel}</AlertDialog.Cancel>
          <AlertDialog.Action {...(onConfirm !== undefined ? { onClick: onConfirm } : {})}>{confirmLabel}</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
export default ConfirmDialog;
