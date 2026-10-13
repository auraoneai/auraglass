// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Dialog } from 'aura-glass';

export function X() {
  return <Dialog.Root open={o} onOpenChange={(o)=>{if(!o) close();}}><Dialog.Content><Dialog.Title>Confirm</Dialog.Title>…</Dialog.Content></Dialog.Root>;
}
