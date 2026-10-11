// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassToast } from 'aura-glass';

export function X() {
  return <GlassToast message="Saved" type="success" duration={3000} onClose={cb} />;
}
