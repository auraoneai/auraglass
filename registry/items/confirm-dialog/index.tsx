"use client";
/* CMP-344 + REQ-CMP-140: registry item confirm-dialog — AlertDialog composition
   replacing the 4.x modal confirm variants. Registry items import 'aura-glass'
   (PLAT's builder rewrites to consumer-resolved paths) and are never
   root-exported (D-15/D-17). */
import * as React from "react";
import { AlertDialog } from "aura-glass";

export interface ConfirmDialogProps {
  /** 'destructive' renders the confirm in danger intent; 'neutral' is the default. */
  variant?: "destructive" | "neutral";
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
  variant = "neutral",
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  open,
  defaultOpen,
  onConfirm,
  onOpenChange,
  trigger,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange !== undefined
        ? { onOpenChange: (o: boolean) => onOpenChange(o) }
        : {})}
    >
      {trigger ? <AlertDialog.Trigger>{trigger}</AlertDialog.Trigger> : null}
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>{title}</AlertDialog.Title>
          {description ? (
            <AlertDialog.Description>{description}</AlertDialog.Description>
          ) : null}
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>{cancelLabel}</AlertDialog.Cancel>
          <AlertDialog.Action
            intent={variant === "destructive" ? "danger" : "neutral"}
            {...(onConfirm !== undefined ? { onClick: onConfirm } : {})}
          >
            {confirmLabel}
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
export default ConfirmDialog;
