// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Dialog } from 'aura-glass';

export function X() {
  return <Dialog.Root open={o} onOpenChange={(o)=>{if(!o) close();}}><Dialog.Content>…</Dialog.Content></Dialog.Root>;
}
