// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassFormField } from 'aura-glass';

export function X() {
  return <GlassFormField label="Email" error={err}><input/></GlassFormField>;
}
