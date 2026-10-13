// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Sheet } from 'aura-glass';

export function X() {
  return <Sheet.Root open={o}><Sheet.Content side="bottom">…</Sheet.Content></Sheet.Root>;
}
