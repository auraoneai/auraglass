// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassInput } from 'aura-glass';

export function X() {
  return <GlassInput label="Name" value={n} onChange={e=>setN(e.target.value)} />;
}
