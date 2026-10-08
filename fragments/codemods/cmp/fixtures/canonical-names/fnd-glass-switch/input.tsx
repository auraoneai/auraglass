// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassSwitch } from 'aura-glass';

export function X() {
  return <GlassSwitch checked={on} onChange={e=>setOn(e.target.checked)} />;
}
