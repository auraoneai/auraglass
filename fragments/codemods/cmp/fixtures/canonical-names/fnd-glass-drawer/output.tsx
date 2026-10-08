// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Sheet } from 'aura-glass';

export function X() {
  return <Sheet.Root open={open}><Sheet.Popup side="start">…</Sheet.Popup></Sheet.Root>;
}
