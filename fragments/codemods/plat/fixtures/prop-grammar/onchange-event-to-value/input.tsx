// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassInput } from 'aura-glass';

export function X() {
  return <GlassInput value={name} onChange={(e: any) => setName(e.target.value)} errorText={err} />;
}
