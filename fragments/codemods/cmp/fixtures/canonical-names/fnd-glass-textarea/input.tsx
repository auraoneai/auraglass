// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassTextarea } from 'aura-glass';

export function X() {
  return <GlassTextarea label="Bio" value={b} onChange={e=>setB(e.target.value)} />;
}
