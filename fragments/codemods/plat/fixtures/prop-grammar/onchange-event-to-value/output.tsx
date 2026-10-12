// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassInput } from 'aura-glass';

export function X() {
  return <GlassInput value={name} onValueChange={(e) => setName(e)} error={err} />;
}
