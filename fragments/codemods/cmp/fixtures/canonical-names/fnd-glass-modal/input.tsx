// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassModal } from 'aura-glass';

export function X() {
  return <GlassModal open={open} onClose={close} title="Confirm">…</GlassModal>;
}
