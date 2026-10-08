// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { TextField } from 'aura-glass';

export function X() {
  return <TextField multiline label="Bio" value={b} onChange={e=>setB(e.target.value)} />;
}
