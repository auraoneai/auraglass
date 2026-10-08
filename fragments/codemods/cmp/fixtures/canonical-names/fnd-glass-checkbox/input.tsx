// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassCheckbox } from 'aura-glass';

export function X() {
  return <GlassCheckbox checked={c} onChange={e=>setC(e.target.checked)}>Agree</GlassCheckbox>;
}
