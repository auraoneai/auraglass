// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Dialog } from 'aura-glass';

export function X() {
  return <Dialog.Root open={open} onOpenChange={(o)=>{if(!o) close();}}><Dialog.Popup><Dialog.Title>Confirm</Dialog.Title>…</Dialog.Popup></Dialog.Root>;
}
